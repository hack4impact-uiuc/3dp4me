import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import './App.css';
import awsconfig from './aws/aws-exports.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./Pages/Dashboard/Dashboard";
import AccountManagement from "./Pages/Account Management/AccountManagment";
import Metrics from "./Pages/Metrics/Metrics";
import Patients from "./Pages/Patients/Patients";
import Navbar from "./Components/Navbar/Navbar";
import PatientInfo from "./Steps/Patient Info/PatientInfo"

import './styles.css'

Amplify.configure(awsconfig)

const App = function() {
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