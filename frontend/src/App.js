import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./Components/Dashboard/Dashboard";
import AccountManagement from './Components/Account Management/AccountManagment';
import Metrics from './Components/Metrics/Metrics';
import Patients from './Components/Patients/Patients';
import Navbar from './Components/Navbar/Navbar'

function App() {
  return (
    <Router>
    <Navbar />
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route exact path="/account">
          <AccountManagement />
        </Route>
        <Route exact path="/metrics">
          <Metrics />
        </Route>
        <Route exact path="/patients">
          <Patients />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
