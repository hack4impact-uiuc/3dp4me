const db = require('../../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('POST /patient', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.clearDatabase());
    beforeEach(() => (server = require('../../app')));
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    it('returns OK with authentication', (done) => {
        const names = mongoose.modelNames();
        console.log(names);
        withAuthentication(
            request(server).get('/api/patients/badid/badstage'),
        ).expect(200, done);
    });
});
