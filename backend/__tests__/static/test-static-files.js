let server = require('../../app');
const db = require('../utils/db');
const AWS = require('aws-sdk-mock');
const request = require('supertest');
const { initAuthMocker, setCurrentUser } = require('../utils/auth');

describe('Get statically served files', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../app');
    });

    it('uses cross origin isolation', async () => {
        const res = await request(server).get(`/`);

        // Need these headers for SharedArrayBuffer to work in newer browsers
        expect(res.status).toBe(200);
        expect(res.header['cross-origin-embedder-policy']).toBe('require-corp');
        expect(res.header['cross-origin-opener-policy']).toBe('same-origin');
    });
});
