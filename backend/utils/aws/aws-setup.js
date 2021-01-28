const AWS = require('aws-sdk');
const AWS_VARS = require("../aws/aws-exports");

AWS.config.update({region: AWS_VARS.S3_REGION});