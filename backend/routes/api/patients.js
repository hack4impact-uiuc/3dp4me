const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models, statusEnum } = require("../../models");

// Get all patients (query parameter "stage")
router.get(
    '/',
    errorWrap(async (req, res) => {
        const { stage } = req.query;
        let patients;
        if (stage) {
            // Query by status of the specified stage
            let query = {};
            query[`${stage}.status`] = { $in: [ statusEnum.PARTIALLYDONE, statusEnum.NOTTOUCHED ] };
            patients = await models.Patient.find(query);
        } else {
            patients = await models.Patient.find();
        }
        res.status(200).json({
            code: 200,
            success: true,
            result: patients,
        });
    }),
);

// Edit a patient's status
// TODO: Upload new files to AWS and update files field in model
router.put(
    '/:serial/:stage/status',
    errorWrap(async (req, res) => {
        const { status, userID, notes } = req.body;
        const { serial, stage } = req.params;
        const updatedPatient = await models.Patient.findOneAndUpdate(
            {
                "serial": serial
            },
            {
                [stage]: {
                    "status": status,
                    "lastEdit": Date.now(),
                    "lastEditBy": userID,
                    "notes": notes
                }
            }
        );
        res.status(200).json({
            code: 200,
            success: true,
            result: updatedPatient,
        });
    }),
);

module.exports = router;
