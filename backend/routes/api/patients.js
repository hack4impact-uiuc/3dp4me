const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

const { getAllPatients, getPatientsByStage, addPatient } = require("../../db/patients.js");

// Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        const patients = await getAllPatients();
        res.status(200).json({
            code: 200,
            success: true,
            result: patients,
        });
    }),
);

// Get all patients in a stage
router.get(
    "/:stage",
    errorWrap(async (req, res) => {
        const { stage } = req.params;
        
        const patients = await getPatientsByStage(stage);
        res.status(200).json({
            code: 200,
            success: true,
            result: patients,
        });
    }),
);

//This is needed to read in Form data for addPatient
router.use(express.urlencoded({
    extended: true
  }))
// Add patient with info
router.post(
    "/addPatients", 
    errorWrap(async (req, res) => {
        const patient_info = req.body;
        const last_patient_added = await addPatient(patient_info);
        res.status(200).json({
            code: 200,
            success: true,
            result: last_patient_added,
        })
    }),
);

module.exports = router;
