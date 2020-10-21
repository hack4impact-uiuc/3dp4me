const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

// Get all patients
const { getAllPatients, getPatientsByStage, completeStage, addPatient, revertStage } = require("../../db/patients.js");

// TODO: Get all patients
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
    })
);
// Mark stage as complete for a patient
router.post(
    "/:id/:stage/complete",
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        const { userId } = req.body;

        await completeStage(userId, id, stage);
        res.status(200).json({
            code: 200,
            success: true,
        });
    }),
);
router.post(
    "/:id/:stage/revert",
    errorWrap(async (req, res) => {
        const { id, currStage } = req.params;
        const { userId, notes } = req.body;
        await revertStage(userId, id, currStage, notes);
        res.status(200).json({
            code: 200,
            success: true,
        });
    }),
);

module.exports = router;
