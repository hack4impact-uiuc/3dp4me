import React, { useState } from "react";

import Button from "../Helpers/Button/Button";

import { Link } from 'react-router-dom'

import Table from '../Table/Table'

import "./Dashboard.css";

const Dashboard = (props) => {

  const [patients, setPatients] = useState([])

  const patientsTest = [
    { name: "Amit", id: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
    { name: "Evan", id: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
    { name: "Anisha", id: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
    { name: "Lauren", id: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
    { name: "Navam", id: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
    { name: "Ashank", id: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
    { name: "Andy", id: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
    { name: "Gene", id: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
  ]

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
        <Table data={patientsTest} />
      </div>
    </div>
  );
};

export default Dashboard;
