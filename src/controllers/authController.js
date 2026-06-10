import { supabase, supabaseAdmin } from '../config/supabase.js';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (req, res) => {
  const { nama, email, password, role, no_telepon, alamat, wilayah_id, lat, lng } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'nama, email, dan password wajib diisi',
    });
  }

  const allowedSelfRegisterRoles = ['warga'];
  const userRole = role || 'warga';
  if (!allowedSelfRegisterRoles.includes(userRole)) {
    return res.status(403).json({
      status: 'error',
      message: 'Role tidak diizinkan untuk registrasi mandiri',
    });
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authData.user.id,
        nama,
        email,
        role: userRole,
        no_telepon: no_telepon || null,
        alamat: alamat || null,
        wilayah_id: wilayah_id || null,
        lat: lat || null,
        lng: lng || null,
      }])
      .select('id, nama, email, role, wilayah_id, lat, lng')
      .single();

    if (userError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: userData,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'email dan password wajib diisi',
    });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, nama, email, role, wilayah_id, no_telepon, alamat, lat, lng')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    res.json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        user: userData,
        token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.json({ status: 'success', message: 'Logout berhasil' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({ status: 'success', data: req.user });
};