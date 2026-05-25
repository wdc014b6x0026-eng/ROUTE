import express from 'express';
import {
  getAllWilayah,
  getWilayahById,
  createWilayah,
  updateWilayah,
  deleteWilayah
} from '../controllers/wilayahController.js';

const router = express.Router();

router.get('/',      getAllWilayah);
router.get('/:id',   getWilayahById);
router.post('/',     createWilayah);
router.put('/:id',   updateWilayah);
router.delete('/:id', deleteWilayah);

export default router;