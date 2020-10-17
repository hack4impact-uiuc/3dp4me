const express = require("express");
const router = express.Router();

// Put all routes here
router.use("/patients", require("./patients"));

module.exports = router;