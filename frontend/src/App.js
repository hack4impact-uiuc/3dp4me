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
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/account">
            <AccountManagement />
          </Route>
          <Route path="/metrics">
            <Metrics />
          </Route>
          <Route path="/patients">
            <Patients />
          </Route>
          <Route path="/patient-info/:id">
            <PatientInfo />
          </Route>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
