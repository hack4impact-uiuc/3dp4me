const db = require('../utils/db');
const request = require('supertest');

beforeAll(async () => await db.connect());
afterAll(async () => await db.closeDatabase());
beforeEach(() => (server = require('../../app')));
afterEach(async () => await db.clearDatabase());

describe('Test authentication ', () => {
    it('fails when given no token', (done) => {
        request(server).get('/api/patients').expect(401, done);
    });
});
