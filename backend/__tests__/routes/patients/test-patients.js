const db = require('../../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');
const { stepStatusEnum, models } = require('../../../models');
const { isSubObject } = require('../../utils/utils');

describe('POST /patient', () => {
    const STEP_KEY = 'example';
    const PATIENT_ID_MISSING_DATA = '60944e084f4c0d4330cc258d';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    // Patient with existing data for this step
    // Check lastEdited and lastEditecBy
    // Do various levels of upload (complete, incomplete, etc)
    // Change fields that should never be changed (like _id, lastEdited, lastEditedBy) should return a bad response

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 404 when given bad ID format', (done) => {
        withAuthentication(
            request(server).post(`/api/patients/badid/${STEP_KEY}`),
        ).expect(500, done);
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).post(`/api/patients/${randID}/${STEP_KEY}`),
        ).expect(404, done);
    });

    it('returns 404 when given bad stepKey', (done) => {
        withAuthentication(
            request(server).post(
                `/api/patients/${PATIENT_ID_MISSING_DATA}/badstep`,
            ),
        ).expect(404, done);
    });

    it('saves data for patient which had no prior data', async () => {
        const body = {
            // "_id": "60944e084f4c0d4330cc261d",
            status: stepStatusEnum.FINISHED,
            string: 'helloo',
            multilineString: 'Test looooooooong string',
            number: 932,
            date: Date.now(),
            phone: '123-456-7891',
            file: [
                {
                    filename: 'ears.stp',
                    uploadedBy: 'Jason',
                    uploadDate: '2020-10-12T18:20:15.625Z',
                },
            ],
            audio: [
                {
                    filename: 'interview.mp3',
                    uploadedBy: 'Jason',
                    uploadDate: '2020-10-12T18:20:15.625Z',
                },
                {
                    filename: 'interview2.mp4',
                    uploadedBy: 'Brian',
                    uploadDate: '2020-10-14T18:20:15.625Z',
                },
            ],
            // "patientId": "60944e084f4c0d4330cc25ae",
            // "lastEdited": "2020-09-15T06:10:11.759Z",
            // "lastEditedBy": "Domingo"
        };

        const res = await withAuthentication(
            request(server)
                .post(`/api/patients/${PATIENT_ID_MISSING_DATA}/${STEP_KEY}`)
                .send(body),
        );

        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);
        // expect(isSubObject(resContent.result, body)).toBe(true);

        const updatedData = await mongoose.connection
            .collection(STEP_KEY)
            .findOne({ patientId: PATIENT_ID_MISSING_DATA });
        expect(isSubObject(updatedData, body)).toBe(true);
        console.log(updatedData);
    });
});
