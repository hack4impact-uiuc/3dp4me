import { S3 } from '@aws-sdk/client-s3';

import {
    ACCESS_KEY_ID,
    PATIENT_BUCKET,
    PUBLIC_BUCKET,
    SECRET_ACCESS_KEY,
} from './awsExports';
import { Readable } from 'stream';
import type { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { BucketConfig } from './awsExports';

// S3 Credential Object created with access id and secret key
const S3_CREDENTIALS = {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
};

/**
 * Uploads a file to the S3 bucket
 * @param content File contents in a binary string
 * @param remoteFileName The full directory of the s3 remote path to upload to
 */
export const uploadFile = async (content: StreamingBlobPayloadInputTypes, remoteFileName: string) => {
    return uploadFileToBucket(content, remoteFileName, PATIENT_BUCKET);
};

export const uploadPublicFile = async (content: StreamingBlobPayloadInputTypes, remoteFileName: string) => {
    return uploadFileToBucket(content, remoteFileName, PUBLIC_BUCKET);
};

const uploadFileToBucket = async (content: StreamingBlobPayloadInputTypes, remoteFileName: string, bucket: BucketConfig) => {
    const params = {
        Body: content,
        Bucket: bucket.bucketName,
        Key: remoteFileName,
    };

    const s3 = getS3(S3_CREDENTIALS, bucket.region);
    await s3.putObject(params);
}

/**
 * Downloads file from the S3 bucket
 * @param objectKey The key as defined in S3 console. Usually is just the full path of the file.
 */
export const downloadFile = async (objectKey: string): Promise<Readable> => {
    const params = {
        Bucket: PATIENT_BUCKET.bucketName,
        Key: objectKey,
    };

    const s3 = getS3(S3_CREDENTIALS, PATIENT_BUCKET.region);
    const object = await s3.getObject(params);
    const stream = object.Body;
    if (!stream)
        throw new Error(`No read stream for ${objectKey}`);

    const webstream = stream.transformToWebStream()
    return  Readable.fromWeb(webstream as any)
};

export const deleteFile = async (filePath: string) => {
    const params = {
        Bucket: PATIENT_BUCKET.bucketName,
        Key: filePath,
    };

    const s3 = getS3(S3_CREDENTIALS, PATIENT_BUCKET.region);
    await s3.deleteObject(params);
};

/**
 * Delete's all of the files in a folder
 * @param {String} folderName The id of the patient
 * Source: https://stackoverflow.com/questions/20207063/how-can-i-delete-folder-on-s3-with-node-js
 */
export const deleteFolder = async (folderName: string) => {
    const params = {
        Bucket: PATIENT_BUCKET.bucketName,
        Prefix: `${folderName}/`,
    };

    const s3 = getS3(S3_CREDENTIALS, PATIENT_BUCKET.region);

    // Gets up to 1000 files that need to be deleted
    const listedObjects = await s3.listObjectsV2(params);
    if (listedObjects.Contents?.length === 0) return;

    const deleteParams = {
        Bucket: PATIENT_BUCKET.bucketName,
        Delete: { Objects: [] as {Key: string}[] },
    };

    // Builds a list of the files to delete
    listedObjects.Contents?.forEach(({ Key }) => {
        if (!!Key)
            deleteParams.Delete.Objects.push({ Key });
    });

    // Deletes the files from S3
    await s3.deleteObjects(deleteParams);

    // If there are more than 1000 objects that need to be deleted from the folder
    if (listedObjects.IsTruncated)
        await deleteFolder(folderName);
};

function getS3(credentials: typeof S3_CREDENTIALS, region: string) {
    const s3 = new S3({
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
        },

        region: region,
    });

    return s3;
}