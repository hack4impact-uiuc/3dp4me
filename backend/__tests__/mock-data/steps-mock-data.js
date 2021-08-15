const { FIELDS } = require('../../utils/constants');

module.exports.PUT_STEP_REORDERED_FIELDS = [
    {
        key: 'survey',
        stepNumber: 1,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: '1',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: '2',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: '3',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: '4',
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: '5',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: '6',
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: '7',
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.POST_STEP_WITHOUT_OPTIONS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 5,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'Divider',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
        {
            key: 'gender',
            fieldType: 'RadioButton',
            fieldNumber: 5,
            isVisibleOnDashboard: false,
            displayName: {
                EN: 'Gender',
                AR: 'جنس تذكير أو تأنيث',
            },
        },
    ],
};

module.exports.POST_STEP_WITH_EMPTY_OPTIONS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 5,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'Divider',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
        {
            key: 'gender',
            fieldType: 'RadioButton',
            fieldNumber: 5,
            isVisibleOnDashboard: false,
            displayName: {
                EN: 'Gender',
                AR: 'جنس تذكير أو تأنيث',
            },
            options: [],
        },
    ],
};

module.exports.POST_STEP_WITH_OPTIONS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    readableGroups: [],
    defaultToListView: true,
    writableGroups: [],
    stepNumber: 5,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'Divider',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            options: [],
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: [],
            readableGroups: [],
            writableGroups: [],
        },
        {
            key: 'gender',
            fieldType: 'RadioButton',
            fieldNumber: 5,
            isVisibleOnDashboard: false,
            displayName: {
                EN: 'Gender',
                AR: 'جنس تذكير أو تأنيث',
            },
            subFields: [],
            readableGroups: [],
            writableGroups: [],
            options: [
                {
                    Index: 0,
                    IsHidden: false,
                    Question: {
                        EN: 'Male',
                        AR: 'ذكر',
                    },
                },
                {
                    Index: 1,
                    IsHidden: false,
                    Question: {
                        EN: 'Female',
                        AR: 'أنثى',
                    },
                },
            ],
        },
        {
            key: 'appointments',
            fieldType: 'FieldGroup',
            displayName: {
                EN: 'Appointments',
                AR: 'تبوك ',
            },
            readableGroups: [],
            writableGroups: [],
            options: [],
            fieldNumber: 6,
            isVisibleOnDashboard: false,
            subFields: [
                {
                    key: 'apptDate',
                    fieldType: 'Date',
                    displayName: {
                        EN: 'Appointment Date',
                        AR: 'تبوك ',
                    },
                    subFields: [],
                    readableGroups: [],
                    writableGroups: [],
                    options: [],
                    isVisibleOnDashboard: false,
                    fieldNumber: 0,
                },
                {
                    key: 'apptClinic',
                    fieldType: 'String',
                    displayName: {
                        EN: 'Clinic',
                        AR: 'تبوك ',
                    },
                    subFields: [],
                    readableGroups: [],
                    writableGroups: [],
                    options: [],
                    isVisibleOnDashboard: false,
                    fieldNumber: 1,
                },
            ],
        },
    ],
};

module.exports.PUT_STEP_REORDERED_FIELDS_EXPECTED = [
    {
        _id: '6092c26fe0912601bbc5d85d',
        readableGroups: [],
        writableGroups: [],
        defaultToListView: true,
        key: 'survey',
        displayName: {
            EN: 'Survey',
            AR: 'استطلاع',
        },
        stepNumber: 1,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                subFields: [],
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                subFields: [],
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: 3,
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: 4,
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: 5,
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
        __v: 1,
    },
];

