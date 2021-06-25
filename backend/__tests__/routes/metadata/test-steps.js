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
    POST_STEP_WITH_FIELD_GROUP_WITHOUT_SUB_FIELDS,
    POST_STEP_WITH_FIELD_GROUP_WITH_EMPTY_SUB_FIELDS,
} = require('../../mock-data/steps-mock-data');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');
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

    it('returns 400 if missing required fields', (done) => {
        withAuthentication(request(server).post(`/api/metadata/steps`)).expect(
            400,
            done,
        );
    });

    const postAndExpect = async (body, status) => {
        const initDbStats = await mongoose.connection.db.stats();
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        expect(res.status).toBe(status);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);

        const finalDbStats = await mongoose.connection.db.stats();
        expect(finalDbStats.objects).toStrictEqual(initDbStats.objects);
    };

    it('returns 400 if fieldType is readio and no options provided', async () => {
        await postAndExpect(POST_STEP_WITHOUT_OPTIONS, 400);
    });

    it('returns 400 if fieldType is radio and options empty', async () => {
        await postAndExpect(POST_STEP_WITH_EMPTY_OPTIONS, 400);
    });

    it('returns 400 if given bad fieldType', async () => {
        await postAndExpect(POST_STEP_WITH_BAD_FIELD, 400);
    });

    it('returns 400 if given duplicate stepKey', async () => {
        await postAndExpect(POST_STEP_WITH_DUPLICATE_KEY, 400);
    });

    it('returns 400 if given duplicate stepNumber', async () => {
        await postAndExpect(POST_STEP_WITH_DUPLICATE_STEP_NUMBER, 400);
    });

    it('returns 400 if given stepGroup without subFields', async () => {
        await postAndExpect(POST_STEP_WITH_FIELD_GROUP_WITHOUT_SUB_FIELDS, 400);
    });

    it('returns 400 if given stepGroup with empty subFields', async () => {
        await postAndExpect(
            POST_STEP_WITH_FIELD_GROUP_WITH_EMPTY_SUB_FIELDS,
            400,
        );
    });

    it('successfully registers a new step when given good request', async () => {
        const body = POST_STEP_WITH_OPTIONS;
        const res = await withAuthentication(
            request(server).post(`/api/metadata/steps`).send(body),
        );

        // Check response
        console.log(res.text);
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
