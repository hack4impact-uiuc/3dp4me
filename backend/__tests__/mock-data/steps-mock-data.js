const { fieldEnum } = require('../../models/Metadata');

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
    stepNumber: '0',
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
            fieldType: fieldEnum.FIELD_GROUP,
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
            fieldType: fieldEnum.FIELD_GROUP,
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
            fieldType: fieldEnum.FIELD_GROUP,
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
            fieldType: fieldEnum.FIELD_GROUP,
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
            fieldType: fieldEnum.FIELD_GROUP,
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
            fieldType: fieldEnum.FIELD_GROUP,
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
