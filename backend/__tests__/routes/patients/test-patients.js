const db = require('../../utils/db');
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
const { stepStatusEnum, models } = require('../../../models');
const { expectStrictEqualWithTimestampOrdering } = require('../../utils/utils');
const {
    POST_FINISHED_STEP_DATA,
} = require('../../mock-data/patients-mock-data');

describe('POST /patient', () => {
    const STEP_KEY = 'example';
    const PATIENT_ID_MISSING_DATA = '60944e084f4c0d4330cc258d';
    const PATIENT_ID_WITH_DATA = '60944e084f4c0d4330cc258d';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    // Do various levels of upload (complete, incomplete, etc)
    // Change fields that should never be changed (like _id, lastEdited, lastEditedBy) should return a bad response

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 404 when given bad ID format', (done) => {
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

    // it('sets defaults on missing fields', async () => {
    //     const patientID = PATIENT_ID_MISSING_DATA;
    //     const startTimestamp = Date.now();
    //     const body = {};
    //     const expectedResult = {
    //         lastEdited: startTimestamp,
    //         patientId: patientID,
    //         lastEditedBy: getCurrentAuthenticatedUserAttribute('name'),
    //     };

    //     // Send the request
    //     const res = await withAuthentication(
    //         request(server)
    //             .post(`/api/patients/${patientID}/${STEP_KEY}`)
    //             .send(body),
    //     );

    //     // Check response
    //     const resContent = JSON.parse(res.text);
    //     expect(res.status).toBe(200);
    //     expect(resContent.success).toBe(true);

    //     // Check that DB is correct
    //     const updatedData = await mongoose.connection
    //         .collection(STEP_KEY)
    //         .findOne({ patientId: patientID }, { projection: { _id: 0 } });

    //     // TODO: This should be setting defaults....
    //     console.log(updatedData);
    //     expectStrictEqualWithTimestampOrdering(expectedResult, updatedData);
    // });

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
        delete resContent.result._id;
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expectStrictEqualWithTimestampOrdering(
            expectedResult,
            resContent.result,
        );

        // Check that DB is correct
        const updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: patientID }, { projection: { _id: 0 } });

        expectStrictEqualWithTimestampOrdering(expectedResult, updatedData);
    };
});
