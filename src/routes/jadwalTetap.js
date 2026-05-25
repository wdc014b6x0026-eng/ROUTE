import express from 'express';
import {
  getAllJadwalTetap,
  getJadwalTetapById,
  getJadwalTetapByWilayah,
  createJadwalTetap,
  updateJadwalTetap,
  deleteJadwalTetap
} from '../controllers/jadwalTetapController.js';

const router = express.Router();

router.get('/',                        getAllJadwalTetap);
router.get('/:id',                     getJadwalTetapById);
router.get('/wilayah/:wilayah_id',     getJadwalTetapByWilayah);
router.post('/',                       createJadwalTetap);
router.put('/:id',                     updateJadwalTetap);
router.delete('/:id',                  deleteJadwalTetap);

export default router;