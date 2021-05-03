const mongoose = require('mongoose');
const { initModels } = require('./init-models');

const initDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
        .once('open', () => {
            console.log('Connected to the DB');
            initModels();
        })
        .on('error', (error) =>
            console.log('Error connecting to the database: ', error),
        );

    mongoose.set('useFindAndModify', false);
};

module.exports = { initDB };
