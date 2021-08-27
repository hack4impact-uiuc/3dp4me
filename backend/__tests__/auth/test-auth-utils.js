const request = require('supertest');
const AWS = require('aws-sdk-mock');

let server = require('../../app');
const db = require('../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../utils/auth');

describe('mock auth', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.clearDatabase());
    beforeEach(() => (server = require('../../app')));
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    it('returns OK with authentication', (done) => {
        withAuthentication(request(server).get('/api/patients')).expect(
            200,
            done,
        );
    });
});
