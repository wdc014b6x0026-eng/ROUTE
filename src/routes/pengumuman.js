import express from 'express';
import {
  getAllPengumuman,
  getPengumumanById,
  getActivePengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman
} from '../controllers/pengumumanController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public — active announcements are visible to all (even landing page)
router.get('/active',    getActivePengumuman);
router.get('/:id',       getPengumumanById);

// Requires auth — full list for admin
router.get('/',          authenticate, authorizeRole('admin'), getAllPengumuman);

// Admin-only mutations
router.post('/',         authenticate, authorizeRole('admin'), createPengumuman);
router.put('/:id',       authenticate, authorizeRole('admin'), updatePengumuman);
router.delete('/:id',    authenticate, authorizeRole('admin'), deletePengumuman);

export default router;
