const db = require('../utils/db');
require('../../app.js');
const request = require('supertest');
const { createUserDataWithRolesAndAccess } = require('../utils/auth');
const AWS = require('aws-sdk-mock');
const { MOCK_AUTH_TOKEN } = require('../mock-data/auth-mock-data');
const { ACCESS_LEVELS } = require('../../middleware/authentication');

describe('Test authentication ', () => {
    beforeAll(async () => {
        await db.connect();
        AWS.mock('CognitoIdentityServiceProvider', 'getUser', () => {
            return Promise.reject();
        });
    });

    afterAll(async () => await db.closeDatabase());
    beforeEach(() => (server = require('../../app')));
    afterEach(async () => await db.clearDatabase());

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
});
