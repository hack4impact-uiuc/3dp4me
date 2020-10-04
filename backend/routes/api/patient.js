const express = require("express");
const pool = require("../../pool");
const router = express.Router();

router.get("/", (req, res) => {
    pool.query('SELECT * FROM patients', (error,  results) => {
        if (error) {
        throw error;
       }
       res.status(200).json({
        status: 'sucess',
        requestTime: req.requestTime,
        data: results.rows,
       });
    });
});

module.exports = router;
