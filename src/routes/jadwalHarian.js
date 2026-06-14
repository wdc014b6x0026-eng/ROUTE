import express from 'express';
import {
  getAllJadwalHarian,
  getJadwalHarianById,
  getJadwalHarianByTanggal,
  getJadwalHarianByRange,
  createJadwalHarian,
  updateStatusJadwalHarian,
  deleteJadwalHarian,
  getJadwalByPetugas,
  getHistoryByPetugas,
} from '../controllers/jadwalHarianController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// ── Specific named routes first (before /:id to avoid conflicts) ──────────────
router.get('/petugas/jadwal',   authenticate, authorizeRole('petugas'), getJadwalByPetugas);
router.get('/petugas/history',  authenticate, authorizeRole('petugas'), getHistoryByPetugas);
router.get('/range',            authenticate, authorizeRole('admin'), getJadwalHarianByRange);
router.get('/tanggal/:tanggal', authenticate, getJadwalHarianByTanggal);

// ── Generic routes ─────────────────────────────────────────────────────────────
router.get('/',     authenticate, getAllJadwalHarian);
router.get('/:id',  authenticate, getJadwalHarianById);
router.post('/',    authenticate, authorizeRole('admin'), createJadwalHarian);
router.put('/:id',  authenticate, authorizeRole('petugas', 'admin'), updateStatusJadwalHarian);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteJadwalHarian);

export default router;