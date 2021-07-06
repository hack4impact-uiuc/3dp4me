const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUserAttribute,
} = require('../../utils/auth');
const omitDeep = require('omit-deep-lodash');
const {
    expectStrictEqualWithTimestampOrdering,
    areObjectsDisjoint,
} = require('../../utils/utils');
const {
    POST_FINISHED_STEP_DATA,
    DEFAULT_STEP_DATA,
    POST_IMMUTABLE_STEP_DATA,
} = require('../../mock-data/patients-mock-data');

describe('POST /patient', () => {
    const STEP_KEY = 'example';
    const PATIENT_ID_MISSING_DATA = '60944e084f4c0d4330cc258d';
    const PATIENT_ID_WITH_DATA = '60944e084f4c0d4330cc2594';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 500 when given bad ID format', (done) => {
        withAuthentication(
            request(server).post(`/api/patients/badid/${STEP_KEY}`),
        ).expect(500, done);
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).post(`/api/patients/${randID}/${STEP_KEY}`),
        ).expect(404, done);
    });

    it('returns 404 when given bad stepKey', (done) => {
        withAuthentication(
            request(server).post(
                `/api/patients/${PATIENT_ID_MISSING_DATA}/badstep`,
            ),
        ).expect(404, done);
    });

    it('saves data for patient which had no prior data', async () => {
        await testPostOnPatient(PATIENT_ID_MISSING_DATA);
    });

    it('saves data for patient with prior data', async () => {
        await testPostOnPatient(PATIENT_ID_WITH_DATA);
    });

    it('sets defaults on missing fields', async () => {
        const patientID = PATIENT_ID_MISSING_DATA;
        const startTimestamp = Date.now();
        const body = {};
        let expectedResult = {
            ...DEFAULT_STEP_DATA,
            patientId: patientID,
            lastEdited: startTimestamp,
            lastEditedBy: getCurrentAuthenticatedUserAttribute('name'),
        };

        // Send the request
        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${patientID}/${STEP_KEY}`)
                .send(body),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that DB is correct
        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: patientID });

        expect(updatedData._id).not.toBeNull();
        expect(updatedData.date.getTime()).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        updatedData = _.omit(updatedData, ['_id', 'date', '__v']);
        expectedResult = _.omit(expectedResult, ['_id', 'date', '__v']);

        expectStrictEqualWithTimestampOrdering(expectedResult, updatedData);
    });

    it('ignores modification of immutable fields', async () => {
        const patientID = PATIENT_ID_WITH_DATA;
        const body = POST_IMMUTABLE_STEP_DATA;

        // Send the request
        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${patientID}/${STEP_KEY}`)
                .send(body),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that DB is correct
        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: patientID });

        expect(updatedData).not.toBeNull();
        expect(areObjectsDisjoint(updatedData, body)).toBeTruthy();
    });

    const testPostOnPatient = async (patientID) => {
        const startTimestamp = Date.now();
        const body = POST_FINISHED_STEP_DATA;
        const expectedResult = {
            ...body,
            lastEdited: startTimestamp,
            patientId: patientID,
            lastEditedBy: getCurrentAuthenticatedUserAttribute('name'),
        };

        // Send the request
        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${patientID}/${STEP_KEY}`)
                .send(body),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        resContent.result = omitDeep(resContent.result, '_id', '__v');
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expectStrictEqualWithTimestampOrdering(
            expectedResult,
            resContent.result,
        );

        // Check that DB is correct
        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: patientID });

        updatedData = omitDeep(updatedData, '_id', '__v');
        expectStrictEqualWithTimestampOrdering(expectedResult, updatedData);
    };
});
