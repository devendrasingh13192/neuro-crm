import express from 'express';

const router = express.Router();
import { authMiddleware } from '../middlewares/auth.js';
import { AuthRequest } from '../controllers/clientController.js';
import { ProfileController } from '../controllers/profileController.js';

router.use(authMiddleware);

router.get('/profile', (req : AuthRequest,res) => ProfileController.getProfile(req,res));
router.patch('/profile', (req : AuthRequest,res) => ProfileController.updateProfile(req,res));

export {router as profileRouter};

