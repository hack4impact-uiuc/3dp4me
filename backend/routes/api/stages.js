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
        const steps = await models.Step.find({ key: stage });

        // Check if stage exists in metadata
        if (steps.length == 0) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Stage not found.',
            });
        }

        const model = mongoose.model(stage);

        // Cannot use an aggregation here due to the encryption middleware
        let patients = await models.Patient.find({
            status: overallStatusEnum.ACTIVE,
        }).lean();

        let lookups = patients.map(async (p) => {
            const stageInfo = await model.findOne({
                patientId: p._id.toString(),
            });

            return {
                ...p.toObject(),
                [stage]: stageInfo,
            };
        });

        let patientData = await Promise.all(lookups);
        res.status(200).json({
            code: 200,
            success: true,
            result: patientData,
        });
    }),
);

module.exports = router;
