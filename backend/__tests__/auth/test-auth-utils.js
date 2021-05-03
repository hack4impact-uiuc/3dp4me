const db = require('../utils/db');
const request = require('supertest');
const {
    mockAuthAsDefaultUser,
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../utils/auth');
const AWS = require('aws-sdk-mock');
var server = require('../../app');

describe('mock auth', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.clearDatabase());
    beforeEach(() => {
        server = require('../../app');
    });
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
