const {
    Patient,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    fileSchema,
    feedbackEnum,
} = require('./Patient');

const { Step } = require('./Metadata');

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
    feedbackEnum,
};
