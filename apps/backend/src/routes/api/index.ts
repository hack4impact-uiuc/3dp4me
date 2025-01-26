import express from 'express';

export const router = express.Router();

// Put all routes here
router.use('/patients', require('./patients'));
router.use('/stages', require('./steps'));
router.use('/metadata', require('./metadata'));
router.use('/users', require('./users'));
router.use('/roles', require('./roles'));
router.use('/public', require('./public'));

// Disable the Twilio stuff for now
// router.use('/messages', require('./messages'));
// router.use('/authentication', require('./authentication'));