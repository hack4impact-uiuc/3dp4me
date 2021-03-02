const express = require('express');
const router = express.Router();

// Put all routes here
router.use('/patients', require('./patients'));
router.use('/stages', require('./stages'));
router.use('/metadata', require('./metadata'));

module.exports = router;
