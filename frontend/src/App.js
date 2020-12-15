import React, { useEffect, useState } from 'react';
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
import { Auth } from "aws-amplify";
import Login from "./components/Login/Login"

Amplify.configure(awsconfig)
const AUTHENTICATED = "AUTH"
const UNAUTHENTICATED = "UNAUTH"
const UNDEFINED_AUTH = "UNDEFINED"

function App() {
  const [key, setKey] = useState("EN");
  const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH)
  const langInfo = {
    data: language,
    key: key
  }

  useEffect(() => {
    // TODO: get user session langauge
    setKey("EN");
    Auth.currentAuthenticatedUser()
      .then(() => {setAuthLevel(AUTHENTICATED)})
      .catch(() => {setAuthLevel(UNAUTHENTICATED)})
  }, []);

  return (
    <body dir={key == "AR" ? "rtl": "ltr"}>
      {authLevel == AUTHENTICATED ? <Router>
        <Navbar lang={langInfo} />
        <div className={`${key == "AR" ? "flip" : ""}`}>
          <Switch>
            <div className="content">
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
              {/* Path = BASE_URL/patient-info/PATIENT_SERIAL */}
            </div>
          </Switch>
        </div>
      </Router> : authLevel == UNAUTHENTICATED ? 
      <Login /> : 
      <p>Checking login status</p> }
    </body>
  );
}

export default App;
