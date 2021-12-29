const AWS = require('aws-sdk');

const {
    S3_BUCKET_NAME, S3_REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY,
} = require('./awsExports');

// S3 Credential Object created with access id and secret key
const S3_CREDENTIALS = {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
};

/**
 * Uploads a file to the S3 bucket
 * @param content File contents in a binary string
 * @param remoteFileName The full directory of the s3 remote path to upload to
 * @param credentials The temporary credentials of the end user. Frontend should provide this.
 * @param onUploaded Callback after finished uploading. Params are (err, data).
 */
const uploadFile = async (content, remoteFileName) => {
    const params = {
        Body: content,
        Bucket: S3_BUCKET_NAME,
        Key: remoteFileName,
    };

    const s3 = getS3(S3_CREDENTIALS);
    await s3.putObject(params).promise();
};

/**
 * Downloads file from the S3 bucket
 * @param objectKey The key as defined in S3 console. Usually is just the full path of the file.
 * @param credentials The temporary credentials of the end user. Frontend should provide this.
 * @param onDownloaded Callback after finished downloading. Params are (err, data).
 */
const downloadFile = (objectKey) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: objectKey,
    };

    const s3 = getS3(S3_CREDENTIALS);
    const object = s3.getObject(params);

    return object;
};

const deleteFile = async (filePath) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: filePath,
    };

    const s3 = getS3(S3_CREDENTIALS);
    await s3.deleteObject(params).promise();
};

/**
 * Delete's all of the files in a folder
 * @param {String} folderName The id of the patient
 * Source: https://stackoverflow.com/questions/20207063/how-can-i-delete-folder-on-s3-with-node-js
 */
const deleteFolder = async (folderName) => {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Prefix: `${folderName}/`,
    };

    const s3 = getS3(S3_CREDENTIALS);

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
    if (listedObjects.IsTruncated) await deleteFolder(folderName, S3_CREDENTIALS);
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
exports.deleteFile = deleteFile;
