module.exports.POST_STEP_WITHOUT_OPTIONS = {
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
        {
            key: 'gender',
            fieldType: 'RadioButton',
            fieldNumber: 5,
            isVisibleOnDashboard: false,
            displayName: {
                EN: 'Gender',
                AR: 'جنس تذكير أو تأنيث',
            },
            options: [
                {
                    ID: '41315c06-81b3-46ef-862b-6ad69e5757fb',
                    Index: 0,
                    IsHidden: false,
                    Question: {
                        EN: 'Male',
                        AR: 'ذكر',
                    },
                },
                {
                    ID: '1644ef0d-0004-4c85-a9aa-b2ea6206df70',
                    Index: 1,
                    IsHidden: false,
                    Question: {
                        EN: 'Female',
                        AR: 'أنثى',
                    },
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
    stepNumber: 0,
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
