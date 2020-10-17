import React, { useEffect, useState } from "react";

import Button from "../Helpers/Button/Button";

import { Link } from 'react-router-dom'

import Table from '../Helpers/Table/Table'

import "./Dashboard.css";

import { getAllPatients } from "../../utils/api";

const Dashboard = (props) => {
  const [patients, setPatients] = useState([])

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

  // TODO: hook up dashboard to display fetched patients
  const getPatients = async() => {
    const res = await getAllPatients();
    console.log(res);
  }

  useEffect(() => {
    getPatients();
  }, [setPatients]);

  return (
    <div>
      <div className="tabs">
        {/* Utilizing regular buttons because tab button css will be different*/}
        <button>Patient Info</button>
        <button>Ear scan upload</button>
        <button>CAD Modeling</button>
        <button>3D Printing</button>
        <button>Delivery</button>
        <button>Feedback</button>
        <button>Post Processing</button>
        {/* 
          * TODO: Dashboard Table and content on button press to toggle between patients in X stage 
        */}
      </div>
      <div className="patient-list">
        <div className="header">
          <div className="section">
            <h2 style={{ flexGrow: 1 }}>Patient Information</h2>
            <input placeholder="Search..." />
            <select defaultValue="newest">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="patient#">Patient #</option>
              <option value="status">Status</option>
            </select>
            <Button name="Create New Patient" />
          </div>
        </div>
        <Table headers={["Name", "Serial", "Date Added", "Last Edit By", "Status"]} data={patientsTest} />
      </div>
    </div>
  );
};

export default Dashboard;
