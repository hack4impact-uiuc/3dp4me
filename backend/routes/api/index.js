const express = require('express');
const router = express.Router();

// Put all routes here
router.use('/patients', require('./patients'));
router.use('/stages', require('./stages'));
router.use('/metadata', require('./metadata'));
router.use('/users', require('./users'));
router.use('/roles', require('./roles'));

module.exports = router;
