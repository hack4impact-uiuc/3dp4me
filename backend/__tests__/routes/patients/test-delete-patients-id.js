const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    initIdentityServiceMocker,
    withAuthentication,
    initS3ListObjectsV2Mocker,
    initS3DeleteObjectsMocker,
} = require('../../utils/auth');

describe('DELETE /patients/:id', () => {
    const PATIENT_ID_WITH_ONE_FILE = '60944e084f4c0d4330cc258b';
    const BAD_PATIENT_ID = 'badid';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        initIdentityServiceMocker(AWS);
        setCurrentUser(AWS);
        initS3DeleteObjectsMocker(AWS);
        initS3ListObjectsV2Mocker(AWS);
    });

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 404 when given patient ID that does not exist', (done) => {
        withAuthentication(
            request(server).delete(
                `/api/patients/${BAD_PATIENT_ID}`,
            ),
        ).expect(404, done);
    });

    it('deletes patient data when given existing patient ID', async () => {
        const res = await withAuthentication(
            request(server).delete(
                `/api/patients/${PATIENT_ID_WITH_ONE_FILE}`,
            ),
        );
        expect(res.status).toBe(200);

        // Check if the patient has been deleted from the Patient collectiom
        const actual_patient = await mongoose
            .model('Patient')
            .findById(PATIENT_ID_WITH_ONE_FILE);
        const expected_patient = null;

        expect(actual_patient).toBe(expected_patient);

        // Check if the patient has been deleted from each Step's collectiom
        const stepsToCheck = ['medicalInfo', 'survey', 'example'];

        stepsToCheck.forEach((stepKey) => {
            let Model;
            try {
                Model = mongoose.model(stepKey);
                // eslint-disable-next-line no-await-in-loop
                const actual_patient_step_data = await Model.findOne({ patientId: PATIENT_ID_WITH_ONE_FILE });
                const expected_patient_step_data = null;
                expect(actual_patient_step_data).toBe(expected_patient_step_data);
            } catch (error) {
                console.error(`test-delete-patients-id - step ${stepKey} not found`);
            }
        })
    });
});
