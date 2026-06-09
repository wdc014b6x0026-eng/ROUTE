import express from 'express';
import {
  getAllJadwalHarian,
  getJadwalHarianById,
  getJadwalHarianByTanggal,
  createJadwalHarian,
  updateStatusJadwalHarian,
  deleteJadwalHarian,
  getJadwalByPetugas
} from '../controllers/jadwalHarianController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',                    authenticate, getAllJadwalHarian);
router.get('/petugas/jadwal',      authenticate, authorizeRole('petugas'), getJadwalByPetugas);
router.get('/tanggal/:tanggal',    authenticate, getJadwalHarianByTanggal);
router.get('/:id',                 authenticate, getJadwalHarianById);
router.post('/',                   authenticate, authorizeRole('admin'), createJadwalHarian);
router.put('/:id',                 authenticate, authorizeRole('petugas', 'admin'), updateStatusJadwalHarian);
router.delete('/:id',              authenticate, authorizeRole('admin'), deleteJadwalHarian);

export default router;