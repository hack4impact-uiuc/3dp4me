import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws/aws-exports.js';

import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AccountManagement from "./Pages/Account Management/AccountManagment";
import Metrics from "./Pages/Metrics/Metrics";
import Patients from "./Pages/Patients/Patients";
import Navbar from "./Components/Navbar/Navbar";
import PatientInfo from "./Steps/Patient Info/PatientInfo"
import Controller from './Steps/Controller/Controller'
import language from './language.json';
import './styles.css'

Amplify.configure(awsconfig)

function App() {

  const [key, setKey] = useState("EN");


  const langInfo = {
    data: language,
    key: key
  }

  useEffect(() => {
    // TODO: get user session langauge
    setKey("EN");
  }, []);

  return (
    <body dir={key == "AR" ? "rtl": "ltr"}>
      <Router>
        <Navbar lang={langInfo} />
        <div className={`${key == "AR" ? "flip" : ""}`}>
          <Switch>
            <div className="content">
              {/* Path = BASE_URL */}
              <Route exact path="/">
                <Dashboard lang={langInfo} />
              </Route>
              {/* Path = BASE_URL/account */}
              <Route exact path="/account">
                <AccountManagement lang={langInfo} />
              </Route>
              {/* Path = BASE_URL/metrics */}
              <Route exact path="/metrics">
                <Metrics lang={langInfo} />
              </Route>
              {/* Path = BASE_URL/patients */}
              <Route exact path="/patients">
                <Patients lang={langInfo} />
              </Route>
              {/* Path = BASE_URL/patient-info/PATIENT_SERIAL */}
              <Route exact path="/patient-info/:serial">
                <Controller lang={langInfo} />
              </Route>
            </div>
          </Switch>
        </div>
      </Router>
    </body>
  );
}

export default withAuthenticator(App);
