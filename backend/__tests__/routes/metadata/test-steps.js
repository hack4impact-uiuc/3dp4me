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
    POST_SUB_FIELD_WITHOUT_OPTIONS,
    POST_SUB_FIELD_WITH_EMPTY_OPTIONS,
    POST_STEP_WITH_BAD_SUB_FIELD,
    POST_STEP_WITH_DUPLICATE_SUB_FIELDKEY,
    PUT_STEP_REORDERED_FIELDS,
    PUT_STEP_REORDERED_FIELDS_EXPECTED,
    PUT_STEP_ADDED_FIELD,
    PUT_STEP_ADDED_FIELD_EXPECTED,
    PUT_STEP_DUPLICATE_FIELD,
    PUT_STEP_DELETED_FIELD,
    PUT_STEP_EDITED_FIELDS,
    PUT_STEP_EDIT_FIELDTYPE,
    PUT_STEPS_SWAPPED_STEPNUMBER,
    PUT_DUPLICATE_STEPS,
    PUT_STEP_SUBFIELD_MISSING_FIELDS,
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

    it('returns 400 if subFieldType is radio and no options provided', async () => {
        await postAndExpect(POST_SUB_FIELD_WITHOUT_OPTIONS, 400);
    });

    it('returns 400 if subFieldType is radio and options empty', async () => {
        await postAndExpect(POST_SUB_FIELD_WITH_EMPTY_OPTIONS, 400);
    });

    it('returns 400 if given bad subFieldType', async () => {
        await postAndExpect(POST_STEP_WITH_BAD_SUB_FIELD, 400);
    });

    it('returns 400 if given duplicate subFieldKey', async () => {
        await postAndExpect(POST_STEP_WITH_DUPLICATE_SUB_FIELDKEY, 400);
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

describe('PUT /steps/stepkey', () => {
    const STEP_KEY = 'survey';
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

    it('given bad stepkey, return 404', async () => {
        const invalidStep = [{ key: 'DoesNotExist' }];

        const res = await withAuthentication(
            request(server).put(`/api/metadata/steps/`).send(invalidStep),
        );

        expect(res.status).toBe(404);
    });

    it('can reorder fields in step', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps`)
                .send(PUT_STEP_REORDERED_FIELDS),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(resContent.result).toStrictEqual(
            PUT_STEP_REORDERED_FIELDS_EXPECTED,
        );

        // Check database
        let step = await models.Step.findOne({ key: STEP_KEY }).lean();
        step = [omitDeep(step, '_id', '__v')];

        expect(step).toStrictEqual(
            omitDeep(PUT_STEP_REORDERED_FIELDS_EXPECTED, '_id', '__v'),
        );
    });

    it('can add a field correctly', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_ADDED_FIELD),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(resContent.result).toStrictEqual(PUT_STEP_ADDED_FIELD_EXPECTED);

        // Check database
        let step = await models.Step.findOne({ key: STEP_KEY }).lean();

        step = [omitDeep(step, '_id', '__v')];

        expect(step).toStrictEqual(
            omitDeep(PUT_STEP_ADDED_FIELD_EXPECTED, '_id', '__v'),
        ); // _id and __v have different formats
    });

    it('can edit current fields', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps`)
                .send(PUT_STEP_EDITED_FIELDS),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(resContent.result).toStrictEqual(PUT_STEP_EDITED_FIELDS);

        // Check database
        let step = await models.Step.findOne({ key: STEP_KEY }).lean();

        step = [omitDeep(step, '_id', '__v')];

        expect(step).toStrictEqual(
            omitDeep(PUT_STEP_EDITED_FIELDS, '_id', '__v'),
        );
    });

    it('correctly rejects duplicate field number and key', async () => {
        const stepBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_DUPLICATE_FIELD),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);

        const stepAfter = await models.Step.find({}).lean();

        // Checks that database is rolled back after failing validation
        expect(stepBefore).toStrictEqual(stepAfter);
    });

    it('correctly rejects subfields that are missing fields', async () => {
        const stepBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_SUBFIELD_MISSING_FIELDS),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);

        const stepAfter = await models.Step.find({}).lean();

        // Checks that database is rolled back after failing validation
        expect(stepBefore).toStrictEqual(stepAfter);
    });

    it('correctly returns 200 when reordering steps', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps`)
                .send(PUT_STEPS_SWAPPED_STEPNUMBER),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(omitDeep(resContent.result, '_id', '__v')).toStrictEqual(
            PUT_STEPS_SWAPPED_STEPNUMBER,
        );

        // Check database
        let steps = await models.Step.find({}).lean();

        // Sort incoming data by stepNumber
        steps.sort((a, b) => a.stepNumber - b.stepNumber);
        steps = omitDeep(steps, '_id', '__v');
        expect(steps).toStrictEqual(PUT_STEPS_SWAPPED_STEPNUMBER);
    });

    it('returns 400 for request with duplicate stepKey or stepNumber', async () => {
        const stepsBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps`)
                .send(PUT_DUPLICATE_STEPS),
        );

        const stepsAfter = await models.Step.find({}).lean();

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);

        expect(stepsBefore).toStrictEqual(stepsAfter);
    });

    it('returns 400 for fieldType edits', async () => {
        const stepBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_EDIT_FIELDTYPE),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);
        expect(resContent.message).toBe('Cannot change fieldType');

        const stepAfter = await models.Step.find({}).lean();

        // Check that database is rolled back after aborting transaction
        expect(stepBefore).toStrictEqual(stepAfter);
    });

    it('returns 400 if deleting fields', async () => {
        const stepBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_DELETED_FIELD),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);
        expect(resContent.message).toBe('Cannot delete fields');

        // Check database
        const stepAfter = await models.Step.find({}).lean();

        // Check that database reverts properly
        expect(stepBefore).toStrictEqual(stepAfter);
    });
});
