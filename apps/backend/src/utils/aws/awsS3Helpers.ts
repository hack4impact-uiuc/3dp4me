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
import fs from 'fs';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';

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

export const fileExistsInS3 = async (s3Key: string): Promise<boolean> => {
  try {
    await downloadFile(s3Key);
    return true;
  } catch (error) {
    return false;
  }
};


// Function to download and save a file from Step3 with type detection (uses package to detect type, defaults to .png if no type is detected)

// Step 1: Download file from S3 to local temporary path using streaming
export const downloadFileToLocal = async (
  s3Key: string,
  localPath: string
): Promise<void> => {
  const s3Stream = await downloadFile(s3Key);
  const writeStream = fs.createWriteStream(localPath);

  return new Promise((resolve, reject) => {
    s3Stream.pipe(writeStream)
      .on('finish', () => {
        console.log(`Downloaded to temporary location: ${localPath}`);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Step 2: Determine file type from saved file on disk
const detectFileTypeFromFile = async (filePath: string): Promise<string | null> => {
  try {
    const buffer = fs.readFileSync(filePath, { highWaterMark: 4100 }); // Only read first 4KB for type detection
    const fileTypeResult = await fileTypeFromBuffer(buffer);
    return fileTypeResult?.ext || null;
  } catch (error) {
    console.error('Error detecting file type:', error);
    return null;
  }
};

// Step 3: Rename file with proper extension if needed
const renameFileWithProperExtension = async (
  currentPath: string,
  originalFilename: string,
  detectedType: string | null
): Promise<string> => {
  const properFilename = addProperExtension(originalFilename, detectedType);
  const properLocalPath = path.join(path.dirname(currentPath), sanitizeFilename(properFilename));

  // Only rename if the path is different
  if (path.resolve(properLocalPath) !== path.resolve(currentPath)) {
    fs.renameSync(currentPath, properLocalPath);
    console.log(`Renamed file to: ${properLocalPath}`);
  }

  return properLocalPath;
};

// Main function that orchestrates the three steps
export const downloadAndSaveFileWithTypeDetection = async (
  s3Key: string,
  localPath: string,
  originalFilename: string
): Promise<boolean> => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Step 1: Download to temporary location
    const tempPath = `${localPath}.tmp`;
    await downloadFileToLocal(s3Key, tempPath);

    // Step 2: Detect file type from saved file
    const detectedType = await detectFileTypeFromFile(tempPath);

    // Step 3: Rename with proper extension
    const finalPath = await renameFileWithProperExtension(tempPath, originalFilename, detectedType);

    if (detectedType) {
      console.log(`Downloaded with detected type '${detectedType}': ${finalPath}`);
    } else {
      console.log(`No type detected, kept original name: ${finalPath}`);
    }

    return true;
  } catch (error) {
    console.error('Error in downloadAndSaveFileWithTypeDetection:', error);
    return false;
  }
};

export const sanitizeFilename = (filename: string): string => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  const sanitizedName = name.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
  return sanitizedName + ext;
};

const detectFileTypeFromBuffer = async (buffer: Buffer): Promise<string | null> => {
  try {
    const result = await fileTypeFromBuffer(buffer);
    return result?.ext || null;
  } catch (error) {
    console.error('Error detecting file type:', error);  // defaults to .png
    return null;
  }
};

// Function to add the proper extension to a filename, default to .png if no type is detected
const addProperExtension = (originalFilename: string, detectedType: string | null): string => {
  // If file already has an extension, keep it
  const hasExtension = path.extname(originalFilename).length > 0;
  if (hasExtension) {
    return originalFilename;
  }

  // If we detected a type, add the extension
  if (detectedType) {
    return `${originalFilename}.${detectedType}`;
  }

  // Default fallback - most files are images
  return `${originalFilename}.png`;
};