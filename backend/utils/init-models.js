const { models } = require('../models');
const { generateSchemaFromMetadata } = require('../routes/api/metadata');

const initModels = async () => {
    const steps = await models.Step.find();
    for (const step of steps) await generateSchemaFromMetadata(step);
};

module.exports = { initModels };
