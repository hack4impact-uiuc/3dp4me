/**
 * Given a patient, constructs their full name
 */
export const getPatientName = (patient) => {
    if (!patient) return patient;

    let name = patient.firstName;

    if (patient.fathersName) name += ` ${patient.fathersName}`;

    if (patient.grandfathersName) name += ` ${patient.grandfathersName}`;

    if (patient.familyName) name += ` ${patient.familyName}`;

    return name;
};

/**
 * Sorts a metadata object by stepNumber and fieldNumber. This function may mutate the param.
 * @param {Array} stepMetaData The step metadata returned by the backend.
 * @returns The sorted metadata.
 */
export const sortMetadata = (stepMetaData) => {
    const data = stepMetaData?.sort((a, b) => a?.stepNumber - b?.stepNumber);

    data.forEach((stepData) => {
        stepData.fields.sort((a, b) => a?.fieldNumber - b?.fieldNumber);
        sortSubFields(stepData?.fields);
    });

    return data;
};

/**
 * Sorts the subfields of a field.
 */
const sortSubFields = (fields) => {
    if (!fields) return;

    fields.forEach((field) => {
        field.subFields.sort((a, b) => a?.fieldNumber - b?.fieldNumber);
        sortSubFields(field?.subFields?.subFields);
    });
};
