const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");

const { getAllPatients } = require("../../db/patients.js");

// Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        const patients = await getAllPatients();
        res.status(200).json({
            code: 200,
            success: true,
            result: patients,
        })
    }),
);

module.exports = router;
