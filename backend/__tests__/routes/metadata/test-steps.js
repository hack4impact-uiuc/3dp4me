const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
var server = require('../../../app');
const {
    POST_STEP_WITHOUT_OPTIONS,
    POST_STEP_WITH_EMPTY_OPTIONS,
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

    const postAndExpect400 = async (body) => {
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        expect(res.status).toBe(400);

        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);
    };

    it('returns 400 if fieldType is readio and no options provided', async () => {
        await postAndExpect400(POST_STEP_WITHOUT_OPTIONS);
    });

    it('returns 400 if fieldType is readio and no options provided', async () => {
        await postAndExpect400(POST_STEP_WITH_EMPTY_OPTIONS);
    });

    // TODO: Check db??
    // TODO: Return 400 if given bad fieldType
    // TODO: Return 200 and add step/collection if everything good
    // TODO: Return 500 if we give a duplicate stepKey
    // TODO: Return 500 if we give a duplicate stepNumber
});
