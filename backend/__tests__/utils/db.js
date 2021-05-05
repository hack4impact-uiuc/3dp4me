const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const patientData = require('../../../scripts/patients.json');
const roleData = require('../../../scripts/roles.json');
const stepData = require('../../../scripts/steps.json');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    const uri = await mongod.getUri();

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
    await mongoose.connection.close();
    await mongod.stop();
};

/**
 * Resets the database to it's original state with mock data.
 */
module.exports.resetDatabase = async () => {
    await this.clearDatabase();
    await mongoose.connection.db.collection('Patient').insertMany(patientData);
    await mongoose.connection.db.collection('Role').insertMany(roleData);
    await mongoose.connection.db.collection('steps').insertMany(stepData);
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
};
