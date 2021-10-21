const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('GET /patients/count', () => {
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

    it('checks count of patients in the database', async () => {
        // Send the request
        const res = await withAuthentication(
            request(server).get('/api/patients/count'),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that count is correct
        const patientCount = resContent.result;

        expect(patientCount).toBe(100);
    });
});
