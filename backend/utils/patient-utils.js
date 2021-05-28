const { models } = require('../../models');

const getStepKeys = async () => {
    const steps = await models.Step.find({});
    let stepKeys = [];
    steps.forEach((element) => stepKeys.push(element.key));
    return stepKeys;
};

module.exports = { getStepKeys };
