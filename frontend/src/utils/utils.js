export const getPatientName = (patient) => {
    if (!patient) return patient;

    let name = patient.firstName;

    if (patient.fathersName) name += ` ${patient.fathersName}`;

    if (patient.grandfathersName) name += ` ${patient.grandfathersName}`;

    if (patient.familyName) name += ` ${patient.familyName}`;

    return name;
};
