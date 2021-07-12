const db = require('../utils/db');
require('../../app.js');
const request = require('supertest');
const {
    withAuthentication,
    createUserDataWithRolesAndAccess,
    initAuthMocker,
    setCurrentUser,
} = require('../utils/auth');
const AWS = require('aws-sdk-mock');
const { MOCK_AUTH_TOKEN } = require('../mock-data/auth-mock-data');
const { ACCESS_LEVELS, ADMIN_ID } = require('../../middleware/authentication');
const {
    PUT_PATIENT_DATA,
    EXPECTED_PUT_DATA,
} = require('../mock-data/patients-mock-data');
const { expectStrictEqualWithTimestampOrdering } = require('../utils/utils');
const mongoose = require('mongoose');

describe('Test authentication ', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());

    beforeAll(async () => {
        await db.connect();
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
            const MOCK_ROLE_ID = '606e0a4602b23d02bc77673b';
            return Promise.resolve(
                createUserDataWithRolesAndAccess(
                    ACCESS_LEVELS.GRANTED,
                    MOCK_ROLE_ID,
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
            resContent.result,
        );

        let updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ _id: mongoose.Types.ObjectId(patientID) });
        expectStrictEqualWithTimestampOrdering(EXPECTED_PUT_DATA, updatedData);
    });

    it('does not return parts not readableBy user', async () => {
		const MOCK_USER_ID = '606e0a4602b23d02bc77673a'; 
		setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(ACCESS_LEVELS.GRANTED, MOCK_USER_ID),
        );

		const res = await withAuthentication(
			request(server)
				.get(`/api/metadata/steps`)
		);

		console.log(res.text);
		const resContent = JSON.parse(res.text);

		
	});

    it('does write to parts not writableBy user', async () => {});
});
