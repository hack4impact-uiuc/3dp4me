const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");

// TODO: Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        //     result: patients,
        // });
    }),
);

// TODO: Get all patients in a stage
router.get(
    "/:stage",
    errorWrap(async (req, res) => {
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        //     result: patients,
        // });
    }),
);

// TODO: Mark stage as complete for a patient
router.post(
    "/:id/:stage/complete",
    errorWrap(async (req, res) => {
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        // });
    }),
);

//Get All Patients
router.get(
    '/getAllPatients',
    errorWrap(async (req, res) => {
        console.log("Getting patients")
        Patient.find().then(patients => res.json(patients))
    }),
);



module.exports = router;
