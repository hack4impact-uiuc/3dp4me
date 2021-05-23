const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
var server = require('../../../app');
const {
    POST_STEP_WITHOUT_OPTIONS,
} = require('../../mock-data/steps-mock-data');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUserAttribute,
} = require('../../utils/auth');
const {
    expectStrictEqualWithTimestampOrdering,
    areObjectsDisjoint,
} = require('../../utils/utils');
const { models } = require('../../../models');

describe('POST /steps', () => {
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

    it('returns 500 if missing required fields', (done) => {
        withAuthentication(request(server).post(`/api/metadata/steps`)).expect(
            500,
            done,
        );
    });

    it('returns 400 if fieldType is readio and no options provided', async () => {
        const body = POST_STEP_WITHOUT_OPTIONS;
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        expect(res.status).toBe(400);

        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);
    });

    // TODO: Return 400 if fieldType radio and options are empty (DB shouldn't be modified)
    // TODO: Return 400 if given bad fieldType
    // TODO: Return 200 and add step/collection if everything good
    // TODO: Return 500 if we give a duplicate stepKey
    // TODO: Return 500 if we give a duplicate stepNumber
});
