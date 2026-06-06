import express from 'express';
import {
  getAllArtikel,
  getArtikelById,
  getArtikelPublished,
  createArtikel,
  updateArtikel,
  deleteArtikel
} from '../controllers/artikelController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',            authenticate, getAllArtikel);
router.get('/published',   authenticate, getArtikelPublished);
router.get('/:id',         authenticate, getArtikelById);
router.post('/',           authenticate, authorizeRole('admin'), createArtikel);
router.put('/:id',         authenticate, authorizeRole('admin'), updateArtikel);
router.delete('/:id',      authenticate, authorizeRole('admin'), deleteArtikel);

export default router;