import express from 'express';
import {
  getAllWilayah,
  getWilayahById,
  createWilayah,
  updateWilayah,
  deleteWilayah,
} from '../controllers/wilayahController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public — needed for the register form (unauthenticated users pick their area)
router.get('/', getAllWilayah);
router.get('/:id', getWilayahById);

// Admin-only mutations
router.post('/',      authenticate, authorizeRole('admin'), createWilayah);
router.put('/:id',   authenticate, authorizeRole('admin'), updateWilayah);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteWilayah);

export default router;
