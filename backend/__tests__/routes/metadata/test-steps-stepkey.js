const db = require('../../utils/db');
const _ = require('lodash');
const omitDeep = require('omit-deep-lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
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
const {
    PUT_STEP_REORDERED_FIELDS,
    PUT_STEP_REORDERED_FIELDS_EXPECTED,
    PUT_STEP_ADDED_FIELD,
    PUT_STEP_ADDED_FIELD_EXPECTED,
    PUT_STEP_DUPLICATE_FIELD,
    PUT_STEP_DELETED_FIELD,
} = require('../../mock-data/steps-mock-data');
const { models } = require('../../../models');

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
        // console.log(invalidStep);

        const res = await withAuthentication(
            request(server).put(`/api/metadata/steps/`).send(invalidStep),
        );

        expect(res.status).toBe(404);
    });

    it('reorder fields in step', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps`)
                .send(PUT_STEP_REORDERED_FIELDS),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        // console.log(resContent);
        // console.log(resContent);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(resContent.data).toStrictEqual(
            PUT_STEP_REORDERED_FIELDS_EXPECTED,
        );

        // Check database
        let step = await models.Step.findOne({ key: STEP_KEY }).lean();
        step = [omitDeep(step, '_id', '__v')];

        expect(step).toStrictEqual(
            omitDeep(PUT_STEP_REORDERED_FIELDS_EXPECTED, '_id', '__v'),
        );
    });

    it('add a field correctly', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_ADDED_FIELD),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        expect(resContent.data).toEqual(PUT_STEP_ADDED_FIELD_EXPECTED);

        // Check database
        let step = await models.Step.findOne({ key: STEP_KEY }).lean();

        step = [omitDeep(step, '_id', '__v')];

        expect(step).toStrictEqual(
            omitDeep(PUT_STEP_ADDED_FIELD_EXPECTED, '_id', '__v'),
        ); // _id and __v have different formats
    });

    it('correctly rejects duplicate field number and key', async () => {
        const stepBefore = await models.Step.find({}).lean();

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_DUPLICATE_FIELD),
        );

        // console.log(res.text);
        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);

        const stepAfter = await models.Step.find({}).lean();

        // Checks that database is rolled back after failing validation
        expect(stepBefore).toStrictEqual(stepAfter);
    });

    //TODO: test multiple step changes

    it('returns 400 if deleting fields', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/`)
                .send(PUT_STEP_DELETED_FIELD),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false);

        // Check database
        let unchangedData = await mongoose.connection
            .collection('steps')
            .findOne({ key: STEP_KEY });
        // console.log(unchangedData);
    });
});
