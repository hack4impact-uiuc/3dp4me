import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Select, Snackbar } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MuiAlert from '@material-ui/lab/Alert';
import MainTable from '../../Components/Table/MainTable';
import "./Dashboard.css";
import FeebackTable from "../../Components/Table/FeedbackTable";

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

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // const patientInfo = [
  //   { name: "Amit Sawhney", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
  //   { name: "Evan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
  //   { name: "Anisha", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
  //   { name: "Lauren", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
  //   { name: "Navam", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
  //   { name: "Ashank", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
  //   { name: "Andy", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
  //   { name: "Gene", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  // ]
  // const earScan = [
  //   { name: "Alice", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
  //   { name: "Arpan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
  //   { name: "Andy", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
  //   { name: "Arman", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
  //   { name: "Anooj", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
  //   { name: "Neeraj", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
  //   { name: "Ashwin", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
  //   { name: "Ayan", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  // ]
  // const modeling = [
  //   { name: "Daniel", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
  //   { name: "Chloe", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
  //   { name: "David", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
  //   { name: "Faith", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
  //   { name: "Jackie", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
  //   { name: "Neeraj", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
  //   { name: "Jeffery", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
  //   { name: "Kelley", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  // ]

  return (
    <div className="dashboard">
      <Snackbar open={noPatient} autoHideDuration={3000} onClose={handleNoPatientClose}>
        <Alert onClose={handleNoPatientClose} severity="error">
          Sorry! No matching patients
        </Alert>
      </Snackbar>
      <div className="tabs">
        {/* <Toolbar> */}
        <ToggleButtonGroup style={{ width: '100%' }} size="large" exclusive value={step} onChange={handleStep}>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="info">{lang[key].components.stepTabs.patientInfo}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="scan">{lang[key].components.stepTabs.earScan}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="cad">{lang[key].components.stepTabs.CADModeling}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="printing">{lang[key].components.stepTabs.print}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="processing">{lang[key].components.stepTabs.processing}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="delivery">{lang[key].components.stepTabs.delivery}</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="feedback">{lang[key].components.stepTabs.feedback}</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="patient-list">
        <div className="header">
          <div className="section">
            <h2 style={ key === "AR" ? { flexGrow: 1, marginRight: '10px' } : {flexGrow: 1}}>{lang[key].pages[stepTitle]}</h2>
            <TextField onChange={handleSearch} value={searchQuery} variant="outlined" style={{ margin: '10px' }} placeholder={lang[key].components.search.placeholder} />
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
        {/* {searchQuery.length === 0 ? (
          <MainTable patients={patients} />
        ) : (
            <MainTable patients={filterPatients} />
          )} */}
      </div>
    </div>
  );
};

export default Dashboard;
