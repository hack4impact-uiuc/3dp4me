const {
    Patient,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    feedbackEnum,
} = require('./Patient');

const { Step } = require('./Metadata');
const { fileSchema, stepStatusEnum } = require('./StepSchemaSubmodel');

const models = {
    Patient,
    Step,
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
