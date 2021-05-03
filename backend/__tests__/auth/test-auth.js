const db = require('../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');

describe('Test authentication ', () => {
    beforeAll(async () => {
        await db.connect();
        AWS.mock(
            'CognitoIdentityServiceProvider',
            'getUser',
            (params, callback) => {
                return Promise.reject();
            },
        );
    });

    afterAll(async () => await db.closeDatabase());
    beforeEach(() => (server = require('../../app')));
    afterEach(async () => await db.clearDatabase());

    it('fails when given no auth header', (done) => {
        request(server).get('/api/patients').expect(401, done);
    });

    it('fails when given empty auth header', (done) => {
        request(server)
            .get('/api/patients')
            .set({ authorization: '' })
            .expect(401, done);
    });

    it('fails when given no token', (done) => {
        request(server)
            .get('/api/patients')
            .set({ authorization: 'Bearer ' })
            .expect(401, done);
    });

    it('fails when given bad token', (done) => {
        request(server)
            .get('/api/patients')
            .set({
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            })
            .expect(401, done);
    });

    it('fails when given valid user token but improper roles', (done) => {
        AWS.remock(
            'CognitoIdentityServiceProvider',
            'getUser',
            (params, callback) => {
                return Promise.resolve(MOCK_USER);
            },
        );

        request(server)
            .get('/api/patients')
            .set({
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            })
            .expect(403, done);
    });
});

const MOCK_USER = {
    Username: 'google_213124633943835461786',
    Attributes: [
        {
            Name: 'sub',
            Value: 'a5f6e6c5-48a0-4106-89a3-fcc62a2f6148',
        },
        {
            Name: 'identities',
            Value:
                '[{"userId":"113124640943890461786","providerName":"Google","providerType":"Google","issuer":null,"primary":true,"dateCreated":1618957958605}]',
        },
        {
            Name: 'email_verified',
            Value: 'false',
        },
        {
            Name: 'name',
            Value: 'Matthew Walowski',
        },
        {
            Name: 'email',
            Value: 'mattwalowski@gmail.com',
        },
        {
            Name: 'picture',
            Value:
                'https://lh4.googleusercontent.com/-DJCZsBiGGb4/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnM6lv4n8dbAvpbbKDKx6JPtUqKFw/s96-c/photo.jpg',
        },
    ],
    UserCreateDate: '2021-04-20T22:32:38.639Z',
    UserLastModifiedDate: '2021-04-20T22:32:38.639Z',
    Enabled: true,
    UserStatus: 'EXTERNAL_PROVIDER',
};
