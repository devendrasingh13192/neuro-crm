import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middlewares/auth.js';
import { ProfileController } from '../controllers/profileController.js';
router.use(authMiddleware);
router.get('/profile', (req, res) => ProfileController.getProfile(req, res));
router.patch('/profile', (req, res) => ProfileController.updateProfile(req, res));
export { router as profileRouter };
