import express from 'express';
import {
  getAllRequest,
  getRequestById,
  getRequestByUser,
  createRequest,
  updateStatusRequest,
  deleteRequest
} from '../controllers/requestController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',          authenticate, authorizeRole('admin', 'petugas'), getAllRequest);
router.get('/my',        authenticate, authorizeRole('warga'), getRequestByUser);
router.get('/:id',       authenticate, getRequestById);
router.post('/',         authenticate, authorizeRole('warga'), createRequest);
router.put('/:id',       authenticate, authorizeRole('admin', 'petugas'), updateStatusRequest);
router.delete('/:id',    authenticate, authorizeRole('admin'), deleteRequest);

export default router;