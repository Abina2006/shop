import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from './wishlist.controller.js';

const router = express.Router();

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
