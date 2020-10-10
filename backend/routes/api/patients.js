const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

const { getAllPatients, getPatientsByStage, completeStage } = require("../../db/patients.js");

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

// Mark stage as complete for a patient
router.post(
    "/:id/:stage/complete",
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        
        await completeStage(id, stage);
        res.status(200).json({
            code: 200,
            success: true,
        });
    }),
);

module.exports = router;
