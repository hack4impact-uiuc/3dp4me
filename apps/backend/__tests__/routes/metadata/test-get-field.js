const _ = require('lodash');
const AWS = require('aws-sdk-mock');
const omitDeep = require('omit-deep-lodash');

let server = require('../../../app');
const db = require('../../utils/db');
const { initAuthMocker, setCurrentUser } = require('../../utils/auth');
const { models } = require('../../../models');
const {
    GET_FIELD_BY_KEY_EXPECTED,
} = require('../../mock-data/steps-mock-data');
const { getFieldByKey } = require('../../../utils/fieldUtils');

describe('Test getFieldByKey', () => {
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

    it('test getting fields by key from survey', async () => {
        const survey = await models.Step.findOne({ key: 'survey' }).lean();

        // Extract field by key
        const field = getFieldByKey(survey.fields, 'numWorkingPeople');
        expect(omitDeep(field, '_id')).toStrictEqual(GET_FIELD_BY_KEY_EXPECTED);
    });

    it('returns null if key is not found', async () => {
        const survey = await models.Step.findOne({ key: 'survey' });

        // Extract field by key
        const field = getFieldByKey(survey.fields, 'doesNotExist');
        expect(field).toBeNull();
    });

    it('returns null when null is placed into fields', async () => {
        const field = getFieldByKey(null, 'doesNotExist');
        expect(field).toBeNull();
    });
});
