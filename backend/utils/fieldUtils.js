const mongoose = require('mongoose');

const { models } = require('../models');

const { isAdmin } = require('./aws/awsUsers');
const { generateFieldSchema } = require('./initDb');
const { abortAndError } = require('./transactionUtils');

/**
 * Returns the keys of all fields writable by a user in a step.
 * @param {Object} user The user to check access for. Usually req.user.
 * @param {String} stepKey The key of the step to check.
 * @returns Array of strings. Each entry is a fieldKey that is writable.
 */
module.exports.getWritableFields = async (user, stepKey) => {
    const fields = await getWritableFieldsInStep(user, stepKey);
    return fields.concat(['status']);
};

const getWritableFieldsInStep = async (user, stepKey) => {
    let stepData = await models.Step.findOne({ key: stepKey });
    if (!stepData) return [];

    // Return all fields if user is admin
    stepData = stepData.toObject();
    if (isAdmin(user)) return stepData.fields.map((f) => f.key);

    // Check each field to see if user has a writable role
    const writableFields = stepData.fields.filter((field) =>
        field.writableGroups.some((role) => user.roles.includes(role)),
    );

    return writableFields.map((f) => f.key);
};

/**
 * Checks if a field is readable by a user. If the stepKey or fieldKey are
 * invalid, returns false.
 * @param {Object} user The user checking the field's readability. Should usually be req.user.
 * @param {String} stepKey The stepKey of the field.
 * @param {String} fieldKey The fieldKey within the step.
 * @returns True if readable.
 */
module.exports.isFieldReadable = async (user, stepKey, fieldKey) => {
    if (isAdmin(user)) return true;

    const fieldData = await getFieldMetadata(stepKey, fieldKey);
    if (!fieldData) return false;

    // Check that the user includes at least one readableGroup
    return fieldData?.readableGroups?.some((g) => user.roles.includes(g));
};

/**
 * Checks if a field is writable by a user. If the stepKey or fieldKey are
 * invalid, returns false.
 * @param {Object} user The user checking the field's writability. Should usually be req.user.
 * @param {String} stepKey The stepKey of the field.
 * @param {String} fieldKey The fieldKey within the step.
 * @returns True if writable.
 */
module.exports.isFieldWritable = async (user, stepKey, fieldKey) => {
    if (isAdmin(user)) return true;

    const fieldData = await getFieldMetadata(stepKey, fieldKey);
    if (!fieldData) return false;

    // Check that the user includes at least one readableGroup
    return fieldData?.writableGroups?.some((g) => user.roles.includes(g));
};

const getFieldMetadata = async (stepKey, fieldKey) => {
    let stepData = await models.Step.findOne({ key: stepKey });
    if (!stepData) return null;

    stepData = stepData.toObject();
    return stepData?.fields?.find((f) => f.key === fieldKey);
};

module.exports.getFieldByKey = (objectList, key) => {
    if (!objectList) {
        return null;
    }

    for (const object of objectList) {
        if (object?.key === key) {
            return object;
        }
    }

    return null;
};

module.exports.addFieldsToSchema = (stepKey, addedFields) => {
    // Create a schema for the new fields
    const schemaUpdate = {};
    addedFields.forEach((field) => {
        schemaUpdate[field.key] = generateFieldSchema(field);
    });

    // Add it to the existing schema
    const { schema } = mongoose.model(stepKey);
    schema.add(schemaUpdate);
};

module.exports.getAddedFields = async (session, oldFields, newFields) => {
    // Build up a list of al the new fields added
    const addedFields = [];
    for (const requestField of newFields) {
        const existingField = this.getFieldByKey(oldFields, requestField.key);

        // If both fields are the same but fieldtypes are not the same
        if (existingField && !areFieldTypesSame(requestField, existingField)) {
            await abortAndError(
                session,
                `Cannot change the type of ${existingField.key}`,
            );
        }

        // If this is a new field that we haven't seen yet, add it to the list of new fields
        const hasAddedField = addedFields.some(
            (f) => f.key === requestField.key,
        );
        if (!existingField && !hasAddedField) addedFields.push(requestField);
    }

    return addedFields;
};

const areFieldTypesSame = (fieldA, fieldB) => {
    if (!fieldA || !fieldB) return false;

    return fieldA.fieldType === fieldB.fieldType;
};
