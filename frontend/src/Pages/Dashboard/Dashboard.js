import React, { useState } from "react";

import { Button, ButtonGroup, MenuItem, TextField, Toolbar, Select } from '@material-ui/core'

import MainTable from '../../Components/Table/MainTable'

import "./Dashboard.css";

const Dashboard = (props) => {

  const [patients, setPatients] = useState([])
  const [sort, setSort] = useState("new");

  const handlesort = (e) => {

  }

  const patientsTest = [
    { name: "Amit", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
    { name: "Evan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
    { name: "Anisha", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
    { name: "Lauren", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
    { name: "Navam", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
    { name: "Ashank", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
    { name: "Andy", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
    { name: "Gene", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  ]

  return (
    <div className="dashboard">
      <div className="tabs">
        {/* <Toolbar> */}
        <ButtonGroup fullWidth>
          <Button style={{ background: '#e5f0ff' }}>Patient Info</Button>
          <Button style={{ background: '#e5f0ff' }}>Ear scan upload</Button>
          <Button style={{ background: '#e5f0ff' }}>CAD Modeling</Button>
          <Button style={{ background: '#e5f0ff' }}>3D Printing</Button>
          <Button style={{ background: '#e5f0ff' }}>Post Processing</Button>
          <Button style={{ background: '#e5f0ff' }}>Delivery</Button>
          <Button style={{ background: '#e5f0ff' }}>Feedback</Button>
        </ButtonGroup>
        {/* </Toolbar> */}
        {/* 
          * TODO: Dashboard Table and content on button press to toggle between patients in X stage 
        */}
      </div>
      <div className="patient-list">
        <div className="header">
          <div className="section">
            <h2 style={{ flexGrow: 1 }}>Patient</h2>
            <TextField variant="outlined" placeholder="Search..." />
            <Select variant="outlined"
              value={sort}
              onChange={handlesort}
            >
              <MenuItem value={"new"}>Newest</MenuItem>
              <MenuItem value={"old"}>Oldest</MenuItem>
              <MenuItem value={"serial"}>Serial</MenuItem>
              <MenuItem value={"status"}>Status</MenuItem>
            </Select>
            <Button>Create new patient</Button>
          </div>
        </div>
        <MainTable patients={patientsTest} />
      </div>
    </div>
  );
};

export default Dashboard;
