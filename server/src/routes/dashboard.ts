import express from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authMiddleware, AuthRequest } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res) => DashboardController.getDashboardData(req,res));

export {router as dashboardRouter};