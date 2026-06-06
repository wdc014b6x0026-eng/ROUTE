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

router.get('/',          authenticate, getAllPengumuman);
router.get('/active',    authenticate, getActivePengumuman);
router.get('/:id',       authenticate, getPengumumanById);
router.post('/',         authenticate, authorizeRole('admin'), createPengumuman);
router.put('/:id',       authenticate, authorizeRole('admin'), updatePengumuman);
router.delete('/:id',    authenticate, authorizeRole('admin'), deletePengumuman);

export default router;