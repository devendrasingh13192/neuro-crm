import express from 'express';

const router = express.Router();

import { AuthController } from '../controllers/authController.js';

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export { router as authRouter };