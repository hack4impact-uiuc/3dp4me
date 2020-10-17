import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./Steps/Dashboard/Dashboard";
import AccountManagement from "./Pages/Account Management/AccountManagment";
import Metrics from "./Pages/Metrics/Metrics";
import Patients from "./Steps/Patients/Patients";
import Navbar from "./Steps/Navbar/Navbar";
import PatientInfo from "./Steps/Patient Info/PatientInfo"

import './styles.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <div className="content">
          {/* Path = BASE_URL */}
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

export default App;
