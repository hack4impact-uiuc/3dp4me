import React from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./Components/Dashboard/Dashboard";
import AccountManagement from "./Components/Account Management/AccountManagment";
import Metrics from "./Components/Metrics/Metrics";
import Patients from "./Components/Patients/Patients";
import Navbar from "./Components/Navbar/Navbar";
import PatientInfo from "./Components/Patient Info/PatientInfo"

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
