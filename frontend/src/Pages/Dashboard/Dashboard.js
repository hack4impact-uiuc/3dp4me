<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Select, Snackbar } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MuiAlert from '@material-ui/lab/Alert';
import MainTable from '../../Components/Table/MainTable';
import "./Dashboard.scss";
import FeebackTable from "../../Components/Table/FeedbackTable";
>>>>>>> origin/lh/css

import patientInfo from '../../Test Data/patient-info.json'
import earScan from '../../Test Data/earScan.json';
import modeling from '../../Test Data/CADModel.json';
import printing from '../../Test Data/printing.json';
import processing from '../../Test Data/processing.json';
import delivery from '../../Test Data/delivery.json';
import feedback from '../../Test Data/feedback.json';



const Dashboard = (props) => {

  const [patients, setPatients] = useState([]);
  const [sort, setSort] = useState("new");
  const [step, setStep] = useState('info');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPatients, setFilteredPatients] = useState([]);
  const [stepTitle, setStepTitle] = useState("patientInfoTitle");
  const [noPatient, setNoPatient] = useState(false);
  const [sortedField, setSortedField] = React.useState(null);

<<<<<<< HEAD
import { getAllPatients } from "../../utils/api";

const Dashboard = (props) => {
  const [patients, setPatients] = useState([])
=======
  const lang = props.lang.data;
  const key = props.lang.key;

  const handlesort = (e) => {
    setSort(e.target.value);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    let filtered = patients.filter
      (patient => patient.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1 || 
      (patient.serial + "").search(e.target.value) !== -1 ||
      patient._id.search(e.target.value) !== -1
    );
    setNoPatient(filtered.length === 0);
    setFilteredPatients(filtered);
  }

  const handleNoPatientClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNoPatient(false);
  };

  const handleStep = (event, newStep) => {
    setSearchQuery("");
    if (newStep !== null) {
      setStep(newStep);
      if (newStep === "info") {
        setStepTitle("patientInfoTitle");
        setPatients(patientInfo)
        console.log("here")
      } else if (newStep === "scan") {
        setStepTitle("earScanTitle");
        setPatients(earScan)
      } else if (newStep === "cad") {
        setStepTitle("CADModelingTitle");
        setPatients(modeling)
      } else if (newStep === "printing") {
        setStepTitle("printingTitle");
        setPatients(printing)
      } else if (newStep === "processing") {
        setStepTitle("postProcessingTitle");
        setPatients(processing)
      } else if (newStep === "delivery") {
        setStepTitle("deliveryTitle");
        setPatients(delivery)
      } else if (newStep === "feedback") {
        setStepTitle("feedbackTitle");
        setPatients(feedback)
      }
    }
  };

  useEffect(() => {
    setPatients(patientInfo)
  }, []);
>>>>>>> origin/lh/css

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // TODO: hook up dashboard to display fetched patients
  const getPatients = async() => {
    const res = await getAllPatients();
    console.log(res);
  }

  useEffect(() => {
    getPatients();
  }, [setPatients]);

  return (
    <div className="dashboard">
      <Snackbar open={noPatient} autoHideDuration={3000} onClose={handleNoPatientClose}>
        <Alert onClose={handleNoPatientClose} severity="error">
          {lang[key].components.table.noPatientsFound}
        </Alert>
      </Snackbar>
      <div className="tabs">
        {/* <Toolbar> */}
        <ToggleButtonGroup className="dashboard-button-group" size="large" exclusive value={step} onChange={handleStep}>
          <ToggleButton disableRipple className="dashboard-button" value="info">{lang[key].components.stepTabs.patientInfo}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="scan">{lang[key].components.stepTabs.earScan}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="cad">{lang[key].components.stepTabs.CADModeling}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="printing">{lang[key].components.stepTabs.print}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="processing">{lang[key].components.stepTabs.processing}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="delivery">{lang[key].components.stepTabs.delivery}</ToggleButton>
          <ToggleButton disableRipple className="dashboard-button" value="feedback">{lang[key].components.stepTabs.feedback}</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="patient-list">
        <div className="header">
          <div className="section">
            <h2 className={ key === "AR" ? "patient-list-title-ar" : "patient-list-title"}>{lang[key].pages[stepTitle]}</h2>
            <TextField className="patient-list-search-field" onChange={handleSearch} value={searchQuery} variant="outlined" placeholder={lang[key].components.search.placeholder} />
            <Select variant="outlined"
              value={sort}
              onChange={handlesort}
            >
              <MenuItem value="new">{lang[key].components.dropdown.newest}</MenuItem>
              <MenuItem value="old">{lang[key].components.dropdown.oldest}</MenuItem>
              <MenuItem value="serial">{lang[key].components.dropdown.serial}</MenuItem>
              <MenuItem value="status">{lang[key].components.dropdown.status}</MenuItem>
            </Select>
            <Button>{lang[key].components.button.createPatient}</Button>
          </div>
        </div>
        {stepTitle !== "feedbackTitle" ? (
          <>
            {
              searchQuery.length === 0 ? (
                <MainTable
                  headers={[
                    { title: lang[key].components.table.mainHeaders.name, sortKey: "name" },
                    { title: lang[key].components.table.mainHeaders.serial, sortKey: "serial" },
                    { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                    { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdited" },
                    { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                  ]}
                  rowIds={[
                    "name",
                    "serial",
                    "createdDate",
                    "lastEdited",
                    "status"
                  ]}
                  lang={props.lang}
                  patients={patients} />
              ) : (
                  <MainTable
                    headers={[
                      { title: lang[key].components.table.mainHeaders.name, sortKey: "name" },
                      { title: lang[key].components.table.mainHeaders.serial, sortKey: "serial" },
                      { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                      { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdited" },
                      { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                    ]}
                    rowIds={[
                      "name",
                      "serial",
                      "createdDate",
                      "lastEdited",
                      "status"
                    ]}
                    lang={props.lang}
                    patients={filterPatients} />
                )
            }
          </>
        ) : (
            <>
              {
                searchQuery.length === 0 ? (
                  <MainTable
                    headers={[
                      { title: lang[key].components.table.feedbackHeaders.name, sortKey: "name" },
                      { title: lang[key].components.table.feedbackHeaders.serial, sortKey: "serial" },
                      { title: lang[key].components.table.feedbackHeaders.added, sortKey: "createdDate" },
                      { title: lang[key].components.table.feedbackHeaders.feedbackCycle, sortKey: "feedbackCycle" },
                      { title: lang[key].components.table.feedbackHeaders.status, sortKey: "status" },
                    ]}
                    rowIds={[
                      "name",
                      "serial",
                      "createdDate",
                      "feedbackCycle",
                      "status"
                    ]}
                    lang={props.lang}
                    patients={patients} />
                ) : (
                    <MainTable
                      headers={[
                        { title: lang[key].components.table.feedbackHeaders.name, sortKey: "name" },
                        { title: lang[key].components.table.feedbackHeaders.serial, sortKey: "serial" },
                        { title: lang[key].components.table.feedbackHeaders.added, sortKey: "createdDate" },
                        { title: lang[key].components.table.feedbackHeaders.feedbackCycle, sortKey: "feedbackCycle" },
                        { title: lang[key].components.table.feedbackHeaders.status, sortKey: "status" },
                      ]}
                      rowIds={[
                        "name",
                        "serial",
                        "createdDate",
                        "feedbackCycle",
                        "status"
                      ]}
                      lang={props.lang}
                      patients={filterPatients} />
                  )
              }
            </>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
