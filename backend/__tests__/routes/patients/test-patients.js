const db = require('../../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUser,
    getCurrentAuthenticatedUserAttribute,
} = require('../../utils/auth');
const { stepStatusEnum, models } = require('../../../models');
const { isSubObject } = require('../../utils/utils');
const { POST_FULL_STEP_DATA } = require('../../mock-data/patients-mock-data');

describe('POST /patient', () => {
    const STEP_KEY = 'example';
    const PATIENT_ID_MISSING_DATA = '60944e084f4c0d4330cc258d';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    // Patient with existing data for this step
    // Check lastEdited and lastEditecBy
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
        const startTimestamp = Date.now();
        const body = POST_FULL_STEP_DATA;

        // Send the request
        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${PATIENT_ID_MISSING_DATA}/${STEP_KEY}`)
                .send(body),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        // expect(isSubObject(resContent.result, body)).toBe(true);

        const updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_MISSING_DATA });

        // Check that DB is correct
        expect(isSubObject(updatedData, body)).toBe(true);
        expect(updatedData.lastEdited >= startTimestamp).toBe(true);
        expect(updatedData.patientId).toBe(PATIENT_ID_MISSING_DATA);
        expect(updatedData.lastEditedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
    });
});
