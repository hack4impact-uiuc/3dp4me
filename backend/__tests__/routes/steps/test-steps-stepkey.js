const db = require('../../utils/db');
const _ = require('lodash');
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
    PUT_STEP_DELETED_FIELD,
} = require('../../mock-data/steps-mock-data');

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

    it('given bad stepkey, return 404', (done) => {
        const invalidStepKey = "DoesNotExist";
        withAuthentication(
            request(server)
            .put(`/api/metadata/steps/${invalidStepKey}`)
        ).expect(404, done);
    });


    it ('reorder fields in step', async () => {
        

        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/${STEP_KEY}`)
                .send(PUT_STEP_REORDERED_FIELDS)
        );

        console.log(res.text);


        // Check response
        const resContent = JSON.parse(res.text);
        expect(resContent.status).toBe(200);
        expect(resContent.success).toBe(true);
        expectStrictEqualWithTimestampOrdering(
            PUT_STEP_REORDERED_FIELDS_EXPECTED, 
            resContent.result,
        );

        // Check database
        let updatedData = await mongoose.connection
            .collection('steps')
            .findOne({ key : STEP_KEY });
        
        expectStrictEqualWithTimestampOrdering(PUT_STEP_REORDERED_FIELDS_EXPECTED, updatedData);

    });

    it ('add a field correctly', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/${STEP_KEY}`)
                .send(PUT_STEP_ADDED_FIELD)
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(resContent.status).toBe(200);
        expect(resContent.success).toBe(true);
        expectStrictEqualWithTimestampOrdering(
            PUT_STEP_ADDED_FIELD_EXPECTED,
            resContent.result,
        );

        // Check database
        let updatedData = await mongoose.connection
            .collection('steps')
            .findOne({ key: STEP_KEY });
        
        expectStrictEqualWithTimestampOrdering(
            PUT_STEP_ADDED_FIELD_EXPECTED,
            updatedData,
        );

    });


    it('returns 400 if deleting fields', async () => {
        const res = await withAuthentication(
            request(server)
                .put(`/api/metadata/steps/${STEP_KEY}`)
                .send(PUT_STEP_DELETED_FIELD)
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(resContent.status).toBe(400);
        expect(resContent.success).toBe(false);


        // Check database
        let unchangedData = await mongoose.connection
            .collection('steps')
            .findOne({ key: STEP_KEY });
        console.log(unchangedData);
    });


});