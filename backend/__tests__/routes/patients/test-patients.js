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
const { stepStatusEnum } = require('../../../models');

describe('POST /patient', () => {
    const stepKey = 'example';
    const patientMissingData = '60944e084f4c0d4330cc258d';

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

    // it('returns 404 when given bad ID format', (done) => {
    //     withAuthentication(
    //         request(server).post(`/api/patients/badid/${stepKey}`),
    //     ).expect(500, done);
    // });

    // it('returns 404 when given nonexistent ID', (done) => {
    //     const randID = '6092a9ae9e3769ae75abe0a5';
    //     withAuthentication(
    //         request(server).post(`/api/patients/${randID}/${stepKey}`),
    //     ).expect(404, done);
    // });

    // it('returns 404 when given bad stepKey', (done) => {
    //     withAuthentication(
    //         request(server).post(`/api/patients/${patientMissingData}/badstep`),
    //     ).expect(404, done);
    // });

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

        const req = await withAuthentication(
            request(server).post(
                `/api/patients/${patientMissingData}/${stepKey}`,
                body,
            ),
        );

        const res = JSON.parse(req.text);
        expect(res.code).toBe(200);
        expect(res.success).toBe(true);
    });
});
