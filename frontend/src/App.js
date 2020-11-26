import React, { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws/aws-exports.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AccountManagement from "./pages/AccountManagement/AccountManagment";
import Metrics from "./pages/Metrics/Metrics";
import Patients from "./pages/Patients/Patients";
import Navbar from "./components/Navbar/Navbar";
import MedicalInfo from "./steps/MedicalInfo/MedicalInfo"
import Controller from './steps/Controller/Controller'
import language from './language.json';
import { getCredentials } from './aws/aws-helper.js';

Amplify.configure(awsconfig)

function App() {

  const [key, setKey] = useState("EN");
  
  cred();

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
        <div>
          <AmplifySignOut/>
        </div>
      </Router>
    </body>
  );
}

async function cred() {
  console.log('credentials hit')
  console.log(await getCredentials());
}

export default withAuthenticator(App);
