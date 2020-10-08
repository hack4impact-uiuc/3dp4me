import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import './App.css';
import awsconfig from './aws-exports.js';

Amplify.configure(awsconfig)

const App = function() {
  return (
    // <div className="App">
    //   { Login() }
    // </div>
    <div>
    <AmplifySignOut />
    My App
    </div>
  );
}

export default withAuthenticator(App);