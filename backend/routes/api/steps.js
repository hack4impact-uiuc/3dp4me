const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { PATIENT_STATUS_ENUM } = require('../../utils/constants');
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
        let { pageNumber, nPerPage } = req.query;

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

        let patients;

        if (pageNumber !== undefined && nPerPage !== undefined) {
            pageNumber = parseInt(pageNumber, 10);
            nPerPage = parseInt(nPerPage, 10);

            const documentsToSkip = pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0;
            // Cannot use an aggregation here due to the encryption middleware
            patients = await models.Patient.find({
                status: PATIENT_STATUS_ENUM.ACTIVE,
            })
                .sort({ _id: 1 }).skip(documentsToSkip)
                .limit(nPerPage);
        } else {
            // Cannot use an aggregation here due to the encryption middleware
            patients = await models.Patient.find({
                status: PATIENT_STATUS_ENUM.ACTIVE,
            });
        }

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
        return sendResponse(res, 200, '', patientData);
    }),
);

module.exports = router;
