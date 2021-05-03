const db = require('../utils/db');
const request = require('supertest');

var server = null;
beforeAll(async () => await db.connect());
afterAll(async () => await db.closeDatabase());
afterEach(async () => {
    await db.clearDatabase();
    server = require('../../app');
});

describe('GET patients/ ', () => {
    it('returns nothing on empty DB', (done) => {
        request(server).get('/api/patients').expect(200, done);
    });
});
