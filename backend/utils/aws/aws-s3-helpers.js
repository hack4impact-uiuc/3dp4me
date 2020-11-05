const S3_INFO = require('./aws-exports.js');
var AWS = require('aws-sdk');

/**
* 
* @param content File contents in a binary string
* @param remoteFileName The full directory of the s3 remote path to upload to
* @param credentials The temporary credentials of the end user. Frontend should provide this.
*/
const uploadFile = (content, remoteFileName, credentials) => {
    var params = {
        Body: content, 
        Bucket: S3_INFO.S3_BUCKET_NAME, 
        Key: remoteFileName,
    };

    let s3 = getS3(credentials)
    s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
    });
}

function getS3(credentials) {
  let s3 = new AWS.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
      region: S3_INFO.S3_REGION,
  })

  return s3
}

exports.uploadFile = uploadFile