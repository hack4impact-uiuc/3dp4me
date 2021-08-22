const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { PATIENT_STATUS_ENUM } = require('../../utils/constants');
const mongoose = require('mongoose');
const { sendResponse } = require('../../utils/response');

/**
 * Returns basic information for all patients that are active in
 * the specified step.
 *
 * TODO: We should paginate this in the future.
 */
router.get(
    '/:stepKey',
    errorWrap(async (req, res) => {
        const { stepKey } = req.params;
        const steps = await models.Step.find({ key: stepKey });

        // Check if step exists
        if (steps.length == 0)
            return await sendResponse(res, 404, 'Step not found');

        // Get model
        let model;
        try {
            model = mongoose.model(stepKey);
        } catch (error) {
            return await sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        // Cannot use an aggregation here due to the encryption middleware
        let patients = await models.Patient.find({
            status: PATIENT_STATUS_ENUM.ACTIVE,
        });

        // Create array of promises to speed this up a bit
        let lookups = patients.map(async (p) => {
            const stepInfo = await model.findOne({
                patientId: p._id.toString(),
            });

            return {
                ...p.toObject(),
                [stepKey]: stepInfo,
            };
        });

        let patientData = await Promise.all(lookups);
        await sendResponse(res, 200, '', patientData);
    }),
);

module.exports = router;