const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");

// TODO: Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        console.log("Getting patients")
        models.Patient.find().then(patients => res.status(200).json({
            code: 200, 
            success: true, 
            result: patients
        }));
    }),
);

// TODO: Get all patients in a stage
router.get(
    "/:stage",
    errorWrap(async (req, res) => {
        models.Patient.find().where('').then(patients => res.status(200).json({
            code: 200, 
            success: true, 
            result: patients
        }));
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        //     result: patients,
        // });
    }),
);

// TODO: Mark stage as complete for a patient
router.post(
    "/:serial/:stage/complete",
    errorWrap(async (req, res) => {
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        // });
    }),
);

// GET: Returns everything associated with patient stage
router.get(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        models.Patient.findById(id, stage).then(stageInfo => res.status(200).json({
            code: 200, 
            success: true, 
            result: stageInfo
        }));
    }),
);

// POST: Uploads files for certain stage and updates info
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        const { filename, userId, userName } = req.body
        const patientStage = models.Patient.findById(id, stage);
        const currDate = new Date();
        patientStage.lastEdit = currDate;
        patientStage.lastEditBy = userName;
        patientStage.files.push({filename: filename,
            uploadedBy: userName,
            uploadDate: currDate});
        await patientStage.save();
        
        
    }),
);


module.exports = router;
