import express from 'express';

import patients from './patients';
import steps from './steps';
import metadata from './metadata';
import users from './users';
import roles from './roles';
import publicRoutes from './public';
import exportRoutes from './export';

export const router = express.Router();

// Put all routes here
router.use('/patients', patients);
router.use('/stages', steps);
router.use('/metadata', metadata);
router.use('/users', users);
router.use('/roles', roles);
router.use('/public', publicRoutes);
router.use('/export', exportRoutes); // for export button

// Disable the Twilio stuff for now
// router.use('/messages', require('./messages'));
// router.use('/authentication', require('./authentication'));