import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import './App.css';
import awsconfig from './aws/aws-exports.js';
import S3ImageUpload from './aws/aws-image-upload';
import { isNormalUser } from './aws/aws-helper';

Amplify.configure(awsconfig)

const App = function() {
  return (
    <div>
    <AmplifySignOut />
    <S3ImageUpload />
    </div>
  );
}

export default withAuthenticator(App);