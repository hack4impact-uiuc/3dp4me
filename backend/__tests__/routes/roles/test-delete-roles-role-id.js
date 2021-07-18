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

describe('DELETE /roles/:roleid', () => {
    // const STEP_KEY = 'example';
    // const FIELD_KEY = 'file';
    // const PATIENT_ID_WITH_ONE_FILE = '60944e084f4c0d4330cc258b';

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
        withAuthentication(request(server).delete(`/api/roles/badid`)).expect(
            404,
            done,
        );
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).delete(`/api/patients/${randID}`),
        ).expect(404, done);
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).delete(`/api/patients/${randID}`),
        ).expect(404, done);
    });

    it('delete mutable role', async () => {
        const roleId = '60944e084f4c0d4330cc25f1';
        const res = await withAuthentication(
            request(server).delete(`/api/patients/${randID}`),
        );

        expect(res.status).toBe(200);

        const actualResult = await mongoose
            .model('Role')
            .findOne({ _id: mongoose.Types.ObjectId(roleId) });
        const expectedResult = {};

        expect(actualResult).toBe(expectedResult);
    });

    it('does not delete immutable role', async () => {
        const roleId = '60944e084f4c0d4330cc25ef';

        const actualResult = await mongoose
            .model('Role')
            .findOne({ _id: mongoose.Types.ObjectId(roleId) });

        withAuthentication(
            request(server).delete(`/api/patients/${randID}`),
        ).expect(404, done);

        expect(res.status).toBe(200);

        const expectedResult = await mongoose
            .model('Role')
            .findOne({ _id: mongoose.Types.ObjectId(roleId) });

        expect(actualResult).toBe(expectedResult);
    });
});
