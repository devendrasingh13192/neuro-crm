import express from 'express';

const router = express.Router();

import { authMiddleware, AuthRequest } from '../middlewares/auth.js';
import { InteractionController } from '../controllers/interactionController.js';

router.use(authMiddleware);

router.get('/client/:clientId', (req: AuthRequest, res) => InteractionController.getClientInteractions(req,res));

// GET /api/interactions/:id - Get single interaction by ID
router.get('/:id',(req: AuthRequest, res) => InteractionController.getInteractionById(req,res));

// POST /api/interactions - Create new interaction
router.post('/', (req: AuthRequest, res) => InteractionController.createInteraction(req,res));

// PUT /api/interactions/:id - Update interaction
router.patch('/:id',(req: AuthRequest, res) => InteractionController.updateInteraction(req,res));

// DELETE /api/interactions/:id - Delete interaction
router.delete('/:id',(req: AuthRequest, res) => InteractionController.deleteInteraction(req,res));

export { router as interactionRouter };