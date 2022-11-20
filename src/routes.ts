import express from 'express'

import authRoutes from './modules/auth/auth.routes'

const router = express.Router()

router.get('/health', (req, res) => res.send('OK'))
router.use('/auth', authRoutes())

export default router
