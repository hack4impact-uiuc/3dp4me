const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUserAttribute,
} = require('../../utils/auth');

describe('DELETE /patients/:id/files/:stepKey/:fieldKey/:fileName #214', () => {
    const STEP_KEY = 'example';
    const FIELD_KEY = 'file';
    const PATIENT_ID_WITH_ONE_FILE = '60944e084f4c0d4330cc258b';

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

    it('returns 404 when given bad ID format', (done) => {
        withAuthentication(
            request(server).delete(
                `/api/patients/badid/${STEP_KEY}/file/filename`,
            ),
        ).expect(404, done);
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).delete(
                `/api/patients/${randID}/${STEP_KEY}/file/filename`,
            ),
        ).expect(404, done);
    });

    it('returns 404 when given bad stepKey', (done) => {
        withAuthentication(
            request(server).delete(
                `/api/patients/${PATIENT_ID_WITH_ONE_FILE}/badstep/file/filename`,
            ),
        ).expect(404, done);
    });

    it('returns 404 when given nonexistent file', (done) => {
        withAuthentication(
            request(server).delete(
                `/api/patients/${PATIENT_ID_WITH_ONE_FILE}/${STEP_KEY}/file/badfilename`,
            ),
        ).expect(404, done);
    });

    it('delete file from step with one file', async () => {
        const startTimestamp = Date.now();
        const FILE_NAME = 'utilisation_modular.ssf';
        const original_step = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_ONE_FILE });
        const expected_file_output = original_step.file;
        expected_file_output.shift();

        const res = await withAuthentication(
            request(server).delete(
                `/api/patients/${PATIENT_ID_WITH_ONE_FILE}/files/${STEP_KEY}/${FIELD_KEY}/${FILE_NAME}`,
            ),
        );
        expect(res.status).toBe(200);

        const modified_step = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_ONE_FILE });

        expect(JSON.stringify(modified_step.file)).toEqual(
            JSON.stringify(expected_file_output),
        );
        expect(modified_step.lastEditedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(modified_step.lastEdited.getTime()).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(modified_step.lastEdited.getTime()).toBeLessThanOrEqual(
            Date.now(),
        );
    });

    it('delete file from step with more than one file', async () => {
        const startTimestamp = Date.now();
        const FILE_NAME = 'intelligent_encompassing.cpio';
        const PATIENT_ID_WITH_MANY_FILES = '60944e084f4c0d4330cc258c';
        const original_step = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_MANY_FILES });
        const expected_file_output = original_step.file;
        expected_file_output.shift();

        const res = await withAuthentication(
            request(server).delete(
                `/api/patients/${PATIENT_ID_WITH_MANY_FILES}/files/${STEP_KEY}/${FIELD_KEY}/${FILE_NAME}`,
            ),
        );
        expect(res.status).toBe(200);

        let modified_step = await mongoose
            .model(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_WITH_MANY_FILES });
        modified_step = modified_step.toObject();

        expect(JSON.stringify(modified_step.file)).toStrictEqual(
            JSON.stringify(expected_file_output),
        );
        expect(modified_step.lastEditedBy).toBe(
            getCurrentAuthenticatedUserAttribute('name'),
        );
        expect(modified_step.lastEdited.getTime()).toBeGreaterThanOrEqual(
            startTimestamp,
        );
        expect(modified_step.lastEdited.getTime()).toBeLessThanOrEqual(
            Date.now(),
        );
    });
});
