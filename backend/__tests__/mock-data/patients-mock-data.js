const {
    PATIENT_STATUS_ENUM,
    STEP_STATUS_ENUM,
} = require('../../utils/constants');
const mongoose = require('mongoose');

module.exports.POST_PATIENT = {
    firstName: 'Matthew',
    fathersName: 'Dan',
    grandfathersName: 'Gene',
    familyName: 'Walowski',
    orderId: '1234',
    status: PATIENT_STATUS_ENUM.FEEDBACK,
};

module.exports.POST_PATIENT_MINIMAL_REQUEST = {
    firstName: 'first',
    familyName: 'family',
};

module.exports.POST_IMMUTABLE_PATIENT_DATA = {
    _id: mongoose.Types.ObjectId(),
    lastEdited: new Date('2000-12-02T01:17:55.181Z'),
    lastEditedBy: 'Tickle Me Elmo',
    __v: 1,
};

module.exports.DEFAULT_PATIENT_DATA = {
    fathersName: '',
    grandfathersName: '',
    orderId: '',
    status: PATIENT_STATUS_ENUM.ACTIVE,
};

module.exports.POST_FINISHED_STEP_DATA = {
    status: STEP_STATUS_ENUM.FINISHED,
    string: 'helloo',
    multilineString: 'Test looooooooong string',
    number: 932,
    date: new Date().toISOString(),
    radioButton: '60944e084a4a0d4330cc258d',
    phone: '123-456-7891',
    file: [
        {
            filename: 'ears.stp',
            uploadedBy: 'Jason',
            uploadDate: '2020-10-12T18:20:15.625Z',
        },
    ],
    audio: [
        {
            filename: 'interview.mp3',
            uploadedBy: 'Jason',
            uploadDate: '2020-10-12T18:20:15.625Z',
        },
        {
            filename: 'interview2.mp4',
            uploadedBy: 'Brian',
            uploadDate: '2020-10-14T18:20:15.625Z',
        },
    ],
};

module.exports.DEFAULT_STEP_DATA = {
    status: STEP_STATUS_ENUM.UNFINISHED,
    string: '',
    multilineString: '',
    number: 0,
    date: new Date(),
    radioButton: '',
    phone: '',
    file: [],
    audio: [],
};

module.exports.POST_IMMUTABLE_STEP_DATA = {
    _id: mongoose.Types.ObjectId(),
    patientId: mongoose.Types.ObjectId(),
    lastEdited: new Date('2000-12-02T01:17:55.181Z'),
    lastEditedBy: 'Tickle Me Elmo',
    __v: 1,
};

// Note: `grandfathersName` and `orderId` are defaults in the schema
module.exports.GET_PATIENT_WITHOUT_STEP_DATA = {
    fathersName: 'Edgar',
    grandfathersName: '',
    dateCreated: '2020-12-15T09:48:57.205Z',
    orderId: '',
    lastEdited: '2020-12-18T00:55:01.752Z',
    status: 'Archived',
    _id: '60944e084f4c0d4330cc25ec',
    firstName: 'Ezekiel',
    familyName: 'Gutkowski',
    lastEditedBy: 'TatumHeidenreich',
    medicalInfo: null,
    survey: null,
    example: null,
};

module.exports.GET_PATIENT_WITH_SOME_STEP_DATA = {
    firstName: 'Natalia',
    _id: '60944e084f4c0d4330cc25ee',
    fathersName: 'Aurelio',
    grandfathersName: 'Marlin',
    familyName: 'Oberbrunner',
    dateCreated: '2020-09-05T11:28:44.920Z',
    lastEdited: '2020-10-21T10:45:29.001Z',
    lastEditedBy: 'KatarinaSchneider',
    orderId: '',
    status: 'Active',
    example: null,
    medicalInfo: null,
    survey: {
        _id: '60944e084f4c0d4330cc2654',
        status: 'Finished',
        numWorkingPeople: 4,
        numberCars: 1,
        numberRetiredPeople: 0,
        numMilitaryPolice: 0,
        numDisabledPeople: 3,
        incomeRange: '6070816ada92745444f64c52',
        typeOfInsurance: '6070816ada92745444f64c63',
        patientId: '60944e084f4c0d4330cc25ee',
        lastEdited: '2020-09-12T08:29:22.759Z',
        lastEditedBy: 'Leonel',
    },
};

