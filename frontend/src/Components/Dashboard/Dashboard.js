import React, { useState } from "react";

import Button from "../Helpers/Button/Button";

import "./Dashboard.css";

const Dashboard = (props) => {

  const [patients, setPatients] = useState([])


  return (
    <div>
      <div className="tabs">
        {/* Utilizing regular buttons because tab button css will be different*/}
        <button>Patient Info</button>
        <button>Ear scan upload</button>
        <button>CAD Modeling</button>
        <button>3D Printing</button>
        <button>Delivery/Feedback</button>
      </div>
      <div className="patient-list">
        <div className="header">
          <h2 style={{ flexGrow: 1 }}>Patient Information</h2>
          <Button name="Create New Patient" />
        </div>
        <table className="table">
          <tr className="head">
            <th>Name</th>
            <th>Patient #</th>
            <th>Date Added</th>
            <th>Last edited by</th>
            <th>Status</th>
            <th></th>
          </tr>
          <tr className="row">
            <td>Test Name</td>
            <td>Test Number</td>
            <td>Test Date</td>
            <td>Test Date</td>
            <td>Test Status</td>
            <td style={{ display: 'flex' }}>
              <Button name="View" />
              <Button name="Edit" />
            </td>
          </tr>
          {patients.map(patient => (
            <tr></tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
