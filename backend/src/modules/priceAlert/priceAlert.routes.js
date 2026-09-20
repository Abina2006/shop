import express from 'express';
import {
  getPriceAlerts,
  createPriceAlert,
  togglePriceAlert,
  updatePriceAlert,
  deletePriceAlert,
  testTriggerPriceAlert
} from './priceAlert.controller.js';

const router = express.Router();

router.get('/', getPriceAlerts);
router.post('/', createPriceAlert);
router.patch('/:id/toggle', togglePriceAlert);
router.patch('/:id', updatePriceAlert);
router.delete('/:id', deletePriceAlert);
router.post('/:id/test-trigger', testTriggerPriceAlert);

export default router;
