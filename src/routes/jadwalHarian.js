import express from 'express';
import {
  getAllJadwalHarian,
  getJadwalHarianById,
  getJadwalHarianByTanggal,
  createJadwalHarian,
  updateStatusJadwalHarian,
  deleteJadwalHarian
} from '../controllers/jadwalHarianController.js';

const router = express.Router();

router.get('/',                    getAllJadwalHarian);
router.get('/:id',                 getJadwalHarianById);
router.get('/tanggal/:tanggal',    getJadwalHarianByTanggal);
router.post('/',                   createJadwalHarian);
router.put('/:id',                 updateStatusJadwalHarian);
router.delete('/:id',              deleteJadwalHarian);

export default router;