const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { uploadFile, downloadFile } = require('../../utils/aws/aws-s3-helpers');

// POST metadata/steps
router.post(
    '/steps',
    errorWrap(async (req, res) => {
        const steps = req.body;
        const new_steps = new models.Step(steps);

        await new_steps.save(function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'Step successfully created.',
                    data: data,
                });
            }
        });
    }),
);

// PUT metadata/steps/:stepkey
router.put(
    '/steps/:stepkey',
    errorWrap(async (req, res) => {
        try {
            const { stepkey } = req.params;
            const step = await models.Step.find({ key: stepkey });
            step.set(req.body);
            const result = await step.save();
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    }),
);

// DELETE metadata/steps/:stepkey
router.delete(
    '/steps/:stepkey',
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const step = await models.Step.find({ key: stepkey });
        step.delete();
        res.status(201).json({
            success: true,
            message: 'Step deleted',
        });
    }),
);

module.exports = router;
