console.log(process.env);

exports.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
exports.S3_REGION = process.env.S3_REGION;
exports.COGNITO_REGION = process.env.COGNITO_REGION;
exports.USER_POOL_ID = process.env.USER_POOL_ID;
exports.ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
exports.SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
exports.SECURITY_ROLE_ATTRIBUTE_NAME = 'custom:security_roles';
exports.SECURITY_ACCESS_ATTRIBUTE_NAME = 'custom:access';
exports.SECURITY_ROLE_ATTRIBUTE_MAX_LEN = 1024;
