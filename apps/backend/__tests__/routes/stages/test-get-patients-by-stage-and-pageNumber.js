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
const { DEFAULT_PATIENTS_ON_GET_REQUEST } = require('../../../utils/constants');

describe('GET /stages', () => {
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

    it('get patients with invalid stepKey', async () => {
        // Send the request
        const res = await withAuthentication(
            request(server).get('/api/stages/stepKey123'),
        );

        // Check response
        expect(res.status).toBe(404);
    });

    it('get patients with only stage', async () => {
        // Send the request
        const res = await withAuthentication(
            request(server).get('/api/stages/survey'),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that the number of patients recieved is correct
        const allPatients = resContent.result.data;
        expect(allPatients.length).toBe(DEFAULT_PATIENTS_ON_GET_REQUEST);
    });

    it('get patients with only stage and pageNumber', async () => {
        const pageNumber = 2;

        // Send the request
        const res = await withAuthentication(
            request(server).get(`/api/stages/survey?pageNumber=${pageNumber}`),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that the number of patients recieved is correct
        const allPatients = resContent.result.data;
        expect(allPatients.length).toBe(DEFAULT_PATIENTS_ON_GET_REQUEST);
    });

    it('get patients with only stage, pageNumber, and nPerPage', async () => {
        const pageNumber = 1;
        const nPerPage = 25;

        // Send the request
        const res = await withAuthentication(
            request(server).get(
                `/api/stages/survey?pageNumber=${pageNumber}&nPerPage=${nPerPage}`,
            ),
        );

        // Check response
        const resContent = JSON.parse(res.text);
        expect(res.status).toBe(200);
        expect(resContent.success).toBe(true);

        // Check that the number of patients recieved is correct
        const allPatients = resContent.result.data;
        expect(allPatients.length).toBe(nPerPage);
    });
});
