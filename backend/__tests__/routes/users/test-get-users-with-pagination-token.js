const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
    initIdentityServiceMocker,
    identityServiceParams,
} = require('../../utils/auth');

const { DEFAULT_USERS_ON_GET_REQUEST } = require('../../../utils/constants');

/**
 * This test suite only checks the paramters for the request.
 */

describe('GET /users', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        initIdentityServiceMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../../app');
    });

    it('get users without query parameters', async () => {
        // Send the request
        await withAuthentication(request(server).get('/api/users'));

        const identityParams = identityServiceParams();

        expect(identityParams.Limit).toBe(DEFAULT_USERS_ON_GET_REQUEST);
    });

    it('get users with nPerPage but no pagination token', async () => {
        const nPerPage = 3;

        // Send the request
        await withAuthentication(
            request(server).get(`/api/users?nPerPage=${nPerPage}`),
        );

        const identityParams = identityServiceParams();

        expect(identityParams.Limit).toBe(nPerPage);
    });
});
