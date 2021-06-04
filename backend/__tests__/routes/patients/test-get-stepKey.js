const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');

const { initAuthMocker, setCurrentUser } = require('../../utils/auth');
const { models } = require('../../../models');
const { getStepKeys } = require('../../../utils/patient-utils');

describe('getStepKey', () => {
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

    it('getStepKey with steps.json', async () => {
        const EXPECTED_RESULTS = ['medicalInfo', 'survey', 'example'];
        const steps = await getStepKeys();
        expect(steps).toStrictEqual(EXPECTED_RESULTS);
    });

    it('getStepKey with no steps', async () => {
        await models.Step.deleteMany();
        const EXPECTED_RESULTS = [];
        const steps = await getStepKeys();
        expect(steps).toStrictEqual(EXPECTED_RESULTS);
    });
});
