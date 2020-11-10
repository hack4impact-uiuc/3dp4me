import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Select, Snackbar, Grid } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MuiAlert from '@material-ui/lab/Alert';
import MainTable from '../../components/Table/MainTable';
import "./Dashboard.scss";
import colors from '../../colors.json';

import patientInfo from '../../Test Data/patient-info.json'
import earScan from '../../Test Data/earScan.json';
import modeling from '../../Test Data/CADModel.json';
import printing from '../../Test Data/printing.json';
import processing from '../../Test Data/processing.json';
import delivery from '../../Test Data/delivery.json';
import feedback from '../../Test Data/feedback.json';
import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import { Link } from "react-router-dom";

const Dashboard = (props) => {

  const [patients, setPatients] = useState([]);
  const [sort, setSort] = useState("new");
  const [step, setStep] = useState('info');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPatients, setFilteredPatients] = useState([]);
  const [stepTitle, setStepTitle] = useState("patientInfoTitle");
  const [noPatient, setNoPatient] = useState(false);
  const [sortedField, setSortedField] = React.useState(null);

  const lang = props.lang.data;
  const key = props.lang.key;

  const handlesort = (e) => {
    setSort(e.target.value);
  }

  const createPatient = (e) => {
    let auto_id = Math.random().toString(36).substr(2, 24);
    reactSwal({
      title: lang[key].components.swal.createPatient.title,
      buttons: {
        create: lang[key].components.swal.createPatient.buttons.noEdit,
        edit: lang[key].components.swal.createPatient.buttons.edit
      },
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
            <p>{lang[key].components.swal.createPatient.name}</p>
            <TextField id = "createName" fullWidth style={{ padding: 10 }} variant="outlined" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
            <p>{lang[key].components.swal.createPatient.dob} </p>
            <TextField id = "createDOB" fullWidth style={{ padding: 10 }} variant="outlined" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
            <p>{lang[key].components.swal.createPatient.id} </p>
            <TextField id = "createId" fullWidth style={{ padding: 10 }} defaultValue={auto_id} variant="outlined" />
          </div>
        </div>
      ),

    }).then((value) => {
      switch (value) {

        case "edit":
          window.location.href += `patient-info/${auto_id}`
          break;

        case "create":
          let name = document.getElementById("createName").value;
          let dob = document.getElementById("createDOB").value;
          let id = document.getElementById("createId").value;
          swal("Created Patient!", `Name: ${name}\nDOB: ${dob}\nID: ${id}`, "success");
          break;
      }
    })
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

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // TODO: hook up dashboard to display fetched patients
  const getPatients = async () => {
    // const res = await getAllPatients();
    // console.log(res);
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
            <h2 className={key === "AR" ? "patient-list-title-ar" : "patient-list-title"}>{lang[key].pages[stepTitle]}</h2>
            <TextField className="patient-list-search-field" onChange={handleSearch} value={searchQuery} variant="outlined" placeholder={lang[key].components.search.placeholder} />
            <Button style={{color: 'white', background: colors.button}} onClick={createPatient}>{lang[key].components.button.createPatient}</Button>
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
