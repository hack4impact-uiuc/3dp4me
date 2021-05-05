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

describe('POST /patient', () => {
    const stepKey = 'patientinfo';
    const patientID = '6092ab8ce348b73cf0963d0b';

    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    // Bad stepKey
    // Patient with existing data for this step
    // Patient without existing data for this step
    // Check lastEdited and lastEditecBy
    // Change fields that should never be changed (like _id) should return a bad response

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 404 when given bad ID format', (done) => {
        withAuthentication(
            request(server).post(`/api/patients/badid/${stepKey}`),
        ).expect(404, done);
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).post(`/api/patients/${randID}/${stepKey}`),
        ).expect(404, done);
    });

    it('returns 404 when given bad stepKey', (done) => {
        withAuthentication(
            request(server).post(`/api/patients/${patientID}/badstep`),
        ).expect(404, done);
    });
});
