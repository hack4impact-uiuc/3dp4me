const AWS = require('aws-sdk');
const { parseNumber } = require('libphonenumber-js');

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

/**
 * Delete's all of the files in a folder
 * @param {String} folderName The id of the patient
 * @param {JSON}   credentials The credentials needed to access AWS S3
 * Source: https://stackoverflow.com/questions/20207063/how-can-i-delete-folder-on-s3-with-node-js
 */
const deleteFolder = async (folderName, credentials) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Prefix: `${folderName}/`,
    };

    const s3 = getS3(credentials);

    // Gets up to 1000 files that need to be deleted
    const listedObjects = await s3.listObjectsV2(params).promise();
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: S3_BUCKET_NAME,
        Delete: { Objects: [] },
    };

    // Builds a list of the files to delete
    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    // Deletes the files from S3
    await s3.deleteObjects(deleteParams).promise();

    // If there are more than 1000 objects that need to be deleted from the folder
    if (listedObjects.IsTruncated) await deleteFolder(folderName, credentials);
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
exports.deleteFolder = deleteFolder;
