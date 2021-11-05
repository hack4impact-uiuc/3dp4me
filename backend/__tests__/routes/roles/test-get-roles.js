const request = require('supertest');
const AWS = require('aws-sdk-mock');

let server = require('../../../app');
const { models } = require('../../../models');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('GET /roles', () => {
    afterAll(async () => db.closeDatabase());
    afterEach(async () => db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../../app');
    });

    it('Gets all roles', async () => {
        const res = await withAuthentication(
            request(server).get('/api/roles'),
        );

        expect(res.status).toBe(200);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);
        const actualResult = resContent.result;

        const expectedResult = await models
            .Role
            .find({});

        expect(actualResult.length).toBe(expectedResult.length);
    });
});
