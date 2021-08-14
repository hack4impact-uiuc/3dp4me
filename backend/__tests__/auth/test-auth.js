var server = require('../../app');
const db = require('../utils/db');
const request = require('supertest');
const omitDeep = require('omit-deep-lodash');
const {
    withAuthentication,
    createUserDataWithRolesAndAccess,
    initAuthMocker,
    setCurrentUser,
    initS3Mocker,
    initS3GetMocker,
} = require('../utils/auth');
const AWS = require('aws-sdk-mock');
const { MOCK_AUTH_TOKEN } = require('../mock-data/auth-mock-data');
const {
    PUT_PATIENT_DATA,
    EXPECTED_PUT_DATA,
    EXPECTED_GET_RESTRICTED_DATA,
    POST_FINISHED_STEP_DATA,
    EXPECTED_FILE_DATA,
} = require('../mock-data/patients-mock-data');
const { expectStrictEqualWithTimestampOrdering } = require('../utils/utils');
const mongoose = require('mongoose');
const { ADMIN_ID, ACCESS_LEVELS } = require('../../utils/constants');

describe('Test authentication ', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());

    beforeAll(async () => {
        await db.connect();
        initS3Mocker(AWS);
        initAuthMocker(AWS);
    });

    beforeEach(() => (server = require('../../app')));

    it('fails when given no auth header', (done) => {
        request(server).get('/api/patients').expect(401, done);
    });

    it('fails when given empty auth header', (done) => {
        request(server)
            .get('/api/patients')
            .set({ authorization: '' })
            .expect(401, done);
    });

    it('fails when given no token', (done) => {
        request(server)
            .get('/api/patients')
            .set({ authorization: 'Bearer ' })
            .expect(401, done);
    });

    it('fails when given bad token', (done) => {
        request(server)
            .get('/api/patients')
            .set({
                authorization: MOCK_AUTH_TOKEN,
            })
            .expect(401, done);
    });

    it('fails when given valid user token but improper roles', (done) => {
        AWS.remock('CognitoIdentityServiceProvider', 'getUser', () => {
            return Promise.resolve(createUserDataWithRolesAndAccess());
        });

        request(server)
            .get('/api/patients')
            .set({
                authorization: MOCK_AUTH_TOKEN,
            })
            .expect(403, done);
    });

    it('succeeds when given valid user token with proper roles', (done) => {
        AWS.remock('CognitoIdentityServiceProvider', 'getUser', () => {
            return Promise.resolve(
                createUserDataWithRolesAndAccess(
                    ACCESS_LEVELS.GRANTED,
                    ADMIN_ID,
                ),
            );
        });

        request(server)
            .get('/api/patients')
            .set({
                authorization: MOCK_AUTH_TOKEN,
            })
            .expect(200, done);
    });

    it('succeeds when hitting requireAdmin endpoint', async () => {
        const STEP_KEY = 'Patient';
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(ACCESS_LEVELS.GRANTED, ADMIN_ID),
        );

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
            omitDeep(resContent.result, '__v'),
        );

        let updatedData = await mongoose
            .model(STEP_KEY)
            .findOne({ _id: mongoose.Types.ObjectId(patientID) });
        updatedData = updatedData.toObject();
        updatedData._id = updatedData._id.toString();

        expectStrictEqualWithTimestampOrdering(
            EXPECTED_PUT_DATA,
            omitDeep(updatedData, '__v'),
        );
    });

    it('does not return parts not readableBy user', async () => {
        const MOCK_ROLE_ID = '606e0a4602b23d02bc77673d';
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(
                ACCESS_LEVELS.GRANTED,
                MOCK_ROLE_ID,
            ),
        );

        const res = await withAuthentication(
            request(server).get(`/api/metadata/steps`),
        );

        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(omitDeep(resContent.result, '__v')).toStrictEqual([
            EXPECTED_GET_RESTRICTED_DATA,
        ]);
    });

    it('does write to parts not writableBy user', async () => {
        const MOCK_ROLE_ID = '606e0a4602b23d02bc77673c';
        const PATIENT_ID = '60944e084f4c0d4330cc2594';
        const STEP_KEY = 'example';
        const model = mongoose.model(STEP_KEY);
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(
                ACCESS_LEVELS.GRANTED,
                MOCK_ROLE_ID,
            ),
        );

        const dataBefore = await model
            .findOne({ patientId: PATIENT_ID })
            .lean();

        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${PATIENT_ID}/${STEP_KEY}`)
                .send(POST_FINISHED_STEP_DATA),
        );

        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        const dataAfter = await model.findOne({ patientId: PATIENT_ID }).lean();
        expect(omitDeep(dataBefore, '_ac', '_ct')).toStrictEqual(
            omitDeep(dataAfter, '_ac', '_ct'),
        );
    });

    it('accept auth for correct user auth for patient files', async () => {
        initS3GetMocker(AWS);
        const MOCK_ROLE_ID = '606e0a4602b23d02bc77673a';
        const PATIENT_ID = '60944e084f4c0d4330cc2594';
        const STEP_KEY = 'example';
        const model = mongoose.model(STEP_KEY);
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(
                ACCESS_LEVELS.GRANTED,
                MOCK_ROLE_ID,
            ),
        );

        const res = await withAuthentication(
            request(server).get(
                `/api/patients/${PATIENT_ID}/files/${STEP_KEY}/file/intelligent_encompassing.cpio`,
            ),
        );

        const path = require('path');
        expect(res.text).toBe(EXPECTED_FILE_DATA);
    });

    it('reject auth for incorrect user for patient files', async () => {
        initS3GetMocker(AWS);
        const MOCK_ROLE_ID = '606e0a4602b23d02bc77673b';
        const PATIENT_ID = '60944e084f4c0d4330cc2594';
        const STEP_KEY = 'example';
        const model = mongoose.model(STEP_KEY);
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(
                ACCESS_LEVELS.GRANTED,
                MOCK_ROLE_ID,
            ),
        );

        const res = await withAuthentication(
            request(server).get(
                `/api/patients/${PATIENT_ID}/files/${STEP_KEY}/file/intelligent_encompassing.cpio`,
            ),
        );

        const resContent = JSON.parse(res.text);
        const path = require('path');

        expect(res.status).toBe(403);
        expect(resContent.success).toBe(false);
        expect(resContent.message).toBe(
            'User does not have permissions to execute operation.',
        );
    });
});
