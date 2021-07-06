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
const { removeAttributesFrom } = require('../../middleware/requests');
const { fieldEnum, isUniqueStepNumber } = require('../../models/Metadata');
const mongoose = require('mongoose');

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
            if (!field?.options?.length)
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
        case fieldEnum.FIELD_GROUP:
            if (!field?.subFields?.length)
                throw new Error('Field groups must have sub fields');

            return {
                type: [generateFieldsFromMetadata(field.subFields)],
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
    generateFieldsFromMetadata(stepMetadata.fields, stepSchema);
    const schema = new mongoose.Schema(stepSchema);
    mongoose.model(stepMetadata.key, schema, stepMetadata.key);
};

const generateFieldsFromMetadata = (fieldsMetadata, schema = {}) => {
    fieldsMetadata.forEach((field) => {
        const generatedSchema = generateFieldSchema(field);
        if (generatedSchema) schema[field.key] = generatedSchema;
    });

    return schema;
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
    if (!stepBody?.key) {
        return res.status(400).json({
            success: false,
            message: 'No stepkey in steps',
        });
    }
    stepBody = removeAttributesFrom(stepBody, ['_id', '__v']);

    const stepKey = stepBody.key;
    stepToEdit = await models.Step.findOne({ key: stepKey });

    // Return 404 if stepToEdit cannot be found
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

        if (field && field.fieldType !== requestField.fieldType) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Cannot change fieldType',
            });
        } else if (
            !field &&
            !addedFields.some(
                (addedField) => addedField.key === requestField.key,
            )
        ) {
            addedFields.push(requestField);
        }
    });

    // Checks that fields were not deleted
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
        { new: true, session: session, validateBeforeSave: false },
    );

    return step;
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
                for (step of stepData) {
                    // Run synchronous tests and async tests separately
                    let error = step.validateSync();
                    let isValid = await isUniqueStepNumber(
                        step.stepNumber,
                        step.key,
                        session,
                    );

                    if (error || !isValid) {
                        await session.abortTransaction();
                        if (error) {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: `Validation error: ${error}`,
                            });
                        } else {
                            return res.status(400).json({
                                code: 400,
                                success: false,
                                message: `Validation error: Does not have unique stepNumber`,
                            });
                        }
                    }
                }
            });
            res.status(200).json({
                code: 200,
                success: true,
                message: 'Step(s) successfully edited.',
                result: stepData,
            });
        } catch (error) {
            console.log(error);
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
