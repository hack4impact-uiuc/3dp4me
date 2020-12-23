import React, { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
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
import Login from "./components/Login/Login"
import { UNDEFINED_AUTH, AUTHENTICATED, UNAUTHENTICATED, setAuthListener } from './aws/aws-auth.js';
import { getCredentials, getCurrentUserInfo } from './aws/aws-helper.js';

Amplify.configure(awsconfig)

function App() {
  const [key, setKey] = useState("EN");
  const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH)
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  cred();

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

    Auth.currentAuthenticatedUser()
      .then(() => {setAuthLevel(AUTHENTICATED)})
      .catch(() => {setAuthLevel(UNAUTHENTICATED)})

    // TODO: get user session langauge
    setKey("EN");
    getUserInfo();
  }, []);

  setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

  if (authLevel == UNDEFINED_AUTH)
    return ( <p>Authenticating user</p> );

  if (authLevel == UNAUTHENTICATED)
    return ( <Login /> );

  if (authLevel == AUTHENTICATED)
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

async function cred() {
  console.log('credentials hit')
  console.log(await getCredentials());
}

export default App;
