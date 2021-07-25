const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models, overallStatusEnum } = require('../../models');
const mongoose = require('mongoose');

// GET: Returns basic stage info for every user
// GET: Returns everything associated with patient step
router.get(
    '/:stage',
    errorWrap(async (req, res) => {
        const { stage } = req.params;
        let stepData = [];
        const steps = await models.Step.find({ key: stage });

        // Check if stage exists in metadata
        if (steps.length == 0) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Stage not found.',
            });
        }

        const model = await mongoose.model(stage);

        // TODO: Replace with an aggregation command that gets all patient data then $lookup on patientId for stage
        let patients = await models.Patient.find({
            status: overallStatusEnum.ACTIVE,
        });

        for (let i = 0; i < patients.length; i++) {
            const stepInfo = await model.findOne({
                patientId: patients[i]._id.toString(),
            });

            stepData[i] = patients[i].toObject();
            stepData[i][stage] = stepInfo;
        }

        res.status(200).json({
            code: 200,
            success: true,
            result: stepData,
        });
    }),
);

module.exports = router;
