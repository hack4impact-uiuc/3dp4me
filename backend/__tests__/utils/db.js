const _ = require('lodash');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const patientData = require('../../../scripts/data/patients.json');
const roleData = require('../../../scripts/data/roles.json');
const stepData = require('../../../scripts/data/steps.json');
const medicalData = require('../../../scripts/data/medicalInfo.json');
const surveyData = require('../../../scripts/data/survey.json');
const exampleData = require('../../../scripts/data/example.json');
const { initModels } = require('../../utils/init-models');
const { models } = require('../../models');

//const mongod = new MongoMemoryServer();
const replSet = new MongoMemoryReplSet({
    replSet: { storageEngine: 'wiredTiger' },
});

/**
 * Connect to the in-memory database.
 * Should only be called once per suite
 */
module.exports.connect = async () => {
    // replSet = new MongoMemoryReplSet({
    //     replSet: { storageEngine: 'wiredTiger' },
    // });

    await replSet.waitUntilRunning();
    const uri = await replSet.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
    await this.resetDatabase();
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await replSet.stop();
};

/**
 * Resets the database to it's original state with mock data.
 */
module.exports.resetDatabase = async () => {
    // TODO: We'll need to convert other sub-schema's mongoIDs as well. Is there a better way to do this???
    // The best way might be to save as a .js file instead...
    await this.clearDatabase();
    await mongoose.connection.db
        .collection('Patient')
        .insertMany(convertStringsToMongoIDs(patientData));
    await mongoose.connection.db
        .collection('Role')
        .insertMany(convertStringsToMongoIDs(roleData));
    await mongoose.connection.db
        .collection('steps')
        .insertMany(convertStringsToMongoIDs(stepData));
    await mongoose.connection.db
        .collection('survey')
        .insertMany(convertStringsToMongoIDs(surveyData));
    await mongoose.connection.db
        .collection('example')
        .insertMany(convertStringsToMongoIDs(exampleData));
    await mongoose.connection.db
        .collection('medicalInfo')
        .insertMany(convertStringsToMongoIDs(medicalData));
    await initModels();
};

/**
 * Given an array of objects, converts all _id fields from string to ObjectId no matter how deep.
 * Need to call this on all collections before inserting or we'll have issues.
 * @param {Object} arr The input collection
 * @returns Modified collection with converted _id fields
 */
const convertStringsToMongoIDs = (arr) => {
    return arr.map((obj) => {
        return _.transform(obj, (r, v, k) => {
            if (k === '_id') r[k] = mongoose.Types.ObjectId(v);
            else r[k] = v;
        });
    });
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const steps = await models.Step.find({});
    steps.forEach((step) => {
        delete mongoose.connection.models[step.key];
    });

    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
