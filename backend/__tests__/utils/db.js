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

let replSet = null;

/**
 * Connect to the in-memory database.
 * Should only be called once per suite
 */
module.exports.connect = async () => {
    replSet = new MongoMemoryReplSet({
        replSet: { storageEngine: 'wiredTiger' },
    });

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
    await mongoose.disconnect();
    await replSet.stop();
};

/**
 * Resets the database to it's original state with mock data.
 */
module.exports.resetDatabase = async () => {
    await this.clearDatabase();
    await insertManyWithConstructors('Patient', models.Patient, patientData);
    await insertManyWithConstructors('Role', models.Role, roleData);
    await insertManyWithConstructors('steps', models.Step, stepData);

    await initModels();
    await insertManyWithConstructors(
        'survey',
        mongoose.model('survey'),
        surveyData,
    );
    await insertManyWithConstructors(
        'example',
        mongoose.model('example'),
        exampleData,
    );
    await insertManyWithConstructors(
        'medicalInfo',
        mongoose.model('medicalInfo'),
        medicalData,
    );
};

const insertManyWithConstructors = async (
    collectionName,
    constructor,
    data,
) => {
    await Promise.all(
        data.map((item) =>
            mongoose.connection.db
                .collection(collectionName)
                .insertOne(new constructor(item)),
        ),
    );
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
