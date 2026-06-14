import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUsersByWilayah,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';
import { authenticate, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',                    authenticate, authorizeRole('admin'), getAllUsers);
router.get('/wilayah/:wilayah_id', authenticate, getUsersByWilayah);   // petugas & admin
router.get('/:id',                 authenticate, getUserById);
router.put('/:id',                 authenticate, updateUser);
router.delete('/:id',              authenticate, authorizeRole('admin'), deleteUser);

export default router;