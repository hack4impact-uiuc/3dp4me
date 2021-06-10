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
                default: Date.now,
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
                type: String,
                required: true,
                default: '',
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
        const metaData = await models.Step.find({});
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

const putOneStep = async (stepBody, res, session) => {
    if (!stepBody.key) {
        return res.status(400).json({
            success: false,
            message: 'No stepkey in steps',
        });
    }

    const stepKey = stepBody.key;
    stepToEdit = await models.Step.findOne({ key: stepKey });
    // Return 404 if step_to_edit is null
    if (!stepToEdit) {
        return res.status(404).json({
            success: false,
            message: 'No step with that key',
        });
    }

    let addedFields = [];

    stepBody.fields.forEach((requestField) => {
        // If both fields are the same but fieldtypes are not the same
        const field = getFieldByKey(stepToEdit.fields, requestField.key);

        if (field && field.type == requestField.type) {
            //TODO: add logic for this case
        } else if (
            !field &&
            !addedFields.some(
                (addedField) => addedField.key === requestField.key,
            )
        ) {
            addedFields.push(requestField);
        } else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Invalid request',
            });
        }
    });

    if (
        stepBody.fields.length - addedFields.length <
        stepToEdit.fields.length
    ) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Cannot delete fields',
        });
    }

    const schema = await mongoose.model(stepKey).schema;

    const addedFieldsObject = {};

    addedFields.forEach((field) => {
        addedFieldsObject[field.key] = generateFieldSchema(field);
    });
    schema.add(addedFieldsObject);

    step = await models.Step.findOneAndUpdate(
        { key: stepKey },
        { $set: stepBody },
        { new: true },
    );
    const data = await step.save({ ...session, validateBeforeSave: false });
    const error = schema.validateSync();
    if (error != null) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: `Validation error: ${error}`,
        });
    }

    // Check if user changed field type
    // Check whether user deleted or added to metadata object

    //TOOO: figure out what session is
    return data;
};

// PUT metadata/steps/:stepkey
router.put(
    '/steps/',
    errorWrap(async (req, res) => {
        try {
            let stepData = [];
            await mongoose.connection.transaction(async (session) => {
                for (step of req.body) {
                    stepData.push(await putOneStep(step, res, session));
                }
            });

            res.status(200).json({
                code: 200,
                success: true,
                message: 'Step(s) successfully edited.',
                data: stepData,
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
module.exports.generateSchemaFromMetadata = generateSchemaFromMetadata;
