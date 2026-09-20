import { Router } from 'express';
import { getAdvice, getStoredAdvice } from './platformAdvisor.controller.js';

const router = Router();

// POST /api/platform-advisor – generate platform recommendation
router.post('/', getAdvice);

// GET /api/platform-advisor/:productId – retrieve saved recommendation
router.get('/:productId', getStoredAdvice);

export default router;
