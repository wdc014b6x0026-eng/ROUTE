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

// Public — published articles are viewable by anyone (education page, landing page)
router.get('/published', getArtikelPublished);
router.get('/:id',       getArtikelById);

// Requires auth — full list only for admin
router.get('/',          authenticate, authorizeRole('admin'), getAllArtikel);

// Admin-only mutations
router.post('/',         authenticate, authorizeRole('admin'), createArtikel);
router.put('/:id',       authenticate, authorizeRole('admin'), updateArtikel);
router.delete('/:id',    authenticate, authorizeRole('admin'), deleteArtikel);

export default router;
