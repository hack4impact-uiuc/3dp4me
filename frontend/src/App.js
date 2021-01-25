import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws/aws-exports.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AccountManagement from "./pages/AccountManagement/AccountManagment";
import Metrics from "./pages/Metrics/Metrics";
import Patients from "./pages/Patients/Patients";
import Navbar from "./components/Navbar/Navbar";
import MedicalInfo from "./steps/MedicalInfo/MedicalInfo";
import Controller from './steps/Controller/Controller';
import language from './language.json';
import { getCredentials, getCurrentUserInfo } from './aws/aws-helper.js';

Amplify.configure(awsconfig)

function App() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [key, setKey] = useState("EN");
  
  const langInfo = {
    data: language,
    key: key
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getCurrentUserInfo();
      setUsername(userInfo.username);
      setUserEmail(userInfo.email);
    }
    // TODO: get user session langauge
    setKey("EN");
    getUserInfo();
  }, []);

  return (
    <body dir={key === "AR" ? "rtl": "ltr"}>
      <Router>
        <Navbar lang={langInfo} setLang={setKey} username={username} userEmail={userEmail} />
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
              {/* Path = BASE_URL/patient-info/PATIENT_ID */}
              <Route exact path="/patient-info/:id">
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
