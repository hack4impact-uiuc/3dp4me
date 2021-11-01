const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('GET /roles', () => {
    const COLLECTION_NAME = 'Role';

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

    it('Gets all roles', async () => {
        const res = await withAuthentication(
            request(server).get(`/api/roles`),
        );

        expect(res.status).toBe(200);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);
        const actualResult = resContent.result;

        let expectedResult = await mongoose
            .model(COLLECTION_NAME)
            .find({});

        expect(actualResult.length).toBe(expectedResult.length);
    });
});
