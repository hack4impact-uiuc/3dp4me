const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const mongoose = require('mongoose');
var server = require('../../../app');
const AWS = require('aws-sdk-mock');
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
    PUT_PATIENT_DATA,
    PUT_BAD_PATIENT_DATA,
    EXPECTED_PUT_DATA,
} = require('../../mock-data/patients-mock-data');

describe('PUT /patients/:id', () => {
    const STEP_KEY = 'Patient';
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

    it('returns 404 when editing patient that does not exist', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).put(`/api/patients/${randID}`, PUT_PATIENT_DATA),
        ).expect(404, done);
    });

    it('does not edit non-editable fields when editing non-editable fields', async () => {
        const patientID = '60944e084f4c0d4330cc258b';
        const res = await withAuthentication(
            request(server)
                .put(`/api/patients/${patientID}`)
                .send(PUT_BAD_PATIENT_DATA),
        );
        const resContent = JSON.parse(res.text);
        // Check statuses are correct
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Query for ids must be done as an ObjectId
        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ _id: mongoose.Types.ObjectId(patientID) });

        expectStrictEqualWithTimestampOrdering(EXPECTED_PUT_DATA, updatedData);
    });

    it('properly changes valid patient fields', async () => {
        const patientID = '60944e084f4c0d4330cc258b';
        const res = await withAuthentication(
            request(server)
                .put(`/api/patients/${patientID}`)
                .send(PUT_PATIENT_DATA),
        );
        const resContent = JSON.parse(res.text);

        // Check statuses are correct
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expectStrictEqualWithTimestampOrdering(
            EXPECTED_PUT_DATA,
            resContent.result,
        );

        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ _id: mongoose.Types.ObjectId(patientID) });
        expectStrictEqualWithTimestampOrdering(EXPECTED_PUT_DATA, updatedData);
    });
});

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
