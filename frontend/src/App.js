import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import './App.css';
import awsconfig from './aws/aws-exports.js';
import S3FileUpload from './aws/aws-file-upload';
import S3FileDownload from './aws/aws-file-download';
import { isNormalUser } from './aws/aws-helper';

Amplify.configure(awsconfig)

const App = function() {
  return (
    <div>
    <AmplifySignOut />
    { S3FileUpload("PatientID", "earscan.txt") }
    { S3FileDownload("PatientID/earscan.txt") }
  <p>{isNormalUser()?"Signed in":"Not signed in"}</p>
    </div>
  );
}

export default withAuthenticator(App);