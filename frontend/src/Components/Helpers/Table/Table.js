import React from 'react'

import { Link } from 'react-router-dom'

import Button from '../Button/Button'

import './Table.css'

const Table = (props) => {

    const data = props.data;
    const headers = props.headers;
    
    return (
        <table className="table">
          <thead>
            <tr className="head">
              {headers.map(head => (
                <th>{head}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(patient => (
              <tr key={patient.id} className="row">
                <td>{patient.name}</td>
                <td>{patient.serial} </td>
                <td>{patient.createdDate}</td>
                <td>{patient.lastEdited}</td>
                <td>{patient.status}</td>
                <td style={{ display: 'flex' }}>
                  <Link to={`/patient-info/${patient.serial}`}><Button name="View" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    )
}

export default Table;