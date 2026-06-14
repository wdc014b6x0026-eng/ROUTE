import express from 'express';
import {
  getAllRiwayat,
  getRiwayatById,
  getRiwayatByUser,
  createRiwayat,
  deleteRiwayat
} from '../controllers/riwayatController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',      authenticate, authorizeRole('admin', 'petugas'), getAllRiwayat);
router.get('/my',    authenticate, authorizeRole('warga'), getRiwayatByUser);
router.get('/:id',   authenticate, getRiwayatById);
router.post('/',     authenticate, authorizeRole('petugas', 'admin'), createRiwayat);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteRiwayat);

export default router;