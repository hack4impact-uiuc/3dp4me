const express = require("express");
const router = express.Router();
// Dont touch this file
router.use("/api", require("./api"));

module.exports = router;
