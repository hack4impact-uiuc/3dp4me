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

let patients = null;
let roles = null;
let steps = null;
let survey = null;
let example = null;
let medicalInfo = null;

let replSet = new MongoMemoryReplSet({
    replSet: { storageEngine: 'wiredTiger' },
});

/**
 * Connect to the in-memory database.
 * Should only be called once per suite
 */
module.exports.connect = async () => {
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
    await this.clearDatabase();
    await mongoose.connection.dropDatabase();
};

/**
 * Resets the database to it's original state with mock data.
 */
module.exports.resetDatabase = async () => {
    await this.clearDatabase();
    constructStaticData();
    await mongoose.connection.db.collection('Patient').insertMany(patients);
    await mongoose.connection.db.collection('Role').insertMany(roles);
    await mongoose.connection.db.collection('steps').insertMany(steps);
    await initModels();
    constructDynamicData();
    await mongoose.connection.db.collection('survey').insertMany(survey);
    await mongoose.connection.db.collection('example').insertMany(example);
    await mongoose.connection.db
        .collection('medicalInfo')
        .insertMany(medicalInfo);
};

const constructStaticData = () => {
    if (patients) return;

    patients = constructAll(patientData, models.Patient);
    roles = constructAll(roleData, models.Role);
    steps = constructAll(stepData, models.Step);
};

const constructDynamicData = () => {
    if (survey) return;

    survey = constructAll(surveyData, mongoose.model('survey'));
    example = constructAll(exampleData, mongoose.model('example'));
    medicalInfo = constructAll(medicalData, mongoose.model('medicalInfo'));
};

const constructAll = (data, constructor) => {
    return data.map((item) => new constructor(item));
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
