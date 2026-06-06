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

// Semua user login bisa baca wilayah (untuk dropdown form register, dll)
router.get('/',       authenticate, getAllWilayah);
router.get('/:id',    authenticate, getWilayahById);

// Hanya admin yang bisa buat / ubah / hapus wilayah
router.post('/',      authenticate, authorizeRole('admin'), createWilayah);
router.put('/:id',    authenticate, authorizeRole('admin'), updateWilayah);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteWilayah);

export default router;