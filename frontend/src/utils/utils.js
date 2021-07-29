export const getPatientName = (patient) => {
    if (!patient) return patient;

    let name = patient.firstName;

    if (patient.fathersName) name += ` ${patient.fathersName}`;

    if (patient.grandfathersName) name += ` ${patient.grandfathersName}`;

    if (patient.familyName) name += ` ${patient.familyName}`;

    return name;
};

export const sortMetadata = (stepMetaData) => {
    const data = stepMetaData?.sort((a, b) => a?.stepNumber - b?.stepNumber);

    data.forEach((stepData) => {
        stepData.fields.sort((a, b) => a?.fieldNumber - b?.fieldNumber);
        sortSubFields(stepData?.fields);
    });

    return data;
};

const sortSubFields = (fields) => {
    if (!fields) return;

    fields.forEach((field) => {
        field.subFields.sort((a, b) => a?.fieldNumber - b?.fieldNumber);
        sortSubFields(field?.subFields?.subFields);
    });
};
