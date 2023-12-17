module.exports.MOCK_AUTH_TOKEN =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

module.exports.MOCK_USER = {
    Username: 'google_110732791859900199290',
    UserAttributes: [
        { Name: 'sub', Value: '054a80a4-04eb-4a93-9647-14f676f33949' },
        {
            Name: 'identities',
            Value: '[{"userId":"110732791859900199290","providerName":"Google","providerType":"Google","issuer":null,"primary":true,"dateCreated":1617302898061}]',
        },
        { Name: 'email_verified', Value: 'false' },
        { Name: 'custom:language', Value: 'EN' },
        { Name: 'name', Value: 'Matthew Walowski' },
        { Name: 'email', Value: 'mattwalowski@gmail.com' },
        {
            Name: 'picture',
            Value: 'https://lh3.googleusercontent.com/a/AATXAJyQEIaUPej-ijfcwWLwCP8CeA5r10tiL1RmPLlj=s96-c',
        },
    ],
};

module.exports.MOCK_ROLE_ID = '606e0a4602b23d02bc77673b';
