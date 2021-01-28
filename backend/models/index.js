const {
    Patient,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    fileSchema,
    feedbackEnum,
} = require('./Patient');

const models = {
    Patient,
};

module.exports = {
    models,
    statusEnum,
    deliveryEnum,
    overallStatusEnum,
    fileSchema,
    feedbackEnum,
};
