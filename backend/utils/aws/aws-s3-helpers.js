import { Storage } from 'aws-amplify';

/**
 * Upload a file to the S3 bucket
 * @param file The file object
 * @param patientDir The patient's directory name
 * @param filename This is what the file will be named in the bucket
 */
export async function uploadFile(file, patientDir, filename) {
    let fullAWSPath = `${patientDir}/${filename}`
    Storage.put(fullAWSPath, file, {
        contentType: 'text'
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

/**
 * Downloads a file from the S3
 * @param fileName The path of the file relative to the /public directory
 */
export async function downloadFile(fileName) {
    let blob = await Storage.get(fileName, { download: true})
    return blob.Body
}