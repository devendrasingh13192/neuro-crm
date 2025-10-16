import express from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();
router.use(authMiddleware);
router.get('/', (req, res) => DashboardController.getDashboardData(req, res));
export { router as dashboardRouter };
