const AWS_VARS = require('./aws-exports.js');
var AWS = require('aws-sdk');

/**
 * Checks if the user has the proper IAM role for accessing the DB.
 * When the role is checked, the provided callback will be called.
 * @param creds The AWS credential object provided by frontend
 * @param callback Takes isAuthenticated(bool) as a param.
 */
const verifyDBAuthentication = (creds, callback) => {
	var sts = new AWS.STS({
		accessKeyId: creds.accessKeyId,
		secretAccessKey: creds.secretAccessKey,
		sessionToken: creds.sessionToken,
	});	
	
	var params = {};
	sts.getCallerIdentity(params, (err, data) => {
		let isAuthenticated = data != null && data.ARN == AWS.DB_IAM_ROLE_ARN;
		callback(isAuthenticated);
	});
}

exports.verifyDBAuthentication = verifyDBAuthentication
