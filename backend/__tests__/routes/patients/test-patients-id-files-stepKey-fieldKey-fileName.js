const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
const fs = require('fs');
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

    const PATIENT_ID_WITHOUT_DATA = '60944e084f4c0d4330cc258d';
    const PATIENT_ID_WITH_DATA = '60944e084f4c0d4330cc258c';
    const STEP_KEY = 'example';
    const FIELD_KEY = 'file';
    const FILE_NAME = 'newfile.txt';
    const TEST_FILE = `${__dirname}../../../mock-data/test-file.jpg`;

    const expectStatusWithDBUnchanged = async (requestURL, status) => {
        const initDbStats = await mongoose.connection.db.stats();
        const res = await withAuthentication(
            request(server)
                .post(requestURL)
                .field('uploadedFileName', FILE_NAME)
                .attach('uploadedFile', TEST_FILE),
        );

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
    // TODO: Bad fieldKey
    // TODO: Bad fileName

    const testSuccessfulUploadOnPatient = async (patientId) => {
        const startTimestamp = Date.now();
        const res = await withAuthentication(
            request(server)
                .post(
                    `/api/patients/${patientId}/files/${STEP_KEY}/${FIELD_KEY}/${FILE_NAME}`,
                )
                .field('uploadedFileName', FILE_NAME)
                .attach('uploadedFile', TEST_FILE),
        );

        expect(res.status).toBe(201);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);

        expect(resContent.data.name).toBe(FILE_NAME);
        expect(resContent.data.uploadDate).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(resContent.data.uploadDate).toBeLessThanOrEqual(Date.now());
        expect(resContent.data.uploadedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(resContent.data.mimetype).toBe('image/jpeg');
        expect(resContent.data.size).toBe(4855);

        const patientData = await mongoose.connection.db
            .collection(STEP_KEY)
            .findOne({ patientId: patientId });
        expect(patientData.lastEdited).toBeGreaterThanOrEqual(startTimestamp);
        expect(patientData.lastEdited).toBeLessThanOrEqual(Date.now());
        expect(patientData.lastEditedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
    };

    // TODO: Patient with no data for this step
    it('uploads file for patient with no step data', async () => {
        const startTimestamp = Date.now();
        await testSuccessfulUploadOnPatient(PATIENT_ID_WITHOUT_DATA);
        const patientData = await mongoose.connection.db
            .collection(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITHOUT_DATA });
        expect(patientData[FIELD_KEY].length).toBe(1);
        expect(patientData[FIELD_KEY][0].filename).toBe(FILE_NAME);
        expect(patientData[FIELD_KEY][0].uploadedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(patientData[FIELD_KEY][0].uploadDate).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(patientData[FIELD_KEY][0].uploadDate).toBeLessThanOrEqual(
            Date.now(),
        );
    });

    // TODO: Patient with data for this step

    // TODO: Mock S3 putObject
    // TODO: Check DB
});
