const db = require('../../utils/db');
const request = require('supertest');
const AWS = require('aws-sdk-mock');
const mongoose = require('mongoose');
var server = require('../../../app');
const {
    initAuthMocker,
    setCurrentUser,
    withAuthentication,
} = require('../../utils/auth');

describe('POST /patient', () => {
    afterAll(async () => await db.closeDatabase());
    afterEach(async () => await db.resetDatabase());
    beforeAll(async () => {
        await db.connect();
        initAuthMocker(AWS);
        setCurrentUser(AWS);
    });

    beforeEach(() => {
        server = require('../../app');
        // mongoose.connection.db.collection("Patient").insertOne({
        //     firstName: "Matt",
        //     fathersName: "Dan",
        //     grandfathersName: "Gene",
        //     familyName: "Walowski",
        //     dateCreated: Date.now(),
        //     orderId: { type: String, required: false, default: '' },
        //     lastEdited: { type: Date, required: false, default: new Date() },
        //     lastEditedBy: { type: String, required: true },
        //     status: {
        //         type: overallStatusEnum,
        //         required: false,
        //         default: overallStatusEnum.ACTIVE,
        //     },
        // })
    });

    it('returns ', (done) => {
        const names = mongoose.modelNames();
        console.log(names);
        withAuthentication(
            request(server).get('/api/patients/badid/badstage'),
        ).expect(200, done);
    });
});
