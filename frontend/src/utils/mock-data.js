export const infoData = [
    {
        firstName: 'John',
        patientId: 1,
        lastName: 'Doe',
        notes: 'No notes',
        jordanSSN: 12345678,
        dob: new Date(),
        phone: '847 123-4567',
        status: 'unfinished',
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        patientId: 2,
        notes: 'None',
        jordanSSN: 910111213,
        dob: new Date(),
        phone: '847 123-0000',
        status: 'unfinished',
    },
];

export const cadData = [
    {
        firstName: 'John',
        fileSizeKb: 1024,
        leftEarscan: [
            {
                fileName: 'Earscan.STP',
                uploadedBy: 'CAD Person',
                uploadDate: new Date(),
            },
        ],
        status: 'unfinished',
    },
    {
        firstName: 'Jane',
        fileSizeKb: 2048,
        leftEarscan: [
            {
                fileName: 'Earscan2.STP',
                uploadedBy: 'CAD Person',
                uploadDate: new Date(),
            },
        ],
        status: 'unfinished',
    },
];

export const allStepMetadata = [
    {
        key: 'info',
        displayName: { EN: 'PatientInfo', AR: 'معلومات المريض' },
        stepNumber: 1,
        fields: [
            {
                key: 'patientDivider',
                fieldType: 'Divider',
                displayName: { EN: 'Patient', AR: 'لومات ا' },
                fieldNumber: 0,
                isVisibleOnDashboard: false,
            },
            {
                key: 'firstName',
                fieldType: 'String',
                displayName: { EN: 'First Name', AR: 'لومات ا' },
                fieldNumber: 1,
                isVisibleOnDashboard: true,
            },
            {
                key: 'notes',
                fieldType: 'MultilineString',
                displayName: { EN: 'Notes', AR: 'لومات ا' },
                fieldNumber: 11,
                isVisibleOnDashboard: false,
            },
            {
                key: 'lastName',
                fieldType: 'String',
                displayName: { EN: 'Last Name', AR: 'لومات ا' },
                fieldNumber: 2,
                isVisibleOnDashboard: true,
            },
            {
                key: 'jordanSSN',
                fieldType: 'String',
                displayName: { EN: 'Jordan SSN', AR: 'لومات ا' },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
            },
            {
                key: 'dob',
                fieldType: 'Date',
                displayName: { EN: 'DOB', AR: 'لومات ا' },
                fieldNumber: 4,
                isVisibleOnDashboard: false,
            },
            {
                key: 'phone',
                fieldType: 'Phone',
                displayName: { EN: 'Phone', AR: 'لومات ا' },
                fieldNumber: 5,
                isVisibleOnDashboard: false,
            },
            {
                key: 'emContact',
                fieldType: 'Header',
                displayName: { EN: 'Emergency Contact', AR: 'لومات ا' },
                fieldNumber: 6,
                isVisibleOnDashboard: false,
            },
            {
                key: 'emContactName',
                fieldType: 'String',
                displayName: { EN: 'Name', AR: 'لومات ا' },
                fieldNumber: 7,
                isVisibleOnDashboard: false,
            },
            {
                key: 'emRelationship',
                fieldType: 'String',
                displayName: { EN: 'Relationship', AR: 'لومات ا' },
                fieldNumber: 8,
                isVisibleOnDashboard: false,
            },
            {
                key: 'emPhone',
                fieldType: 'Phone',
                displayName: { EN: 'Phone', AR: 'لومات ا' },
                fieldNumber: 9,
                isVisibleOnDashboard: false,
            },
            {
                key: 'infoDivider',
                fieldType: 'Divider',
                displayName: { EN: 'Information', AR: 'لومات ا' },
                fieldNumber: 10,
                isVisibleOnDashboard: false,
            },
        ],
    },
    {
        key: 'cadModel',
        displayName: { EN: 'CAD Modeling', AR: 'معلومات المريض' },
        stepNumber: 2,
        fields: [
            {
                key: 'firstName',
                fieldType: 'String',
                displayName: { EN: 'First Name', AR: 'لومات ا' },
                fieldNumber: 1,
                isVisibleOnDashboard: true,
            },
            {
                key: 'fileSizeKb',
                fieldType: 'Number',
                displayName: { EN: 'File Size (Kb)', AR: 'لومات ا' },
                fieldNumber: 2,
                isVisibleOnDashboard: true,
            },
            {
                key: 'leftEarscan',
                fieldType: 'File',
                displayName: { EN: 'CAD File', AR: 'لومات ا' },
                fieldNumber: 3,
                isVisibleOnDashboard: false,
            },
        ],
    },
];
