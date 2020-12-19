import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import swal from 'sweetalert';
import patientFile from '../../Test Data/patient.json';

import CloseIcon from '@material-ui/icons/Close';
import './ManagePatientModal.scss';

const ManagePatientModal = (props) => {
	const [patientStatus, setPatientStatus] = useState("active");

	const lang = props.lang.data;
	const key = props.lang.key;

	const handleManagePatientStatus = e => {
        setPatientStatus(e.target.value);
	}
	
	const handleManagePatientClose = () => {
        swal.close();
	}
	
	const handleDeletePatient = () => {
        swal({
            title: lang[key].components.swal.managePatient.confirmDeleteMsg,
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (willDelete) {
                swal({
                    title: lang[key].components.swal.managePatient.deleteSuccessMsg,
                    icon: "success"
                }).then(() => {
                    // TODO: call delete patient endpoint
                    window.location.href = "/";
                });
            }
        });
	}
	
	const handleManagePatientSave = () => {
        let name = document.getElementById("manage-patient-name").value;
        let dob = document.getElementById("manage-patient-dob").value;
        // TODO: call edit patient endpoint with new name / dob / patientStatus
        swal(lang[key].components.swal.managePatient.successMsg, "", "success");
    }
	
  	return (
		<div className={`controller-manage-patient-wrapper ${key === "AR" ? "controller-manage-patient-wrapper-ar" : ""}`}>
			<div className="manage-patient-header">
				<h2>{lang[key].components.swal.managePatient.title}</h2>
				<Button onClick={handleManagePatientClose}><CloseIcon /></Button>
			</div>
			<div className="profile-information-wrapper">
				<h3>{lang[key].components.swal.managePatient.profileInformation}</h3>
				<p>{lang[key].components.swal.managePatient.name}</p>
				<TextField id="manage-patient-name" defaultValue={patientFile.patientInfo.name} />
				<p>{lang[key].components.swal.managePatient.dob}</p>
				<TextField id="manage-patient-dob" defaultValue={patientFile.patientInfo.dob} />
			</div>
			<div className="profile-management-wrapper">
				<h3>{lang[key].components.swal.managePatient.profileManagement}</h3>
				<p>{lang[key].components.swal.managePatient.archiveInformation}</p>
				<div className="profile-management-radio-button-group" onChange={handleManagePatientStatus}>
					<div><input type="radio" value="active" name="status" checked={patientStatus==="active"} /> {lang[key].components.swal.managePatient.active}</div>
					<div><input type="radio" value="feedback" name="status" checked={patientStatus==="feedback"} /> {lang[key].components.swal.managePatient.feedback}</div>
					<div><input type="radio" value="archived" name="status" checked={patientStatus==="archived"} /> {lang[key].components.swal.managePatient.archive}</div>
				</div>
			</div>
			<div className={`manage-patient-delete ${key === "AR" ? "manage-patient-delete-ar" : ""}`}>
				<p>{lang[key].components.swal.managePatient.deleteInformation}</p>
				<Button className="manage-patient-delete-button" onClick={handleDeletePatient}>{lang[key].components.swal.managePatient.buttons.delete}</Button>
			</div>
			<div className="manage-patient-footer">
				<Button className="manage-patient-save-button" onClick={handleManagePatientSave}>{lang[key].components.swal.managePatient.buttons.save}</Button>
			</div>
		</div>
  	);
};

export default ManagePatientModal;
