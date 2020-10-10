const express = require("express");
const router = express.Router();

// Put all routes here
router.use("/example", require("./example"));

module.exports = router;