import supabase from '../config/supabase.js';

export const getAllRequest = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('request_pengangkutan')
      .select(`
        *,
        users (id, nama, email),
        wilayah (id, nama_wilayah, kecamatan),
        jadwal_harian (id, tanggal, status)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('request_pengangkutan')
      .select(`
        *,
        users (id, nama, email),
        wilayah (id, nama_wilayah, kecamatan),
        jadwal_harian (id, tanggal, status)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getRequestByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('request_pengangkutan')
      .select(`
        *,
        wilayah (id, nama_wilayah, kecamatan),
        jadwal_harian (id, tanggal, status)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { wilayah_id, jenis_sampah, estimasi_jumlah, catatan } = req.body;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('request_pengangkutan')
      .insert([{ user_id, wilayah_id, jenis_sampah, estimasi_jumlah, catatan }])
      .select();

    if (error) throw error;

    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateStatusRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, alasan_penolakan, jadwal_harian_id } = req.body;

    const { data, error } = await supabase
      .from('request_pengangkutan')
      .update({ status, alasan_penolakan, jadwal_harian_id })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('request_pengangkutan')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ status: 'success', message: 'Request berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};