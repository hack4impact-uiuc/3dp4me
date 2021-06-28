const express = require('express');
const router = express.Router();
const isValidNumber = require('libphonenumber-js');
const { errorWrap } = require('../../utils');
const {
    models,
    fileSchema,
    stepStatusEnum,
    validateOptions,
} = require('../../models');
const { fieldEnum } = require('../../models/Metadata');
const mongoose = require('mongoose');
const { requireAdmin, isAdmin } = require('../../middleware/authentication');

const generateFieldSchema = (field) => {
    switch (field.fieldType) {
        case fieldEnum.STRING:
            return {
                type: String,
                default: '',
            };
        case fieldEnum.MULTILINE_STRING:
            return {
                type: String,
                default: '',
            };
        case fieldEnum.NUMBER:
            return {
                type: Number,
                default: 0,
            };
        case fieldEnum.DATE:
            return {
                type: Date,
                default: Date.now,
            };
        case fieldEnum.PHONE:
            return {
                type: String,
                default: '',
                validate: {
                    validator: isValidNumber,
                    message: 'Not a valid phone number',
                },
            };
        case fieldEnum.RADIO_BUTTON:
            if (field.options == null)
                throw new Error('Radio button must have options');

            return {
                type: String,
                default: '',
            };
        case fieldEnum.FILE:
            return {
                type: [fileSchema],
                default: [],
            };
        case fieldEnum.AUDIO:
            return {
                type: [fileSchema],
                default: [],
            };
        case fieldEnum.DIVIDER:
            return null;
        default:
            throw new Error(`Unrecognized field type, ${field.type}`);
    }
};

const generateSchemaFromMetadata = (stepMetadata) => {
    let stepSchema = {};
    stepSchema.patientId = { type: String, required: true, unique: true };
    stepSchema.status = {
        type: String,
        required: true,
        enum: Object.values(stepStatusEnum),
        default: stepStatusEnum.UNFINISHED,
    };
    stepSchema.lastEdited = { type: Date, required: true, default: new Date() };
    stepSchema.lastEditedBy = {
        type: String,
        required: true,
        default: 'Admin',
    };
    stepMetadata.fields.forEach((field) => {
        const generatedSchema = generateFieldSchema(field);
        if (generatedSchema) stepSchema[field.key] = generatedSchema;
    });
    const schema = new mongoose.Schema(stepSchema);
    mongoose.model(stepMetadata.key, schema, stepMetadata.key);
};

// GET metadata/steps
router.get(
    '/steps',
    errorWrap(async (req, res) => {
        let metaData;

        if (isAdmin(req.user)) {
            metaData = await models.Step.find({});
        } else {
            metaData = await models.Step.find({
                readableGroups: { $in: [req.user._id.toString()] },
            });
        }

        if (!metaData) {
            res.status(404).json({
                code: 404,
                success: false,
                message: 'Steps not found.',
            });
        } else {
            res.status(200).json({
                code: 200,
                success: true,
                message: 'Steps returned successfully.',
                result: metaData,
            });
        }
    }),
);

// POST metadata/steps
router.post(
    '/steps',
    requireAdmin,
    errorWrap(async (req, res) => {
        const steps = req.body;
        const new_step_metadata = new models.Step(steps);

        try {
            await mongoose.connection.transaction(async (session) => {
                new_step_metadata.fields.forEach((field) => {
                    if (field.fieldType == fieldEnum.RADIO_BUTTON) {
                        if (field.options == null || field.options.length < 1)
                            throw new Error('Radiobuttons require options');
                    }
                });

                await new_step_metadata.save({ session });
                generateSchemaFromMetadata(steps);
            });

            await res.status(200).json({
                code: 200,
                success: true,
                message: 'Step successfully created.',
                data: new_step_metadata,
            });
        } catch (error) {
            res.status(400).json({
                code: 400,
                success: false,
                message: `Step could not be added: ${error}`,
            });
        }
    }),
);

const getFieldByKey = (object_list, key) => {
    for (object of object_list) {
        if (object?.key === key) {
            return object;
        }
    }

    return null;
};

// PUT metadata/steps/:stepkey
router.put(
    '/steps/:stepkey',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const stepPermissions = await models.Step.findOneAndUpdate(
            { writableGroups: { $in: [req.user._id.toString()] } },
            { key: stepkey },
            { $set: req.body },
        );
        if (!stepPermissions) {
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Step cannot be edited with current permissions',
            });
        }
        const session = await mongoose.startSession();
        step_to_edit = await models.Step.findOne({ key: stepkey });

        let addedFields = [];
        let step;

        req.body.fields.forEach((request_field) => {
            // If both fields are the same but fieldtypes are not the same
            const field = getFieldByKey(step_to_edit.fields, request_field.key);

            if (field && field.type == request_field.type) {
                //TODO: add logic for this case
            } else if (
                !field &&
                !addedFields.some(
                    (addedField) => addedField.key === request_field.key,
                )
            ) {
                addedFields.push(request_field);
            } else {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Invalid request',
                });
            }
        });

        if (
            req.body.fields.length - addedFields.length <
            step_to_edit.fields.length
        ) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Cannot delete fields',
            });
        }

        await session.withTransaction(async () => {
            const schema = await mongoose.model(stepkey).schema;

            const addedFieldsObject = {};

            addedFields.forEach((field) => {
                addedFieldsObject[field.key] = generateFieldSchema(field);
            });
            schema.add(addedFieldsObject);

            step = await models.Step.findOneAndUpdate(
                { key: stepkey },
                { $set: req.body },
                { new: true },
            );
        });

        // Check if user changed field type
        // Check whether user deleted or added to metadata object
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
    requireAdmin,
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
module.exports.generateSchemaFromMetadata = generateSchemaFromMetadata;
