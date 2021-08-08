var server = require('../../../app');
const db = require('../../utils/db');
const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');

const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');
const { models } = require('../../../models');

describe('PUT /patients/:id', () => {
    const PATIENT_ID = '60944e084f4c0d4330cc258b';
    const COLLECTION_NAME = 'Patient';

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

    it('returns 500 when given bad ID format', (done) => {
        withAuthentication(request(server).put(`/api/patients/badid`)).expect(
            500,
            done,
        );
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).put(`/api/patients/${randID}`),
        ).expect(404, done);
    });

    it('updates mutable fields when given existent id', async () => {
        const initialResponse = await getPatientFromDB();
        const timeBeforeReq = Date.now();

        const body = {
            ...initialResponse,
            firstName: 'Vasu',
            grandfathersName: 'Gramps',
            orderId: 'm',
            familyName: 'Chalasani',
            status: 'Inactive',
        };

        const res = await withAuthentication(
            request(server).put(`/api/patients/${PATIENT_ID}`).send(body),
        );

        expect(res.status).toBe(200);

        let expectedResult = _.omit(body, 'lastEdited');
        expectedResult.lastEditedBy = 'Matthew Walowski';

        let actualResult = await getPatientFromDB();
        const timeAfterReq = actualResult.lastEdited.getTime();
        actualResult = _.omit(actualResult, 'lastEdited');

        expect(actualResult).toStrictEqual(expectedResult);
        expect(timeAfterReq).toBeGreaterThanOrEqual(timeBeforeReq);
    });

    it('does not update removed/restricted attributes when given existent id', async () => {
        let expectedResult = await getPatientFromDB();
        expectedResult.lastEditedBy = 'Matthew Walowski';
        const timeBeforeReq = Date.now();

        const body = {
            ...expectedResult,
            _id: '60944e084f4c0d4330cc258b',
            dateCreated: '2024-10-02T01:17:55.181Z',
            lastEdited: '2024-10-12T22:25:28.949Z',
            lastEditedBy: 'VasuChalasani',
        };

        const res = await withAuthentication(
            request(server).put(`/api/patients/${PATIENT_ID}`).send(body),
        );

        expect(res.status).toBe(200);

        let actualResult = await getPatientFromDB();
        const timeAfterReq = actualResult.lastEdited.getTime();

        actualResult = _.omit(actualResult, 'lastEdited');
        expectedResult = _.omit(expectedResult, 'lastEdited');

        expect(actualResult).toStrictEqual(expectedResult);
        expect(timeAfterReq).toBeGreaterThanOrEqual(timeBeforeReq);
    });

    const getPatientFromDB = async () => {
        const result = await models.Patient.findOne({
            _id: mongoose.Types.ObjectId(PATIENT_ID),
        });
        return result.toObject();
    };
});
