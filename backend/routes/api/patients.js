const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const Patient = require('../../models/Patient');

router.get(
    '/',
    errorWrap(async (req, res) => {
        console.log("Hello World!");
        res.status(200).json({
            code: 200,
            success: true,
            result: "hi",
        });
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
