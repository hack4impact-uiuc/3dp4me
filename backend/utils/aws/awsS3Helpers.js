const AWS = require('aws-sdk');

const { S3_BUCKET_NAME, S3_REGION } = require('./awsExports');

/**
 * Uploads a file to the S3 bucket
 * @param content File contents in a binary string
 * @param remoteFileName The full directory of the s3 remote path to upload to
 * @param credentials The temporary credentials of the end user. Frontend should provide this.
 * @param onUploaded Callback after finished uploading. Params are (err, data).
 */
const uploadFile = async (content, remoteFileName, credentials) => {
    const params = {
        Body: content,
        Bucket: S3_BUCKET_NAME,
        Key: remoteFileName,
    };

    const s3 = getS3(credentials);
    await s3.putObject(params).promise();
};

/**
 * Downloads file from the S3 bucket
 * @param objectKey The key as defined in S3 console. Usually is just the full path of the file.
 * @param credentials The temporary credentials of the end user. Frontend should provide this.
 * @param onDownloaded Callback after finished downloading. Params are (err, data).
 */
const downloadFile = (objectKey, credentials) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: objectKey,
    };

    const s3 = getS3(credentials);
    const object = s3.getObject(params);

    return object;
};

function getS3(credentials) {
    const s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: S3_REGION,
    });

    return s3;
}

exports.uploadFile = uploadFile;
exports.downloadFile = downloadFile;
