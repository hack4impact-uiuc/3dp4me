const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { uploadFile, downloadFile } = require('../../utils/aws/aws-s3-helpers');

// POST metadata/steps
router.post(
    '/metadata/steps',
    errorWrap(async (req, res) => {
        const steps = req.body;

        try {
            const new_steps = new models.metaData(steps);
            const saved_steps = await _steps.save();
        } catch (error) {
            res.status(500).send({ error });
        }

        res.status(SUCCESS).send({
            code: SUCCESS,
            success: true,
            message: 'Step successfully created.',
            data: resp,
        });
    }),
);
