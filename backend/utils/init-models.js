const { models } = require('../models');
const { generateSchemaFromMetadata } = require('../routes/api/metadata');

const initModels = async () => {
    const steps = await models.Step.find();
    steps.forEach((step) => {
        generateSchemaFromMetadata(step);
    });
};

module.exports = { initModels };
