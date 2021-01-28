const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");

// Get all patients  basic info
router.get(
    '/',
    errorWrap(async (req, res) => {
        models.Patient.find({}, "_id patientInfo.name createdDate lastEdited status").then(patients => {
            fin = patients.map(info => {
                return {
                    "_id": info._id, 
                    "name": info.patientInfo.name, 
                    "createdDate": info.createdDate,
                    "lastEdited": info.lastEdited,
                    "status": info.status,
                }
            })

            res.status(200).json({
                code: 200, 
                success: true, 
                result: fin
            })
        });
    }),
);

// GET: Returns basic stage info for every user 
router.get(
    '/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        const patientsData = await models.Patient.find({}, "_id patientInfo.name createdDate " + stage);
        const remappedPatients = patientsData.map(info => {
            const stageData = info[stage];
            return {
                "_id": info._id, 
                "name": info.patientInfo.name, 
                "createdDate": info.createdDate,
                "feedbackCycle": stageData.feedbackCycle,
                "lastEdited": stageData.lastEdited,
                "status": stageData.status,
            }
        });
        res.status(200).json({
            code: 200, 
            success: true, 
            result: remappedPatients,
        });
    }),
);

module.exports = router;
