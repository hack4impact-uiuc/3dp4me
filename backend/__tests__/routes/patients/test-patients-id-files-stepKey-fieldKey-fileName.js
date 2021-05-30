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
const omitDeep = require('omit-deep-lodash');
const {
    expectStrictEqualWithTimestampOrdering,
    areObjectsDisjoint,
} = require('../../utils/utils');
const {
    POST_FINISHED_STEP_DATA,
    DEFAULT_STEP_DATA,
    POST_IMMUTABLE_STEP_DATA,
} = require('../../mock-data/patients-mock-data');

describe('POST /patients/:id/files/:stepKey/:fieldKey/:fileName', () => {
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

    // TODO: Bad patientId
    // TODO: Bad stepKey
    // TODO: Bad fieldKey
    // TODO: Bad fileName
    // TODO: Patient with no data for this step
    // TODO: Patient with data for this step

    // TODO: Mock S3 putObject
    // TODO: Check DB
});
