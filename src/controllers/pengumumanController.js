import supabase from '../config/supabase.js';

const toDbTipe = (tipe) => {
  const map = {
    'Event': 'umum',
    'Policy': 'kebijakan',
    'Schedule': 'jadwal',
    'General': 'umum',
    'Emergency': 'umum',
    'kebijakan': 'kebijakan',
    'jadwal': 'jadwal',
    'sampah': 'sampah',
    'umum': 'umum',
  };
  return map[tipe] ?? 'umum';
};

export const getAllPengumuman = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .select(`*, users (id, nama)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPengumumanById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('pengumuman')
      .select(`*, users (id, nama)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getActivePengumuman = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pengumuman')
      .select(`*, users (id, nama)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createPengumuman = async (req, res) => {
  try {
    const { judul, isi, tipe: rawTipe, berlaku_mulai, berlaku_sampai } = req.body;
    const tipe = toDbTipe(rawTipe);
    const admin_id = req.user.id;

    const { data, error } = await supabase
      .from('pengumuman')
      .insert([{ admin_id, judul, isi, tipe, berlaku_mulai, berlaku_sampai }])
      .select();

    if (error) throw error;
    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updatePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi, tipe: rawTipe, is_active, berlaku_mulai, berlaku_sampai } = req.body;
    const tipe = toDbTipe(rawTipe);

    const { data, error } = await supabase
      .from('pengumuman')
      .update({ judul, isi, tipe, is_active, berlaku_mulai, berlaku_sampai })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deletePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('pengumuman')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'Pengumuman berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};