import express from 'express'

import { router as apiRouter } from './api'

export const router = express.Router()
router.use('/api', apiRouter)
