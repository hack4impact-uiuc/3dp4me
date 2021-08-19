const mongoose = require('mongoose');
const { generateFieldSchema } = require('./init-db');
const { abortAndError } = require('./transactionUtils');

module.exports.getFieldByKey = (objectList, key) => {
    if (!objectList) {
        return null;
    }

    for (object of objectList) {
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
    const schema = mongoose.model(stepKey).schema;
    schema.add(schemaUpdate);
};

module.exports.getAddedFields = async (session, oldFields, newFields) => {
    // Build up a list of al the new fields added
    let addedFields = [];
    for (const requestField of newFields) {
        const existingField = this.getFieldByKey(oldFields, requestField.key);

        // If both fields are the same but fieldtypes are not the same
        if (existingField && !areFieldTypesSame(requestField, existingField))
            await abortAndError(
                session,
                `Cannot change the type of ${existingField.key}`,
            );

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
