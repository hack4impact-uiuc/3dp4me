const {
    Patient,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    feedbackEnum,
} = require('./Patient');

const { Step } = require('./Metadata');
const { fileSchema, stepStatusEnum } = require('./StepSchemaSubmodel');
const { Role } = require('./Role');

const models = {
    Patient,
    Step,
    Role,
};

module.exports = {
    models,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    fileSchema,
    stepStatusEnum,
    feedbackEnum,
};
