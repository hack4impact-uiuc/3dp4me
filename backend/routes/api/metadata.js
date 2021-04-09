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

const generateFieldSchema = (field) => {
    switch (field.fieldType) {
        case fieldEnum.STRING:
            return {
                type: String,
                required: true,
                default: '',
            };
        case fieldEnum.MULTILINE_STRING:
            return {
                type: String,
                required: true,
                default: '',
            };
        case fieldEnum.NUMBER:
            return {
                type: Number,
                required: true,
                default: 0,
            };
        case fieldEnum.DATE:
            return {
                type: Date,
                required: true,
                default: new Date(),
            };
        case fieldEnum.PHONE:
            return {
                type: String,
                required: true,
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
                type: [models.questionOptionSchema],
                required: true,
                default: [],
                validate: {
                    validator: validateOptions,
                    message: 'Index must be unique',
                },
            };
        case fieldEnum.FILE:
            return {
                type: [fileSchema],
                required: true,
                default: [],
            };
        case fieldEnum.AUDIO:
            return {
                type: [fileSchema],
                required: true,
                default: [],
            };
        case fieldEnum.DIVIDER:
            return null;
        default:
            throw new Error(`Unrecognized field type, ${field.type}`);
    }
};

const addCollection = (stepMetadata) => {
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
        const metaData = await models.Step.find({});
        if (!metaData) {
            res.status(404).json({
                code: 404,
                success: true,
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
    errorWrap(async (req, res) => {
        const steps = req.body;
        const new_step_metadata = new models.Step(steps);
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                new_step_metadata.fields.forEach((field) => {
                    if (field.fieldType == fieldEnum.RADIO_BUTTON) {
                        if (field.options == null || field.options.length < 1) {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: 'Radiobuttons require options.',
                            });
                        }
                    }
                });
                await new_step_metadata.save();
                addCollection(steps);
            });

            res.status(200).json({
                code: 200,
                success: true,
                message: 'Step successfully created.',
                data: new_step_metadata,
            });
        } catch (error) {
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

const getFieldByKey = (object_list, key) => {
    for (object of object_list) {
        console.log(object.key === key);

        if (object.key === key) {
            return object;
        }
    }

    return null;
};

// PUT metadata/steps/:stepkey
router.put(
    '/steps/:stepkey',
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const session = await mongoose.startSession();
        step_to_edit = await models.Step.findOne({ key: stepkey });
        //TODO: rename to camel case
        let addedFields = [];

        //
        req.body.fields.forEach((request_field) => {
            // If both fields are the same but fieldtypes are not the same
            const field = getFieldByKey(step_to_edit.fields, request_field.key);
            console.log(field);
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
            req.body.fields.length - addedFields.length <=
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
                addedFieldObject[field.key] = generateFieldSchema(field);
            });
            console.log(addedFieldsObject);
            console.log(collection);
            console.log(addedFieldsObject);
            schema.add(addedFieldsObject);

            const step = await models.Step.findOneAndUpdate(
                { key: stepkey },
                { $set: req.body },
            );
        });

        // Check if user changed field type
        // Check whetehr user deleted or added to metadata object

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
