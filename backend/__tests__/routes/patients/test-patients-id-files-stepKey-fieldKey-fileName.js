var server = require('../../../app');
const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
const resolve = require('path').resolve;
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUserAttribute,
    initS3Mocker,
    getLastUploadedFileParams,
} = require('../../utils/auth');
const { S3_BUCKET_NAME } = require('../../../utils/aws/aws-exports');

describe('POST /patients/:id/files/:stepKey/:fieldKey/:fileName', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        initS3Mocker(AWS);
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
    const TEST_FILE = resolve(`./__tests__/mock-data/test-file.jpg`);

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

        // Check response
        expect(resContent.result.name).toBe(FILE_NAME);
        expect(resContent.result.uploadDate).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(resContent.result.uploadDate).toBeLessThanOrEqual(Date.now());
        expect(resContent.result.uploadedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(resContent.result.mimetype).toBe('image/jpeg');
        expect(resContent.result.size).toBe(4855);

        // Check DB
        const patientData = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: patientId });
        expect(patientData.lastEdited.getTime()).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(patientData.lastEdited.getTime()).toBeLessThanOrEqual(
            Date.now(),
        );
        expect(patientData.lastEditedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );

        // Check that AWS was called correctly
        const params = getLastUploadedFileParams();
        expect(params.Body.length).toBe(4855);
        expect(params.Bucket).toBe(S3_BUCKET_NAME);
        expect(params.Key).toBe(`${patientId}/${STEP_KEY}/file/${FILE_NAME}`);
    };

    it('uploads file for patient with no step data', async () => {
        const startTimestamp = Date.now();
        await testSuccessfulUploadOnPatient(PATIENT_ID_WITHOUT_DATA);
        const patientData = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITHOUT_DATA });
        expect(patientData[FIELD_KEY].length).toBe(1);
        expect(patientData[FIELD_KEY][0].filename).toBe(FILE_NAME);
        expect(patientData[FIELD_KEY][0].uploadedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(
            patientData[FIELD_KEY][0].uploadDate.getTime(),
        ).toBeGreaterThanOrEqual(startTimestamp);
        expect(
            patientData[FIELD_KEY][0].uploadDate.getTime(),
        ).toBeLessThanOrEqual(Date.now());
    });

    it('uploads file for patient with step data', async () => {
        const startTimestamp = Date.now();
        const initialPatientData = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_DATA });
        const initNumFiles = initialPatientData[FIELD_KEY].length;

        await testSuccessfulUploadOnPatient(PATIENT_ID_WITH_DATA);
        const finalPatientData = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_DATA });
        expect(finalPatientData[FIELD_KEY].length).toBe(initNumFiles + 1);
        expect(finalPatientData[FIELD_KEY][initNumFiles].filename).toBe(
            FILE_NAME,
        );
        expect(finalPatientData[FIELD_KEY][initNumFiles].uploadedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(
            finalPatientData[FIELD_KEY][initNumFiles].uploadDate.getTime(),
        ).toBeGreaterThanOrEqual(startTimestamp);
        expect(
            finalPatientData[FIELD_KEY][initNumFiles].uploadDate.getTime(),
        ).toBeLessThanOrEqual(Date.now());
    });
});
