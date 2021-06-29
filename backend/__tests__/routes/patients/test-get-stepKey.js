const db = require('../../utils/db');
const _ = require('lodash');
const AWS = require('aws-sdk-mock');
var server = require('../../../app');
const { initAuthMocker, setCurrentUser, createUserDataWithRolesAndAccess } = require('../../utils/auth');
const { getStepKeys } = require('../../../utils/patient-utils');
const { ACCESS_LEVELS } = require('../../../middleware/authentication');

describe('getStepKey', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(
			AWS,
			createUserDataWithRolesAndAccess(
                ACCESS_LEVELS.GRANTED,
                '606e0a4602b23d02bc77673b',
            ),
		);
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
        await db.clearDatabase();
        const EXPECTED_RESULTS = [];
        const steps = await getStepKeys();
        expect(steps).toStrictEqual(EXPECTED_RESULTS);
    });
});
