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

module.exports = router;