module.exports.GET_PATIENT_WITH_ALL_STEP_DATA = {
    fathersName: '',
    dateCreated: '2020-12-02T01:17:55.181Z',
    orderId: 't',
    lastEdited: '2020-07-12T22:25:28.949Z',
    status: 'Active',
    _id: '60944e084f4c0d4330cc258b',
    firstName: 'Delores',
    grandfathersName: 'Vincent',
    familyName: 'Bernier',
    lastEditedBy: 'KaceyEbert',
    medicalInfo: {
        _id: '60944e084f4c0d4330cc2537',
        status: 'Finished',
        address: '67031 Serenity Dam',
        homePhone: '(875) 224-6981 x046',
        cellPhone: '1-678-770-8617',
        age: 39,
        nationalID: 'v',
        householdSize: 1,
        gender: '607080f7da92745444f64c10',
        patientId: '60944e084f4c0d4330cc258b',
        lastEdited: '2020-11-08T11:26:03.262Z',
        lastEditedBy: 'Michelle',
    },
    survey: {
        _id: '60944e084f4c0d4330cc2723',
        status: 'Partial',
        numWorkingPeople: 2,
        numMilitaryPolice: 3,
        numDisabledPeople: 0,
        incomeRange: '',
        numberCars: 0,
        numberRetiredPeople: 0,
        typeOfInsurance: '6070816ada92745444f64c63',
        patientId: '60944e084f4c0d4330cc258b',
        lastEdited: '2020-07-27T06:48:04.536Z',
        lastEditedBy: 'Wilber',
    },
    example: {
        _id: '60944e084f4c0d4330cc25fe',
        audio: [],
        multilineString:
            'Quo enim optio voluptatem quibusdam voluptatem non adipisci nihil. Voluptatum maxime consequatur porro et. Modi et debitis aspernatur eius aut laboriosam amet amet harum. Qui eum autem assumenda fugit dignissimos est. Eveniet consequuntur sed sapiente aut autem.\n' +
            ' \rDebitis commodi veritatis fuga animi vel. Corporis minus cupiditate occaecati natus eum dolores non error. Quam reprehenderit iusto officia unde perferendis est. Perferendis ut non eius.\n' +
            ' \rAliquam qui voluptates doloribus beatae sit. Nihil veritatis ut facere possimus magni excepturi harum. Optio sint et sed dolorem quisquam maiores ullam. Nisi voluptas ut possimus. Ut rerum cumque aut dolores nam qui dolorem eligendi reiciendis. Veritatis quo repudiandae rerum ipsam doloremque recusandae molestiae dolorum fugiat.',
        number: 36,
        date: '2020-10-09T13:06:34.732Z',
        file: [
            {
                _id: '60bb01b66ec8910a0c943c4e',
                filename: 'utilisation_modular.ssf',
                uploadDate: '2020-08-05T03:32:21.664Z',
                uploadedBy: 'Robb',
            },
        ],
        phone: '',
        status: 'Unfinished',
        string: '',
        radioButton: '607086644e7ccf3c7cea23dc',
        patientId: '60944e084f4c0d4330cc258b',
        lastEdited: '2020-11-02T16:13:05.393Z',
        lastEditedBy: 'Berenice',
    },
};

module.exports.PUT_BAD_PATIENT_DATA = {
    firstName: 'Mathias',
    fathersName: 'Daniel',
    grandfathersName: 'Gene',
    familyName: 'Wang',
    orderId: '123456',
    status: PATIENT_STATUS_ENUM.FEEDBACK,
    dateCreated: Date.now(),
    _id: '0944e084f4c0d4330cc258b',
    __v: 32,
};

module.exports.PUT_PATIENT_DATA = {
    firstName: 'Mathias',
    fathersName: 'Daniel',
    grandfathersName: 'Gene',
    familyName: 'Wang',
    orderId: '123456',
    status: PATIENT_STATUS_ENUM.FEEDBACK,
};

module.exports.EXPECTED_PUT_DATA = {
    fathersName: 'Daniel',
    grandfathersName: 'Gene',
    orderId: '123456',
    status: 'Feedback',
    _id: '60944e084f4c0d4330cc258b',
    firstName: 'Mathias',
    familyName: 'Wang',
    dateCreated: '2020-12-02T01:17:55.181Z',
    lastEdited: '2020-07-12T22:25:28.949Z',
    lastEditedBy: 'Matthew Walowski',
};

module.exports.EXPECTED_GET_RESTRICTED_DATA = {
    displayName: {
        EN: 'Example',
        AR: 'استطلاع',
    },
    readableGroups: ['606e0a4602b23d02bc77673a', '606e0a4602b23d02bc77673d'],
    writableGroups: ['606e0a4602b23d02bc77673c'],
    defaultToListView: true,
    _id: '6092c289e0912601bbc5d85e',
    key: 'example',
    stepNumber: 2,
    fields: [
        {
            displayName: {
                EN: 'String Field',
                AR: 'عدد العاملين في الأسرة',
            },
            fieldType: 'String',
            readableGroups: ['606e0a4602b23d02bc77673d'],
            writableGroups: [],
            _id: '607086644e7ccf3c7cea23d8',
            key: 'string',
            fieldNumber: 0,
            isVisibleOnDashboard: true,
            options: [],
            subFields: [],
            isDeleted: false,
            isHidden: false,
        },
    ],
};

module.exports.EXPECTED_FILE_DATA =
    'Test data. No newlines here, Windows be dumm like that.';
