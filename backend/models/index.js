const {
    Patient,
    statusEnum,
    deliveryEnum,
    feedbackEnum,
} = require('./Patient');

const { Step, questionOptionSchema, validateOptions } = require('./Metadata');
const { Role } = require('./Role');

const models = {
    Patient,
    Step,
    Role,
    questionOptionSchema,
};

module.exports = {
    models,
    validateOptions,
    statusEnum,
    deliveryEnum,
    feedbackEnum,
};
