const {
    Patient,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    feedbackEnum,
} = require('./Patient');

const { Step, questionOptionSchema, validateOptions } = require('./Metadata');
const { fileSchema, stepStatusEnum } = require('./StepSchemaSubmodel');
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
    overallStatusEnum,
    fileSchema,
    stepStatusEnum,
    feedbackEnum,
};
