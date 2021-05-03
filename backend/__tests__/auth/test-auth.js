const db = require('../utils/db');
const request = require('supertest');
const { createUserDataWithRoles } = require('../utils/auth');
const AWS = require('aws-sdk-mock');

describe('Test authentication ', () => {
    beforeAll(async () => {
        await db.connect();
        AWS.mock(
            'CognitoIdentityServiceProvider',
            'getUser',
            (params, callback) => {
                return Promise.reject();
            },
        );
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
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            })
            .expect(401, done);
    });

    it('fails when given valid user token but improper roles', (done) => {
        AWS.remock('CognitoIdentityServiceProvider', 'getUser', () => {
            return Promise.resolve(createUserDataWithRoles());
        });

        request(server)
            .get('/api/patients')
            .set({
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            })
            .expect(403, done);
    });

    it('succeeds when given valid user token with proper roles', (done) => {
        AWS.remock('CognitoIdentityServiceProvider', 'getUser', () => {
            const MOCK_ROLE_ID = '606e0a4602b23d02bc77673b';
            return Promise.resolve(createUserDataWithRoles(MOCK_ROLE_ID));
        });

        request(server)
            .get('/api/patients')
            .set({
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            })
            .expect(200, done);
    });
});
