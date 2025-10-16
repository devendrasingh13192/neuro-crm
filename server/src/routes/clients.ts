import express from 'express';

const router = express.Router();

import { ClientController } from '../controllers/clientController.js';
import { authMiddleware, AuthRequest } from '../middlewares/auth.js';

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res) => ClientController.getClients(req, res));
router.post('/', (req: AuthRequest, res) => ClientController.createClient(req, res));
router.patch('/:id/neuro-profile', (req: AuthRequest, res) => ClientController.updateClient(req, res));
router.get('/:id/recommendations', (req: AuthRequest, res) => ClientController.getRecommendations(req, res));

export { router as clientRouter };