// import { Storage } from 'aws-amplify';
const S3_INFO = require('./aws-exports.js');
var AWS = require('aws-sdk');

// const amplify = require('aws-amplify');


/**
 * Upload a file to the S3 bucket
 * @param file The file object
 * @param patientDir The patient's directory name
 * @param filename This is what the file will be named in the bucket
 */
// export async function uploadFile(file, patientDir, filename) {
//     let fullAWSPath = `${patientDir}/${filename}`
//     amplify.Storage.put(fullAWSPath, file, {
//         contentType: 'text'
//     })
//     .then(res => console.log(res))
//     .catch(err => console.log(err));
// }

// /**
//  * Downloads a file from the S3
//  * @param fileName The path of the file relative to the /public directory
//  */
// export async function downloadFile(fileName) {
//     let blob = await Storage.get(fileName, { download: true})
//     return blob.Body
// }

// See all options here https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
function getS3(accessKeyId, secretAccessKey) {
    // let credentials = AWS.Credentials({
    //     accessKeyId: accessKeyId,
    //     secretAccessKey: secretAccessKey,
    //     sessionToken: null,
    // });

    let s3 = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: S3_INFO.S3_REGION,
    })

    return s3
}

/**
 * 
 * @param {*} content Binary string
 * @param {*} remoteFileName 
 */
const uploadFile = (content, remoteFileName, accessKeyId, secretAccessKey) => {
    var params = {
        Body: content, 
        Bucket: S3_INFO.S3_BUCKET_NAME, 
        Key: remoteFileName,
    };
    
    let s3 = getS3(accessKeyId, secretAccessKey)
    s3.putObject(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
    });
}

exports.uploadFile = uploadFile;