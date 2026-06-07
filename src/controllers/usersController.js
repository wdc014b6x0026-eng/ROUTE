import supabase from '../config/supabase.js';

// GET semua users
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nama, email, role, no_telepon, alamat, wilayah_id, lat, lng, created_at');

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, nama, email, role, no_telepon, alamat, wilayah_id, lat, lng, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET users by wilayah (untuk peta petugas — tampilkan warga di wilayah tugas)
export const getUsersByWilayah = async (req, res) => {
  try {
    const { wilayah_id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, nama, email, role, no_telepon, alamat, wilayah_id, lat, lng')
      .eq('wilayah_id', wilayah_id)
      .eq('role', 'warga');

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, no_telepon, alamat, wilayah_id, lat, lng } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({ nama, no_telepon, alamat, wilayah_id, lat, lng })
      .eq('id', id)
      .select('id, nama, email, role, no_telepon, alamat, wilayah_id, lat, lng');

    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};