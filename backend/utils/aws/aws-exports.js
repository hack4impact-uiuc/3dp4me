const { 
    CognitoIdentityClient
 } = require("@aws-sdk/client-cognito-identity");

const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");

const { 
    S3Client, ListObjectsCommand
 } = require("@aws-sdk/client-s3");

// Set the AWS Region
const REGION = "us-east-2";

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId: "us-east-2:eebab691-ab2b-4225-bd67-9f5e79fa61ee",
  }),
});

const bucketName = "3dp4me-dev";
