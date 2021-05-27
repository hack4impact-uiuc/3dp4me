const db = require('../../utils/db');
const mongoose = require('mongoose');
const _ = require('lodash');
const omitDeep = require('omit-deep-lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
var server = require('../../../app');
const {
    POST_STEP_WITHOUT_OPTIONS,
    POST_STEP_WITH_EMPTY_OPTIONS,
    POST_STEP_WITH_BAD_FIELD,
    POST_STEP_WITH_DUPLICATE_KEY,
    POST_STEP_WITH_DUPLICATE_STEP_NUMBER,
    POST_STEP_WITH_OPTIONS,
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

    const postAndExpect = async (body, status) => {
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        expect(res.status).toBe(status);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);
    };

    // TODO: Check db??
    it('returns 400 if fieldType is readio and no options provided', async () => {
        await postAndExpect(POST_STEP_WITHOUT_OPTIONS, 400);
    });

    it('returns 400 if fieldType is readio and options empty', async () => {
        await postAndExpect(POST_STEP_WITH_EMPTY_OPTIONS, 400);
    });

    it('returns 500 if given bad fieldType', async () => {
        await postAndExpect(POST_STEP_WITH_BAD_FIELD, 500);
    });

    it('returns 500 if given duplicate stepKey', async () => {
        await postAndExpect(POST_STEP_WITH_DUPLICATE_KEY, 500);
    });

    it('returns 500 if given duplicate stepNumber', async () => {
        await postAndExpect(POST_STEP_WITH_DUPLICATE_STEP_NUMBER, 500);
    });

    it('successfully registers a new step when given good request', async () => {
        const body = POST_STEP_WITH_OPTIONS;
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        // Check response
        expect(res.status).toBe(200);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);

        // Check that DB is correct
        let step = await models.Step.findOne({ key: body.key }).lean();
        expect(step).not.toBeNull();
        step = omitDeep(step, '_id', '__v');
        expect(step).toStrictEqual(body);
        expect(mongoose.connection.models[body.key]).not.toBe(null);
    });
});
