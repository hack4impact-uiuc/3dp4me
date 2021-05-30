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
    GET_PATIENT_WITH_ALL_STEP_DATA,
    GET_PATIENT_WITH_SOME_STEP_DATA,
    GET_PATIENT_WITHOUT_STEP_DATA,
} = require('../../mock-data/patients-mock-data');

describe('GET /patient/:id', () => {
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

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).get(`/api/patients/${randID}`),
        ).expect(404, done);
    });

    it('get patient with no step data', async () => {
        const patientID = '60944e084f4c0d4330cc25ec';
        const res = await withAuthentication(
            request(server).get(`/api/patients/${patientID}`),
        );

        // Check statuses are correct
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check responses
        expectStrictEqualWithTimestampOrdering(
            GET_PATIENT_WITHOUT_STEP_DATA,
            resContent.result,
        );
    });

    it('get patient with some step data', async () => {
        const patientID = '60944e084f4c0d4330cc25ee';
        const res = await withAuthentication(
            request(server).get(`/api/patients/${patientID}`),
        );

        // Check statuses are correct
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check responses
        expectStrictEqualWithTimestampOrdering(
            GET_PATIENT_WITH_SOME_STEP_DATA,
            resContent.result,
        );
    });

    it('get patient with all step data', async () => {
        const patientID = '60944e084f4c0d4330cc258b';
        const res = await withAuthentication(
            request(server).get(`/api/patients/${patientID}`),
        );

        // Check statuses are correct
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        //Check responses
        expectStrictEqualWithTimestampOrdering(
            GET_PATIENT_WITH_ALL_STEP_DATA,
            resContent.result,
        );
    });

    it('get patient with no step data and no steps in collection', async () => {
        // Delete all steps
        let updatedData = await mongoose.connection
            .collection('steps')
            .deleteMany({});
        expect(updatedData.deletedCount).toBe(3);

        // Delete model
        delete mongoose.connection.models['survey'];
        delete mongoose.connection.models['example'];
        delete mongoose.connection.models['medicalInfo'];

        const patientID = '60944e084f4c0d4330cc25ec';
        const res = await withAuthentication(
            request(server).get(`/api/patients/${patientID}`),
        );

        // Check statuses are correct
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Delete removed steps from expected
        delete GET_PATIENT_WITHOUT_STEP_DATA.survey;
        delete GET_PATIENT_WITHOUT_STEP_DATA.example;
        delete GET_PATIENT_WITHOUT_STEP_DATA.medicalInfo;

        // Check responses
        expectStrictEqualWithTimestampOrdering(
            GET_PATIENT_WITHOUT_STEP_DATA,
            resContent.result,
        );
    });

    it('get patient with some step data and some steps in collection', async () => {
        // Delete one step
        let updatedData = await mongoose.connection
            .collection('steps')
            .deleteOne({ key: 'example' });
        expect(updatedData.deletedCount).toBe(1);

        // Delete model
        delete mongoose.connection.models['example'];

        const patientID = '60944e084f4c0d4330cc25ee';
        const res = await withAuthentication(
            request(server).get(`/api/patients/${patientID}`),
        );

        // Check statuses are correct
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Delete removed steps from expected
        delete GET_PATIENT_WITH_SOME_STEP_DATA.example;

        // Check responses
        expectStrictEqualWithTimestampOrdering(
            GET_PATIENT_WITH_SOME_STEP_DATA,
            resContent.result,
        );
    });
});
