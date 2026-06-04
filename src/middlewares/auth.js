import supabase from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan'
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau sudah expired'
      });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, nama, email, role, wilayah_id')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    req.user = userData;
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak, role tidak sesuai'
      });
    }
    next();
  };
};