var server = require('../../app');
const db = require('../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    createUserDataWithRolesAndAccess,
} = require('../utils/auth');
const { ACCESS_LEVELS, ADMIN_ID } = require('../../middleware/authentication');

describe('mock auth', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.clearDatabase());
    beforeEach(() => (server = require('../../app')));
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(
            AWS,
            createUserDataWithRolesAndAccess(ACCESS_LEVELS.GRANTED, ADMIN_ID),
        );
    });

    it('returns OK with authentication', (done) => {
        withAuthentication(request(server).get('/api/patients')).expect(
            200,
            done,
        );
    });
});
