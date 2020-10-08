const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

const { getAllPatients, getPatientsByStage } = require("../../db/patients.js");

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

module.exports = router;
