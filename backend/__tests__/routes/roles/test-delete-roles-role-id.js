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
    const COLLECTION_NAME = 'Role';

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
        withAuthentication(request(server).delete(`/api/roles/badid`)).expect(
            500,
            done,
        );
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(
            request(server).delete(`/api/roles/${randID}`),
        ).expect(404, done);
    });

    it('delete mutable role', async () => {
        const mutableRoleId = '60944e084f4c0d4330cc25f1';
        const res = await withAuthentication(
            request(server).delete(`/api/roles/${mutableRoleId}`),
        );

        expect(res.status).toBe(200);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);

        const actualResult = await mongoose
            .model(COLLECTION_NAME)
            .findById(mutableRoleId);

        const expectedResult = null;

        expect(actualResult).toBe(expectedResult);
    });

    it('does not delete immutable role', async () => {
        const immutableRoleId = '60944e084f4c0d4330cc25ef';

        let expectedResult = await mongoose
            .model(COLLECTION_NAME)
            .findById(immutableRoleId);
        expectedResult = expectedResult.toObject();

        const res = await withAuthentication(
            request(server).delete(`/api/roles/${immutableRoleId}`),
        );

        expect(res.status).toBe(400);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);

        let actualResult = await mongoose
            .model(COLLECTION_NAME)
            .findById(immutableRoleId);
        actualResult = actualResult.toObject();

        expect(actualResult).toStrictEqual(expectedResult);
    });
});
