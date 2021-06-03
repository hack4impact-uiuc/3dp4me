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
    PUT_STEP_REORDERED_FIELDS_EXPECTED
} = require('../../mock-data/steps-mock-data');
const { models } = require('../../../models');
const { Mongoose } = require('mongoose');

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
        const stepID = '6092c26fe0912601bbc5d85d';

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
            .findOne({_id: mongoose.Types.ObjectId(stepID)});
        
        expectStrictEqualWithTimestampOrdering(PUT_STEP_REORDERED_FIELDS_EXPECTED, updatedData);

    });
});