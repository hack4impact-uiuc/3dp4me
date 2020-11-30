import React, { useEffect, useState } from 'react';
import awsconfig from './../../aws/aws-exports.js';
import { credentials } from './../../aws/aws-helper.js';
import { Auth } from 'aws-amplify';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
// //import awsconfig from './aws/aws-exports.js';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import AccountManagement from "./pages/AccountManagement/AccountManagment";
// import Metrics from "./pages/Metrics/Metrics";
// import Patients from "./pages/Patients/Patients";
// import Navbar from "./components/Navbar/Navbar";
// import MedicalInfo from "./steps/MedicalInfo/MedicalInfo"
// import Controller from './steps/Controller/Controller'
// import language from './language.json';
// import { Auth } from "aws-amplify";
const KEY_CODE = "code"
const AUTH_DOMAIN = awsconfig.oauth.domain
const AUTH_TOKEN_URL = `https://${AUTH_DOMAIN}/oauth2/token`

const FormatURLEncodedBody = (data) => {
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    return formBody
}

const RequestSessionInfo = (code) => {
    var data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': awsconfig.Auth.userPoolWebClientId,
        'redirect_uri': "http:\/\/localhost:3000\/login"
    };
   
    var formBody = FormatURLEncodedBody(data)
    return fetch(AUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
    });
}

const SetSessionInfo = async function(search) {
    let authCode = new URLSearchParams(search).get(KEY_CODE)
    // TODO: Maybe throw the link to the hosted UI in the error message
    if (authCode == null)
        throw "Authentication code is not in the URL. Login from the AWS hosted UI"

    let response = await RequestSessionInfo(authCode) 
    if (response == null || response.status == null || response.status != 200)
        throw "Got a bad response from AWS. Try logging in again."

    let body = await response.body.getReader().read();
    let decoded_body = new TextDecoder("utf-8").decode(body.value)
    let decoded_body_json = JSON.parse(decoded_body) 
    credentials = decoded_body_json
}

const Login = (props) => {
    const [errorMsg, setErrorMsg] = useState("Logging in")

    try {
       SetSessionInfo(props.location.search);
    } catch (err) {
        // console.log(err)
        setErrorMsg(err.message)
    }

    return(
        <div>
            {errorMsg}
        </div>
    )
}

export default Login
