const _ = require('lodash');
const request = require('supertest');
const AWS = require('aws-sdk-mock');

let server = require('../../../app');
const db = require('../../utils/db');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');
const {
    DEFAULT_PATIENTS_ON_GET_REQUEST,
} = require('../../../utils/constants');

describe('GET /patients', () => {
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

    it('get patients without query parameters', async () => {
        // Send the request
        const res = await withAuthentication(
            request(server).get('/api/patients'),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that the number of patients recieved is correct
        const allPatients = resContent.result;

        expect(allPatients.length).toBe(DEFAULT_PATIENTS_ON_GET_REQUEST);
    });

    it('get patients with parameters', async () => {
        const pageNumber = 1;
        const nPerPage = 25;

        // Send the request
        const res = await withAuthentication(
            request(server).get(`/api/patients?pageNumber=${pageNumber}&nPerPage=${nPerPage}`),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that the number of patients recieved is correct
        const allPatients = resContent.result;
        expect(allPatients.length).toBe(nPerPage);
    });
});
