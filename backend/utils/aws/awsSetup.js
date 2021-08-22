const AWS = require('aws-sdk');
const AWS_VARS = require('./awsExports');

AWS.config.update({ region: AWS_VARS.S3_REGION });
