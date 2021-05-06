const { stepStatusEnum } = require('../../models');

module.exports.POST_FULL_STEP_DATA = {
    status: stepStatusEnum.FINISHED,
    string: 'helloo',
    multilineString: 'Test looooooooong string',
    number: 932,
    date: Date.now(),
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