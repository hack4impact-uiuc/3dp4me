import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import './App.css';
import awsconfig from './aws/aws-exports.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {getAccessKey, getSessionToken, getSecretAccessKey } from "./aws/aws-helper";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AccountManagement from "./Pages/Account Management/AccountManagment";
import Metrics from "./Pages/Metrics/Metrics";
import Patients from "./Pages/Patients/Patients";
import Navbar from "./Components/Navbar/Navbar";
import PatientInfo from "./Steps/Patient Info/PatientInfo"
import './styles.css'

// TODO: REmove this
// import { uploadFile } from "./../../backend/utils/aws/aws-s3-helpers";

const AWS = require("aws-sdk")
function getS3(keyID, secretKey, sessionToken) {
  // AWS.config.update({
	//   accessKeyId: keyID,
	//   secretAccessKey: secretKey,
  //   sessionToken: sessionToken,
	//   region: "us-east-2",
  // })

  let s3 = new AWS.S3({
      accessKeyId: keyID,
      secretAccessKey: secretKey,
      sessionToken: sessionToken,
      region: "us-east-2",
  })

  return s3
}


/**
* 
* @param {*} content Binary string
* @param {*} remoteFileName 
*/
const uploadFile = (content, remoteFileName, accessKeyId, secretAccessKey, sessionToken) => {
  var params = {
      Body: content, 
      Bucket: "3dp4me-dev", 
      Key: remoteFileName,
  };
  
  let s3 = getS3(accessKeyId, secretAccessKey, sessionToken)
  s3.putObject(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else     console.log(data);           // successful response
  });
}

Amplify.configure(awsconfig)

async function printKeys() {
  let k = await getAccessKey()
  let s = await getSecretAccessKey()
  let t = await getSessionToken()
  uploadFile("029302", "testfile.txt", k, s, t)
}

const App = function() {
  printKeys()

  return (
    <Router>
      <Navbar />
      <Switch>
        <div className="content">
          {/* Path = BASE_URL */}
        <AmplifySignOut />
          <Route exact path="/">
            <Dashboard />
          </Route>
           {/* Path = BASE_URL/account */}
          <Route path="/account">
            <AccountManagement />
          </Route>
           {/* Path = BASE_URL/metrics */}
          <Route path="/metrics">
            <Metrics />
          </Route>
           {/* Path = BASE_URL/patients */}
          <Route path="/patients">
            <Patients />
          </Route>
           {/* Path = BASE_URL/patient-info/PATIENT_SERIAL */}
          <Route path="/patient-info/:serial">
            <PatientInfo />
          </Route>
        </div>
      </Switch>
    </Router>
  );
}

export default withAuthenticator(App);
