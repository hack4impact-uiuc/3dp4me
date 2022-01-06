const faker = require('faker');
const fs = require('fs');
const {
    PATIENT_STATUS_ENUM,
    STEP_STATUS_ENUM,
} = require('../backend/utils/constants');
const mongoose = require('mongoose');

const generateData = () => {
    const patients = generatePatients(100);
    saveDataToFile(patients, 'patients.json');

    const roles = generateRoles(15);
    saveDataToFile(roles, 'roles.json');

    createSteps(patients);
};

const saveDataToFile = (data, filename) => {
    const serializedData = JSON.stringify(data, null, 2);
    fs.writeFileSync(`scripts/data/${filename}`, serializedData);
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const generatePatients = (numPatients) => {
    patients = [];

    for (let i = 0; i < numPatients; i++) patients.push(generatePatient());

    return patients;
};

const generatePatient = () => {
    const patient = {};
    patient.firstName = faker.name.firstName();
    patient._id = mongoose.Types.ObjectId();

    if (getRandomInt(2)) patient.fathersName = faker.name.firstName();

    if (getRandomInt(2)) patient.grandfathersName = faker.name.firstName();

    if (getRandomInt(2)) patient.orderId = faker.random.alphaNumeric();

    patient.familyName = faker.name.lastName();
    patient.dateCreated = faker.date.past();
    patient.lastEdited = faker.date.past();
    patient.lastEditedBy = faker.name.firstName() + faker.name.lastName();

    const status = getRandomInt(3);
    if (status == 0) patient.status = PATIENT_STATUS_ENUM.ACTIVE;
    else if (status == 1) patient.status = PATIENT_STATUS_ENUM.ARCHIVED;
    else patient.status = PATIENT_STATUS_ENUM.FEEDBACK;

    return patient;
};

const createSteps = (users) => {
    const medicalData = [];
    const surveyData = [];
    const exampleData = [];

    users.forEach((user) => {
        if (getRandomInt(2))
            medicalData.push(
                appendGlobalStepData(generateMedicalInfo, user._id),
            );
        if (getRandomInt(2))
            surveyData.push(appendGlobalStepData(generateSurveyInfo, user._id));
        if (getRandomInt(2))
            exampleData.push(
                appendGlobalStepData(generateExampleInfo, user._id),
            );
    });

    saveDataToFile(removeNulls(medicalData), 'medicalInfo.json');
    saveDataToFile(removeNulls(surveyData), 'survey.json');
    saveDataToFile(removeNulls(exampleData), 'example.json');
};

const removeNulls = (arr) => {
    return arr.filter((e) => e !== null);
};

const appendGlobalStepData = (generateInfo, userID) => {
    let info = null;
    const status = getRandomInt(3);
    if (status == 0) info = generateInfo(STEP_STATUS_ENUM.FINISHED);
    else if (status == 1) info = generateInfo(STEP_STATUS_ENUM.PARTIAL);
    else return null;

    info.patientId = userID;
    info.lastEdited = faker.date.past();
    info.lastEditedBy = faker.name.firstName();
    return info;
};

const generateMedicalInfo = (status) => {
    const info = {};
    info._id = mongoose.Types.ObjectId();
    info.status = status;

    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.address = faker.address.streetAddress();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.homePhone = faker.phone.phoneNumber();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.cellPhone = faker.phone.phoneNumber();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.age = getRandomInt(70) + 1;
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.nationalID = faker.random.alphaNumeric();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.householdSize = getRandomInt(10) + 1;

    const selectedGender = getRandomInt(3);
    const genders = [
        '607080f7da92745444f64c10',
        '607080f7da92745444f64c12',
        '607080f7da92745444f64c14',
    ];
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.gender = genders[selectedGender];

    return info;
};

const generateSurveyInfo = (status) => {
    const info = {};
    info._id = mongoose.Types.ObjectId();
    info.status = status;
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.numWorkingPeople = getRandomInt(6);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.numberCars = getRandomInt(3);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.numberRetiredPeople = getRandomInt(6);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.numMilitaryPolice = getRandomInt(4);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.numDisabledPeople = getRandomInt(5);

    const incomes = [
        '6070816ada92745444f64c52',
        '6070816ada92745444f64c54',
        '6070816ada92745444f64c56',
        '6070816ada92745444f64c58',
        '6070816ada92745444f64c5a',
        '6070816ada92745444f64c5c',
    ];
    const selectedIncome = getRandomInt(incomes.length);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.incomeRange = incomes[selectedIncome];

    const insurances = [
        '6070816ada92745444f64c61',
        '6070816ada92745444f64c63',
        '6070816ada92745444f64c65',
    ];
    const selectedInsurance = getRandomInt(insurances.length);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.typeOfInsurance = insurances[selectedInsurance];

    return info;
};

const generateExampleInfo = (status) => {
    const info = {};
    info._id = mongoose.Types.ObjectId();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.status = status;
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.string = faker.random.alphaNumeric();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.multilineString = { data: faker.lorem.paragraphs() };
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.number = getRandomInt(100);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.date = faker.date.past();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.phone = faker.phone.phoneNumber();
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.file = generateFiles(getRandomInt(5));
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.audio = generateFiles(getRandomInt(5));

    const options = ['607086644e7ccf3c7cea23da', '607086644e7ccf3c7cea23dc'];
    const selectedOption = getRandomInt(options.length);
    if (status == STEP_STATUS_ENUM.FINISHED || getRandomInt(2))
        info.radioButton = options[selectedOption];

    return info;
};

const generateFiles = (numFiles) => {
    files = [];
    for (let i = 0; i < numFiles; i++) files.push(generateFile());
    return files;
};

const generateFile = () => {
    return {
        filename: faker.system.fileName(),
        uploadedBy: faker.name.firstName(),
        uploadDate: faker.date.past(),
    };
};

const generateRoles = (numRoles) => {
    roles = [];

    for (let i = 0; i < numRoles; i++) roles.push(generateRole());

    return roles;
};

const generateRole = () => {
    const role = {};

    if (getRandomInt(2)) {
        role.roleDescription = {
            EN: faker.lorem.sentences(),
            AR: faker.lorem.sentences(),
        };
    }

    role.roleName = {
        EN: faker.lorem.word(),
        AR: faker.lorem.word(),
    };

    role.isMutable = getRandomInt(2);
    roles.isHidden = getRandomInt(2);

    role._id = mongoose.Types.ObjectId();
    return role;
};

generateData();
