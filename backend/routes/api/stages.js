const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const mongoose = require('mongoose');

// Get all patients  basic info
router.get(
    '/',
    errorWrap(async (req, res) => {
        models.Patient.find(
            {},
            // '_id patientInfo.name createdDate lastEdited status',
        ).then((patients) => {
            res.status(200).json({
                code: 200,
                success: true,
                result: patients,
            });
        });
    }),
);

// GET: Returns basic stage info for every user
// GET: Returns everything associated with patient step
router.get(
    '/:stage',
    errorWrap(async (req, res) => {
        const { stage } = req.params;
        let stepData = null;
        const steps = await models.Step.find({ key: stage });

        // Check if stage exists in metadataf
        if (steps.length == 0) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Stage not found.',
            });
        }

        const collection = await mongoose.connection.db.collection(stage);
        stepData = await collection.find({}).toArray();

        res.status(200).json({
            code: 200,
            success: true,
            result: stepData,
        });
    }),
);

module.exports = router;