module.exports.PUT_STEP_SUBFIELD_MISSING_FIELDS = [
    {
        key: 'survey',
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'FieldGroup',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'newField',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [
                    {
                        fieldType: 'Number',
                    },
                ],
            },
        ],
    },
];
module.exports.PUT_STEP_EDIT_FIELDTYPE = [
    {
        key: 'survey',
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.PUT_STEP_ADDED_FIELD = [
    {
        key: 'survey',
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c69',
                key: 'testField',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.PUT_STEP_EDITED_FIELDS = [
    {
        key: 'survey',
        _id: '6092c26fe0912601bbc5d85d',
        readableGroups: [],
        writableGroups: [],
        defaultToListView: true,
        key: 'survey',
        displayName: {
            EN: 'Survey',
            AR: 'استطلاع',
        },
        stepNumber: 1,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Changed nested Parameters',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                subFields: [],
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: 3,
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: 4,
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: 5,
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                subFields: [],
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
        __v: 1,
    },
];

module.exports.PUT_STEP_DELETED_FIELD = [
    {
        key: 'survey',
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: '0',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: '1',
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: '2',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: '3',
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: '4',
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: '5',
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.PUT_STEP_DUPLICATE_FIELD = [
    {
        key: 'survey',
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.PUT_DUPLICATE_STEPS = [
    {
        key: 'survey',
        stepNumber: 0,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: '3',
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: '4',
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: '5',
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: '0',
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: '1',
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: '2',
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
            },
        ],
    },
];

module.exports.PUT_STEP_ADDED_FIELD_EXPECTED = [
    {
        _id: '6092c26fe0912601bbc5d85d',
        readableGroups: [],
        writableGroups: [],
        key: 'survey',
        defaultToListView: true,
        displayName: {
            EN: 'Survey',
            AR: 'استطلاع',
        },
        stepNumber: 1,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c50',
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c51',
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                subFields: [],
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c52',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c53',
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c54',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c55',
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c56',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c57',
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c58',
                        Index: 3,
                        Question: {
                            _id: '6070816ada92745444f64c59',
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5a',
                        Index: 4,
                        Question: {
                            _id: '6070816ada92745444f64c5b',
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c5c',
                        Index: 5,
                        Question: {
                            _id: '6070816ada92745444f64c5d',
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5e',
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c5f',
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c60',
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                subFields: [],
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c61',
                        Index: 0,
                        Question: {
                            _id: '6070816ada92745444f64c62',
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c63',
                        Index: 1,
                        Question: {
                            _id: '6070816ada92745444f64c64',
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        _id: '6070816ada92745444f64c65',
                        Index: 2,
                        Question: {
                            _id: '6070816ada92745444f64c66',
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c67',
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c68',
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                _id: '6070816ada92745444f64c69',
                key: 'testField',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
        __v: 1,
    },
];

module.exports.PUT_STEPS_SWAPPED_STEPNUMBER = [
    {
        defaultToListView: true,
        readableGroups: [],
        writableGroups: [],
        key: 'example',
        displayName: {
            EN: 'Example',
            AR: 'استطلاع',
        },
        stepNumber: 0,
        fields: [
            {
                fieldType: 'String',
                readableGroups: [],
                writableGroups: [],
                key: 'string',
                displayName: {
                    EN: 'String Field',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: true,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                key: 'radioButton',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Radio Button',
                    AR: 'نطاق دخل الأسرة',
                },
                subFields: [],
                options: [
                    {
                        IsHidden: false,
                        Index: 0,
                        Question: {
                            EN: 'Option 1',
                            AR: ' دين دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 1,
                        Question: {
                            EN: 'Option 2',
                            AR: 'دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'MultilineString',
                readableGroups: [],
                writableGroups: [],
                subFields: [],
                key: 'multilineString',
                displayName: {
                    EN: 'Text Area',
                    AR: 'عدد المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
            },
            {
                fieldType: 'File',
                readableGroups: [],
                writableGroups: [],
                key: 'file',
                displayName: {
                    EN: 'File Upload',
                    AR: 'عدد أفر المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                subFields: [],
                options: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'number',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Number Field',
                    AR: 'نوع التأمين',
                },
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Date',
                readableGroups: [],
                writableGroups: [],
                key: 'date',
                displayName: {
                    EN: 'Date Field',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Phone',
                readableGroups: [],
                writableGroups: [],
                key: 'phone',
                displayName: {
                    EN: 'Phone Field',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Divider',
                readableGroups: [],
                writableGroups: [],
                key: 'divider',
                displayName: {
                    EN: 'Divider',
                    AR: 'عد بالمنزل',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Audio',
                readableGroups: [],
                writableGroups: [],
                key: 'audio',
                displayName: {
                    EN: 'Audio Recording',
                    AR: 'عد بالمنزل',
                },
                fieldNumber: 8,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
    },
    {
        defaultToListView: true,
        readableGroups: [],
        writableGroups: [],
        key: 'medicalInfo',
        displayName: {
            EN: 'Medical Information',
            AR: 'المعلومات الطبية',
        },
        stepNumber: 1,
        fields: [
            {
                fieldType: 'Divider',
                readableGroups: [],
                writableGroups: [],
                key: 'demographicDivider',
                displayName: {
                    EN: 'Demographic Info',
                    AR: 'المعلومات الديموغرافية',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'String',
                readableGroups: [],
                writableGroups: [],
                key: 'address',
                displayName: {
                    EN: 'Address',
                    AR: 'تبوك ',
                },
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                subFields: [],
                fieldType: 'Phone',
                readableGroups: [],
                writableGroups: [],
                key: 'homePhone',
                displayName: {
                    EN: 'Home Phone',
                    AR: 'هاتف المنزل',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Phone',
                readableGroups: [],
                writableGroups: [],
                key: 'cellPhone',
                displayName: {
                    EN: 'Cellular Phone',
                    AR: 'هاتف خلوي',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'age',
                displayName: {
                    EN: 'Age',
                    AR: 'عمر',
                },
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                key: 'gender',
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Gender',
                    AR: 'جنس تذكير أو تأنيث',
                },
                subFields: [],
                options: [
                    {
                        IsHidden: false,
                        Index: 0,
                        Question: {
                            EN: 'Male',
                            AR: 'ذكر',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 1,
                        Question: {
                            EN: 'Female',
                            AR: 'أنثى',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 2,
                        Question: {
                            EN: 'Other',
                            AR: 'آخر',
                        },
                    },
                ],
            },
            {
                fieldType: 'String',
                readableGroups: [],
                writableGroups: [],
                key: 'nationalID',
                displayName: {
                    EN: 'National ID',
                    AR: 'الهوية الوطنية',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'householdSize',
                displayName: {
                    EN: 'Total Number of People in Household',
                    AR: 'إجمالي عدد أفراد الأسرة',
                },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
    },
    {
        defaultToListView: true,
        readableGroups: [],
        writableGroups: [],
        key: 'survey',
        displayName: {
            EN: 'Survey',
            AR: 'استطلاع',
        },
        stepNumber: 2,
        fields: [
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numWorkingPeople',
                displayName: {
                    EN: 'Number of Working People in Household',
                    AR: 'عدد العاملين في الأسرة',
                },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                key: 'incomeRange',
                fieldNumber: 1,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Household Income Range',
                    AR: 'نطاق دخل الأسرة',
                },
                subFields: [],
                options: [
                    {
                        IsHidden: false,
                        Index: 0,
                        Question: {
                            EN: '0 JOD - 4999 JOD',
                            AR: '0 دينار - 4999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 1,
                        Question: {
                            EN: '5000 JOD - 9999 JOD',
                            AR: '5000 دينار - 9999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 2,
                        Question: {
                            EN: '10000 JOD - 14999 JOD',
                            AR: '10000 دينار - 14999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 3,
                        Question: {
                            EN: '15000 JOD - 19999 JOD',
                            AR: '15000 دينار - 19999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 4,
                        Question: {
                            EN: '20000 JOD - 29999 JOD',
                            AR: '20000 دينار - 29999 دينار',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 5,
                        Question: {
                            EN: '30000+ JOD',
                            AR: '30000+ دينار',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numberCars',
                displayName: {
                    EN: 'Number of Cars in Household',
                    AR: 'عدد السيارات المنزلية',
                },
                fieldNumber: 2,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numberRetiredPeople',
                displayName: {
                    EN: 'Number of Retired Household Members',
                    AR: 'عدد أفراد الأسرة المتقاعدين',
                },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'RadioButton',
                readableGroups: [],
                writableGroups: [],
                subFields: [],
                key: 'typeOfInsurance',
                fieldNumber: 4,
                isVisibleOnDashboard: false,
                displayName: {
                    EN: 'Type of Insurance',
                    AR: 'نوع التأمين',
                },
                options: [
                    {
                        IsHidden: false,
                        Index: 0,
                        Question: {
                            EN: 'Private',
                            AR: 'خاص',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 1,
                        Question: {
                            EN: 'Government',
                            AR: 'حكومة',
                        },
                    },
                    {
                        IsHidden: false,
                        Index: 2,
                        Question: {
                            EN: 'None',
                            AR: 'لا أحد',
                        },
                    },
                ],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numMilitaryPolice',
                displayName: {
                    EN: 'Number of Military or Police in Household',
                    AR: 'عدد أفراد الجيش أو الشرطة في الأسرة',
                },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
            {
                fieldType: 'Number',
                readableGroups: [],
                writableGroups: [],
                key: 'numDisabledPeople',
                displayName: {
                    EN: 'Number of Disabled People in House',
                    AR: 'عدد المعوقين بالمنزل',
                },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
                options: [],
                subFields: [],
            },
        ],
    },
];

module.exports.POST_STEP_WITH_BAD_FIELD = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 5,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'badFieldType',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
    ],
};

module.exports.POST_STEP_WITH_DUPLICATE_KEY = {
    key: 'example',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 5,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'Divider',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
    ],
};

module.exports.POST_STEP_WITH_DUPLICATE_STEP_NUMBER = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 0,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: 'Divider',
            displayName: {
                EN: 'Demographic Info',
                AR: 'المعلومات الديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
    ],
};

module.exports.GET_FIELD_BY_KEY_EXPECTED = {
    displayName: {
        EN: 'Number of Working People in Household',
        AR: 'عدد العاملين في الأسرة',
    },
    fieldType: 'Number',
    readableGroups: [],
    writableGroups: [],
    key: 'numWorkingPeople',
    fieldNumber: 0,
    isVisibleOnDashboard: false,
    options: [],
    subFields: [],
};

module.exports.POST_STEP_WITH_FIELD_GROUP_WITHOUT_SUB_FIELDS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
        },
    ],
};

module.exports.POST_STEP_WITH_FIELD_GROUP_WITH_EMPTY_SUB_FIELDS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: [],
        },
    ],
};

module.exports.POST_SUB_FIELD_WITHOUT_OPTIONS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: this.POST_STEP_WITHOUT_OPTIONS.fields,
        },
    ],
};

module.exports.POST_SUB_FIELD_WITH_EMPTY_OPTIONS = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: this.POST_STEP_WITH_EMPTY_OPTIONS.fields,
        },
    ],
};

module.exports.POST_STEP_WITH_BAD_SUB_FIELD = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: this.POST_STEP_WITH_BAD_FIELD.fields,
        },
    ],
};

module.exports.POST_STEP_WITH_DUPLICATE_SUB_FIELDKEY = {
    key: 'newStep',
    displayName: {
        EN: 'Medical Information',
        AR: 'المعلومات الطبية',
    },
    stepNumber: 10,
    fields: [
        {
            key: 'demographicDivider',
            fieldType: FIELDS.FIELD_GROUP,
            displayName: {
                EN: 'Field group',
                AR: 'االديموغرافية',
            },
            fieldNumber: 0,
            isVisibleOnDashboard: false,
            subFields: [
                {
                    key: 'demographicDivider',
                    fieldType: 'duplicate',
                    displayName: {
                        EN: 'Field group',
                        AR: 'االديموغرافية',
                    },
                    fieldNumber: 0,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'demographicDivider',
                    fieldType: 'duplicate',
                    displayName: {
                        EN: 'Field group',
                        AR: 'االديموغرافية',
                    },
                    fieldNumber: 1,
                    isVisibleOnDashboard: false,
                },
            ],
        },
    ],
};
