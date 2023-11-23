const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
const omitDeep = require('omit-deep-lodash');

let server = require('../../../app');
const { models } = require('../../../models');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('PUT /roles/:roleid', () => {
    afterAll(async () => db.closeDatabase());
    afterEach(async () => db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../../app');
    });

    it('returns 500 when given bad ID format', (done) => {
        withAuthentication(request(server).put('/api/roles/badid')).expect(
            500,
            done,
        );
    });

    it('returns 404 when given nonexistent ID', (done) => {
        const randID = '6092a9ae9e3769ae75abe0a5';
        withAuthentication(request(server).put(`/api/roles/${randID}`)).expect(
            404,
            done,
        );
    });

    it('update existing mutable role id', async () => {
        const MUTABLE_ROLE_ID = '60f9b995230a5996ba7c1af6';
        const initialResult = await getRoleFromDB(MUTABLE_ROLE_ID);

        const body = {
            ...initialResult,
            roleDescription: {
                EN: 'This is changed',
                AR: 'This is changed in Arabic.',
            },
            roleName: {
                EN: 'New name',
                AR: 'New name in Arabic',
            },
        };

        const res = await withAuthentication(
            request(server).put(`/api/roles/${MUTABLE_ROLE_ID}`).send(body),
        );

        expect(res.status).toBe(200);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(true);

        let actualResult = await getRoleFromDB(MUTABLE_ROLE_ID);

        actualResult = omitDeep(actualResult, '_id');
        const expectedResult = omitDeep(body, '_id');

        expect(actualResult).toStrictEqual(expectedResult);
    });

    it('does not update existing immutable role', async () => {
        const IMMUTABLE_ROLE_ID = '60f9b995230a5996ba7c1af5';

        const body = await getRoleFromDB(IMMUTABLE_ROLE_ID);

        const res = await withAuthentication(
            request(server).put(`/api/roles/${IMMUTABLE_ROLE_ID}`).send(body),
        );

        expect(res.status).toBe(403);
        const resContent = JSON.parse(res.text);
        expect(resContent.success).toBe(false);
    });

    const getRoleFromDB = async (roleId) => {
        const result = await models.Role.findOne({
            _id: mongoose.Types.ObjectId(roleId),
        });
        return result.toObject();
    };
});
