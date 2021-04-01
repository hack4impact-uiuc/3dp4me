const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const mongoose = require('mongoose');

// Returns all users information
router.get(
    '/',
    errorWrap(async (req, res) => {}),
);

module.exports = router;
