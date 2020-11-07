const AWS_VARS = require('./aws-exports.js');
var AWS = require('aws-sdk');
var MongoClient = require('mongodb').MongoClient;
var f = require('util');
var fs = require('fs');

var ca = [fs.readFileSync("./rds-combined-ca-bundle.pem")];

/**
 * Checks if the user has the proper IAM role for accessing the DB.
 * When the role is checked, the provided callback will be called.
 * @param creds The AWS credential object provided by frontend
 * @param callback Takes isAuthenticated(bool) as a param.
 */
const getDBInstance = () => {
	var params = {
		sslValidate: true,
		sslCA: ca,
		useNewUrlParser: true,
	}
	
	var client = MongoClient.connect(AWS_VARS.DB_CONNECT_ENDPOINT, params, (err, client) => {
                   console.log(err);	
	});	
	return client;
}

exports.verifyDBAuthentication = verifyDBAuthentication
