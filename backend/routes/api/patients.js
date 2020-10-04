const express = require("express");
const router = express.Router();
const db = require("../../pool.js");

const { getAllPatients } = require("../../db/patients.js");

// Get all patients
router.get("/", async (req, res) => {
    try {
        const patients = await getAllPatients();
        res.status(200).json({
            status: "success",
            data: patients,
        });
    } catch(e) {
        console.error("sad", e);
    }
});

module.exports = router;
