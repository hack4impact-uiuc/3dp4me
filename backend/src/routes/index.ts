import express from 'express';

export const router = express.Router();
router.use('/api', require('./api'));