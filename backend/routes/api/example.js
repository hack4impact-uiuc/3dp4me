const express = require("express");
const router = express.Router();
// will auto matically handle any errors if they appear.
const { errorWrap } = require("../../utils");
// get db related function for usage
const { getAll } = require("../../db/example.js");

// Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        const values = await getAll();
        res.status(200).json({
            code: 200,
            success: true,
            result: values,
        })
    }),
);

module.exports = router;
