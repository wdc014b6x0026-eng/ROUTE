import express from 'express';
import {
  getAllJadwalTetap,
  getJadwalTetapById,
  getJadwalTetapByWilayah,
  createJadwalTetap,
  updateJadwalTetap,
  deleteJadwalTetap,
} from '../controllers/jadwalTetapController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Semua user login bisa baca jadwal tetap
router.get('/',                    authenticate, getAllJadwalTetap);
router.get('/wilayah/:wilayah_id', authenticate, getJadwalTetapByWilayah);
router.get('/:id',                 authenticate, getJadwalTetapById);

// Hanya admin yang bisa CUD
router.post('/',    authenticate, authorizeRole('admin'), createJadwalTetap);
router.put('/:id',  authenticate, authorizeRole('admin'), updateJadwalTetap);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteJadwalTetap);

export default router;