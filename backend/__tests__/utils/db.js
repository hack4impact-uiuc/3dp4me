const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const patientData = require('../../../scripts/data/patients.json');
const roleData = require('../../../scripts/data/roles.json');
const stepData = require('../../../scripts/data/steps.json');
const medicalData = require('../../../scripts/data/medicalInfo.json');
const surveyData = require('../../../scripts/data/survey.json');
const exampleData = require('../../../scripts/data/example.json');
const { initModels } = require('../../utils/init-models');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 * Should only be called once per suite
 */
module.exports.connect = async () => {
    const uri = await mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
    await mongoose.connection.db.collection('steps').insertMany(stepData);
    await initModels();
    await this.resetDatabase();
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
};

/**
 * Resets the database to it's original state with mock data.
 */
module.exports.resetDatabase = async () => {
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
};

/**
 * Converts a string to a MongoID. Need to call this on all collections before inserting or we'll have issues.
 * @param {Object} arr The input collection
 * @returns Modified collection with converted _id fields
 */
const convertStringsToMongoIDs = (arr) => {
    return arr.map((d) => {
        if (d?._id) return { ...d, _id: mongoose.Types.ObjectId(d._id) };
        return d;
    });
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }

    mongoose.connection.models = {};
};
