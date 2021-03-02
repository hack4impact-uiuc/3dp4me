const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { fieldEnum } = require('../../models/Metadata');
const mongoose = require('mongoose');

const addCollection = (stepMetadata) => {
    let stepSchema = {};
    stepSchema.patientId = { type: String, required: true, unique: true };
    stepSchema.status = { type: String, required: true, default: 'incomplete' };
    stepSchema.lastEdited = { type: Date, required: true, default: new Date() };
    stepSchema.lastEditedBy = {
        type: String,
        required: true,
        default: 'Admin',
    };
    stepMetadata.fields.forEach((field) => {
        switch (field.type) {
            case fieldEnum.STRING:
                stepSchema[field.key] = {
                    type: String,
                    required: true,
                    default: '',
                };
                break;
            case fieldEnum.MULTILINE_STRING:
                stepSchema[field.key] = {
                    type: String,
                    required: true,
                    default: '',
                };
                break;
            case fieldEnum.NUMBER:
                stepSchema = { type: Number, required: true, default: 0 };
                break;
            case fieldEnum.DATE:
                stepSchema = { type: Date, required: true, default: null };
                break;
            //TODO: add validator for international phone numbers
            case fieldEnum.PHONE:
                stepSchema = { type: String, required: true, default: '' };
                break;
            case fieldEnum.DROPDOWN:
                if (field.options == null)
                    throw new Error('Dropdown must have options');

                stepSchema = {
                    type: String,
                    required: true,
                    default: '',
                    enum: field.options,
                };
                break;
            case fieldEnum.RADIO_BUTTON:
                if (field.options == null)
                    throw new Error('Radio button must have options');
                console.log(field.options);
                stepSchema = {
                    type: String,
                    required: true,
                    default: '',
                    enum: field.options,
                };
                break;
            case fieldEnum.FILE:
                stepSchema = {
                    type: [fileSchema],
                    required: true,
                    default: [],
                };
                break;
            default:
                throw new Error(`Unrecognized field type, ${field.type}`);
        }
    });
    const schema = new mongoose.Schema(stepSchema);
    mongoose.model(stepMetadata.key, schema);
};

// POST metadata/steps
router.post(
    '/steps',
    errorWrap(async (req, res) => {
        const steps = req.body;
        const new_steps = new models.Step(steps);

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await new_steps.save();
            addCollection(new_steps);
            res.status(200).json({
                code: 200,
                success: true,
                message: 'Step successfully created.',
                data: data,
            });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({
                code: 500,
                success: false,
                message: `Step could not be added: ${error}`,
            });
        } finally {
            session.endSession();
        }
    }),
);

// PUT metadata/steps/:stepkey
router.put(
    '/steps/:stepkey',
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const step = await models.Step.findOneAndUpdate(
            { key: stepkey },
            { $set: req.body },
        );

        await step.save(function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.status(200).json({
                    code: 200,
                    sucess: true,
                    message: 'Step successfully edited.',
                    data: data,
                });
            }
        });
    }),
);

// DELETE metadata/steps/:stepkey
router.delete(
    '/steps/:stepkey',
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const step = await models.Step.deleteOne({ key: stepkey });

        if (step.deletedCount === 0) {
            res.status(404).json({
                success: false,
                message: 'Step not found',
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Step deleted',
            });
        }
    }),
);

module.exports = router;
