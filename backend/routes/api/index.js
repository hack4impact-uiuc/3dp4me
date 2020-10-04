const express = require("express");
const router = express.Router();

// Put all routes here
router.use("/patient", require("./patient"));

module.exports = router;