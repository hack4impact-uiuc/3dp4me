const { stepStatusEnum, overallStatusEnum } = require('../../models');
const mongoose = require('mongoose');

module.exports.POST_PATIENT = {
    firstName: 'Matthew',
    fathersName: 'Dan',
    grandfathersName: 'Gene',
    familyName: 'Walowski',
    orderId: '1234',
    status: overallStatusEnum.FEEDBACK,
};

module.exports.POST_PATIENT_MINIMAL_REQUEST = {
    firstName: 'first',
    familyName: 'family',
};

module.exports.DEFAULT_PATIENT_DATA = {
    fathersName: '',
    grandfathersName: '',
    orderId: '',
    status: overallStatusEnum.ACTIVE,
};

module.exports.POST_FINISHED_STEP_DATA = {
    status: stepStatusEnum.FINISHED,
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
    status: stepStatusEnum.UNFINISHED,
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
};
