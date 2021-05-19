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
    POST_PATIENT,
} = require('../../mock-data/patients-mock-data');
const { models } = require('../../../models');

describe('POST /patient', () => {
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

    it('returns 400 when missing required fields', (done) => {
        withAuthentication(request(server).post(`/api/patients/`, {})).expect(
            400,
            done,
        );
    });

    it('creates a patient when given a good request', async () => {
        const startTimestamp = Date.now();
        const body = POST_PATIENT;
        let expectedResult = {
            ...body,
            lastEdited: startTimestamp,
            lastEditedBy: getCurrentAuthenticatedUserAttribute('name'),
        };

        // Send the request
        const res = await withAuthentication(
            request(server).post(`/api/patients/`).send(body),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(201);
        expect(resContent.success).toBe(true);

        // Check that DB is correct
        const patientId = resContent.result._id;
        let patientData = await models.Patient.findById(patientId).lean();

        expect(patientId).not.toBeNull();
        expect(patientData.dateCreated.getTime()).toBeGreaterThanOrEqual(
            startTimestamp,
        );

        patientData = _.omit(patientData, ['_id', 'dateCreated', '__v']);
        expectedResult = _.omit(expectedResult, ['_id', 'dateCreated']);
        expectStrictEqualWithTimestampOrdering(expectedResult, patientData);
    });
});
