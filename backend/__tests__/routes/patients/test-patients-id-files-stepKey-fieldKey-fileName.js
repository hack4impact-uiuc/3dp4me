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

    const PATIENT_ID_WITH_DATA = '60944e084f4c0d4330cc25ff';
    const STEP_KEY = 'example';
    const FIELD_KEY = 'file';
    const FILE_NAME = 'newfile.txt';

    const expectStatusWithDBUnchanged = async (requestURL, status) => {
        const initDbStats = await mongoose.connection.db.stats();
        const res = await withAuthentication(request(server).post(requestURL));

        expect(res.status).toBe(status);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);

        const finalDbStats = await mongoose.connection.db.stats();
        expect(finalDbStats.dataSize).toBe(initDbStats.dataSize);
    };

    it('returns 404 when given bad patientId', async () => {
        const BAD_ID = '60944e084f4c0d4300cc25f1';
        await expectStatusWithDBUnchanged(
            `/api/patients/${BAD_ID}/files/${STEP_KEY}/${FIELD_KEY}/${FILE_NAME}`,
            404,
        );
    });

    it('returns 404 when given bad stepKey', async () => {
        const BAD_STEP = 'nonExistent';
        await expectStatusWithDBUnchanged(
            `/api/patients/${PATIENT_ID_WITH_DATA}/files/${BAD_STEP}/${FIELD_KEY}/${FILE_NAME}`,
            404,
        );
    });
    // TODO: Upload for non-file field??
    // TODO: Bad stepKey
    // TODO: Bad fieldKey
    // TODO: Bad fileName
    // TODO: Patient with no data for this step
    // TODO: Patient with data for this step

    // TODO: Mock S3 putObject
    // TODO: Check DB
});
