import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Select, Snackbar } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MuiAlert from '@material-ui/lab/Alert';
import MainTable from '../../Components/Table/MainTable';
import "./Dashboard.css";
import FeebackTable from "../../Components/Table/FeedbackTable";


const Dashboard = (props) => {

  const [patients, setPatients] = useState([]);
  const [sort, setSort] = useState("new");
  const [step, setStep] = useState('info');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPatients, setFilteredPatients] = useState([]);
  const [stepTitle, setStepTitle] = useState("Patient");
  const [noPatient, setNoPatient] = useState(false);


  const handlesort = (e) => {
    setSort(e.target.value);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    let filtered = patients.filter(patient => patient.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1 || patient.serial.search(e.target.value) !== -1);
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
        setStepTitle("Patient");
        setPatients(patientInfo)
        console.log("here")
      } else if (newStep === "scan") {
        setStepTitle("Ear Scan");
        setPatients(earScan)
      } else if (newStep === "cad") {
        setStepTitle("CAD Modeling");
        setPatients(modeling)
      } else if (newStep === "printing") {
        setStepTitle("3D Printing");
        setPatients(patientInfo)
      } else if (newStep === "processing") {
        setStepTitle("Post Processing");
        setPatients(patientInfo)
      } else if (newStep === "delivery") {
        setStepTitle("Delivery");
        setPatients(patientInfo)
      } else if (newStep === "feedback") {
        setStepTitle("Feedback");
        setPatients(patientInfo)
      }
    }
  };

  useEffect(() => {
    setPatients(patientInfo)
  }, []);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


  const patientInfo = [
    { name: "Amit Sawhney", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
    { name: "Evan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
    { name: "Anisha", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
    { name: "Lauren", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
    { name: "Navam", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
    { name: "Ashank", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
    { name: "Andy", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
    { name: "Gene", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  ]
  const earScan = [
    { name: "Alice", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
    { name: "Arpan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
    { name: "Andy", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
    { name: "Arman", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
    { name: "Anooj", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
    { name: "Neeraj", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
    { name: "Ashwin", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
    { name: "Ayan", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  ]
  const modeling = [
    { name: "Daniel", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
    { name: "Chloe", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
    { name: "David", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
    { name: "Faith", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
    { name: "Jackie", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
    { name: "Neeraj", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
    { name: "Jeffery", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
    { name: "Kelley", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  ]

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
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="info">Medical Info</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="scan">Ear scan upload</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="cad">CAD Modleing</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="printing">3D Printing</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="processing">Post Processing</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="delivery">Delivery</ToggleButton>
          <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black' }} value="feedback">Feedback</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="patient-list">
        <div className="header">
          <div className="section">
            <h2 style={{ flexGrow: 1 }}>{stepTitle}</h2>
            <TextField onChange={handleSearch} value={searchQuery} variant="outlined" style={{ margin: '10px' }} placeholder="Search..." />
            <Select variant="outlined"
              value={sort}
              onChange={handlesort}
            >
              <MenuItem value="new">Newest</MenuItem>
              <MenuItem value="old">Oldest</MenuItem>
              <MenuItem value="serial">Serial</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
            <Button>Create new patient</Button>
          </div>
        </div>
        {stepTitle !== "Feedback" ? (
          <>
            {
              searchQuery.length === 0 ? (
                <MainTable patients={patients} />
              ) : (
                  <MainTable patients={filterPatients} />
                )
            }
          </>
        ) : (
            <>
              {
                searchQuery.length === 0 ? (
                  <FeebackTable patients={patients} />
                ) : (
                    <FeebackTable patients={filterPatients} />
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
