import supabase from '../config/supabase.js';

// GET semua wilayah
export const getAllWilayah = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wilayah')
      .select('*');

    if (error) throw error;

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// GET wilayah by ID
export const getWilayahById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('wilayah')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// POST buat wilayah baru
export const createWilayah = async (req, res) => {
  try {
    const { nama_wilayah, kecamatan, kota } = req.body;
    const { data, error } = await supabase
      .from('wilayah')
      .insert([{ nama_wilayah, kecamatan, kota }])
      .select();

    if (error) throw error;

    res.status(201).json({
      status: 'success',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// PUT update wilayah
export const updateWilayah = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_wilayah, kecamatan, kota } = req.body;
    const { data, error } = await supabase
      .from('wilayah')
      .update({ nama_wilayah, kecamatan, kota })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({
      status: 'success',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// DELETE wilayah
export const deleteWilayah = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('wilayah')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      status: 'success',
      message: 'Wilayah berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};