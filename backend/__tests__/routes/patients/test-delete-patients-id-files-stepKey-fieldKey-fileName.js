const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    getCurrentAuthenticatedUserAttribute,
} = require('../../utils/auth');

describe('DELETE /patients/:id/files/:stepKey/:fieldKey/:fileName #214', () => {
    const STEP_KEY = 'example';
    const PATIENT_ID_MISSING_DATA = '60944e084f4c0d4330cc258d';
    const PATIENT_ID_WITH_DATA = '60944e084f4c0d4330cc258d';

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

    // it('returns 404 when given bad ID format', (done) => {
    //     withAuthentication(
    //         request(server).delete(
    //             `/api/patients/badid/${STEP_KEY}/file/filename`,
    //         ),
    //     ).expect(404, done);
    // });

    // it('returns 404 when given nonexistent ID', (done) => {
    //     const randID = '6092a9ae9e3769ae75abe0a5';
    //     withAuthentication(
    //         request(server).delete(
    //             `/api/patients/${randID}/${STEP_KEY}/file/filename`,
    //         ),
    //     ).expect(404, done);
    // });

    // it('returns 404 when given bad stepKey', (done) => {
    //     withAuthentication(
    //         request(server).delete(
    //             `/api/patients/${PATIENT_ID_MISSING_DATA}/badstep/file/filename`,
    //         ),
    //     ).expect(404, done);
    // });

    it('delete one file from step 2', async () => {
        const STEP_KEY = 'example';
        const FIELD_KEY = 'file';
        const PATIENT_ID = '60944e084f4c0d4330cc258b';
        const FILE_NAME = 'utilisation_modular.ssf';

        const res = await withAuthentication(
            request(server).delete(
                `api/patient/${PATIENT_ID}/files/${STEP_KEY}/${FIELD_KEY}/${FILE_NAME}`,
            ),
        );
        // expect(res.status).toBe(200);

        // const step = await db.collection('example').findOne({ "patientId": PATIENT_ID});
        // expect(step.file).toBe([]);
    });
});
