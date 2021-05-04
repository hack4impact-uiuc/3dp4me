const faker = require('faker');
const fs = require('fs');
const { overallStatusEnum } = require('../backend/models');

const generateData = () => {
    const patients = generatePatients(100);
    fs.writeFileSync('patients.json', JSON.stringify(patients));

    const roles = generateRoles(15);
    fs.writeFileSync('roles.json', JSON.stringify(roles));
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
    return role;
};

generateData();
