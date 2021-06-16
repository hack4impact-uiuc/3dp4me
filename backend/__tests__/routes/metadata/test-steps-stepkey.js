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
} = require('../../utils/auth');

const {
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
        expect(omitDeep(resContent.result, '_id', '__v')).toStrictEqual(PUT_STEPS_SWAPPED_STEPNUMBER);

        // Check database
        let steps = await models.Step.find({}).lean();

        // Sort incoming data by stepNumber
        steps.sort((a, b) =>  a.stepNumber - b.stepNumber);
        steps = omitDeep(steps, '_id', '__v')
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
        console.log(resContent);
        expect(res.status).toBe(400);
        expect(resContent.success).toBe(false)
        
        // TODO minor bug where the error says that you can

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
