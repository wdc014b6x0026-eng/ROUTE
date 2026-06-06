import { supabase } from '../config/supabase.js';

/**
 * Middleware: verifikasi Bearer token dari Supabase Auth.
 * Jika valid, isi req.user dengan data profil dari tabel users.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token ke Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau sudah expired',
      });
    }

    // Ambil profil dari tabel users
    // Pakai supabase biasa (bukan admin), RLS sudah allow user baca profilnya sendiri
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, nama, email, role, wilayah_id')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        status: 'error',
        message: 'Profil user tidak ditemukan',
      });
    }

    req.user = userData;
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Middleware: izinkan hanya role tertentu.
 * Gunakan setelah authenticate.
 * Contoh: authorizeRole('admin', 'petugas')
 */
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Akses ditolak. Diperlukan role: ${roles.join(' atau ')}`,
      });
    }
    next();
  };
};