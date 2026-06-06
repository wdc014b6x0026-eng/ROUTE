import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Semua route users butuh login
router.get('/',       authenticate, authorizeRole('admin'), getAllUsers);
router.get('/:id',    authenticate, getUserById);          // user bisa baca profil sendiri, admin semua (dikontrol di controller)
router.put('/:id',    authenticate, updateUser);           // user bisa update profil sendiri (dikontrol di controller)
router.delete('/:id', authenticate, authorizeRole('admin'), deleteUser);

export default router;