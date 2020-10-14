import React from 'react'

import { Link } from 'react-router-dom'

import Button from '../Helpers/Button/Button'

import './Table.css'

const Table = (props) => {

    const data = props.data;
    
    return (
        <table className="table">
          <thead>
            <tr className="head">
              <th>Name</th>
              <th>Patient #</th>
              <th>Date Added</th>
              <th>Last edited by</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(patient => (
              <tr key={patient.id} className="row">
                <td>{patient.name}</td>
                <td>{patient.id} </td>
                <td>{patient.createdDate}</td>
                <td>{patient.lastEdited}</td>
                <td>{patient.status}</td>
                <td style={{ display: 'flex' }}>
                  <Link to={`/patient-info/${patient.id}`}><Button name="View" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    )
}

export default Table;