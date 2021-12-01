const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { PATIENT_STATUS_ENUM } = require('../../utils/constants');
const {
    sendResponse,
    getDataFromModelWithPaginationAndSearch,
} = require('../../utils/response');

/**
 * Returns basic information for all patients that are active in
 * the specified step.
 *
 *
 */
router.get(
    '/:stepKey',
    errorWrap(async (req, res) => {
        const { stepKey } = req.params;

        const steps = await models.Step.find({ key: stepKey });

        // Check if step exists
        if (steps.length === 0) return sendResponse(res, 404, 'Step not found');

        // Get model
        let model;
        try {
            model = mongoose.model(stepKey);
        } catch (error) {
            return sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        const getPatientDataResponse = await getDataFromModelWithPaginationAndSearch(
            req,
            models.Patient,
            {
                status: PATIENT_STATUS_ENUM.ACTIVE,
            },
        );

        const patients = getPatientDataResponse.data;
        const countTotalPatients = getPatientDataResponse.count;

        // Create array of promises to speed this up a bit
        const lookups = patients.map(async (p) => {
            const stepInfo = await model.findOne({
                patientId: p._id.toString(),
            });

            return {
                ...p.toObject(),
                [stepKey]: stepInfo,
            };
        });

        const patientData = await Promise.all(lookups);
        return sendResponse(res, 200, '', { data: patientData, count: countTotalPatients });
    }),
);

module.exports = router;
