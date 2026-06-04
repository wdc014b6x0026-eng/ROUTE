import supabase from '../config/supabase.js';

// POST register
export const register = async (req, res) => {
  try {
    const { nama, email, password, role, no_telepon, alamat, wilayah_id } = req.body;

    // Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Simpan data profil tambahan ke tabel users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        nama,
        email,
        role: role || 'warga',
        no_telepon,
        alamat,
        wilayah_id
      }])
      .select();

    if (userError) throw userError;

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: {
        id: userData[0].id,
        nama: userData[0].nama,
        email: userData[0].email,
        role: userData[0].role
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// POST login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Ambil data profil user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, nama, email, role, wilayah_id')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    res.json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        user: userData,
        token: authData.session.access_token
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// POST logout
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({
      status: 'success',
      message: 'Logout berhasil'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};