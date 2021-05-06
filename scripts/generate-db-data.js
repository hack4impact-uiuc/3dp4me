const faker = require('faker');
const fs = require('fs');
const { overallStatusEnum, stepStatusEnum } = require('../backend/models');
const mongoose = require('mongoose');

const generateData = () => {
    const patients = generatePatients(100);
    fs.writeFileSync(
        'scripts/data/patients.json',
        JSON.stringify(patients, null, 2),
    );

    const roles = generateRoles(15);
    fs.writeFileSync('scripts/data/roles.json', JSON.stringify(roles, null, 2));

    createSteps(patients);
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

    if (getRandomInt(2)) patient.grandFathersName = faker.name.firstName();

    if (getRandomInt(2)) patient.orderId = faker.random.alphaNumeric();

    patient.familyName = faker.name.lastName();
    patient.dateCreated = faker.date.past();
    patient.lastEdited = faker.date.past();
    patient.lastEditedBy = faker.name.firstName() + faker.name.lastName();

    const status = getRandomInt(3);
    if (status == 0) patient.status = overallStatusEnum.ACTIVE;
    else if (status == 1) patient.status = overallStatusEnum.ARCHIVED;
    else patient.status = overallStatusEnum.FEEDBACK;

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
};

const appendGlobalStepData = (generateInfo, userID) => {
    let info = null;
    const status = getRandomInt(3);
    if (status == 0) info = generateInfo(stepStatusEnum.FINISHED);
    else if (status == 1) info = generateInfo(stepStatusEnum.PARTIAL);
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

    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.address = faker.address.streetAddress();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.homePhone = faker.phone.phoneNumber();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.cellPhone = faker.phone.phoneNumber();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.age = getRandomInt(70) + 1;
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.nationalID = faker.random.alphaNumeric();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.householdSize = getRandomInt(10) + 1;

    const selectedGender = getRandomInt(3);
    const genders = [
        '607080f7da92745444f64c10',
        '607080f7da92745444f64c12',
        '607080f7da92745444f64c14',
    ];
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.gender = genders[selectedGender];

    return info;
};

const generateSurveyInfo = (status) => {
    const info = {};
    info._id = mongoose.Types.ObjectId();
    info.status = status;
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.numWorkingPeople = getRandomInt(6);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.numberCars = getRandomInt(3);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.numberRetiredPeople = getRandomInt(6);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.numMilitaryPolice = getRandomInt(4);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
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
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.incomeRange = incomes[selectedIncome];

    const insurances = [
        '6070816ada92745444f64c61',
        '6070816ada92745444f64c63',
        '6070816ada92745444f64c65',
    ];
    const selectedInsurance = getRandomInt(insurances.length);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.typeOfInsurance = insurances[selectedInsurance];

    return info;
};

const generateExampleInfo = (status) => {
    const info = {};
    info._id = mongoose.Types.ObjectId();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.status = status;
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.string = faker.random.alphaNumeric();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.multilineString = faker.lorem.paragraphs();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.number = getRandomInt(100);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.date = faker.date.past();
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.phone = faker.phone.phoneNumber();

    if (status == stepStatusEnum.FINISHED || getRandomInt(2)) {
        const numFiles = getRandomInt(5);
        info.file = [];
        for (let i = 0; i < numFiles; i++)
            info.file.push(faker.system.fileName);
    }

    if (status == stepStatusEnum.FINISHED || getRandomInt(2)) {
        const numAudioFiles = getRandomInt(5);
        info.audio = [];
        for (let i = 0; i < numAudioFiles; i++)
            info.audio.push(faker.system.fileName);
    }

    const options = ['607086644e7ccf3c7cea23da', '607086644e7ccf3c7cea23dc'];
    const selectedOption = getRandomInt(options.length);
    if (status == stepStatusEnum.FINISHED || getRandomInt(2))
        info.radioButton = options[selectedOption];

    return info;
};

const generateRoles = (numRoles) => {
    roles = [];

    for (let i = 0; i < numRoles; i++) roles.push(generateRole());

    return roles;
};

const generateRole = () => {
    const role = {};

    if (getRandomInt(2)) role.roleDescription = faker.lorem.sentences();

    role.roleName = faker.lorem.word();
    role.isMutable = getRandomInt(2);
    role._id = mongoose.Types.ObjectId();
    return role;
};

generateData();
