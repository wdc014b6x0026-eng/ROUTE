import supabase from '../config/supabase.js';

export const getAllRiwayat = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('riwayat_pengangkutan')
      .select(`
        *,
        users (id, nama, email),
        jadwal_harian (id, tanggal, status,
          jadwal_tetap (id, hari,
            wilayah (id, nama_wilayah)
          )
        ),
        request_pengangkutan (id, jenis_sampah, estimasi_jumlah)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getRiwayatById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('riwayat_pengangkutan')
      .select(`
        *,
        users (id, nama, email),
        jadwal_harian (id, tanggal, status,
          jadwal_tetap (id, hari,
            wilayah (id, nama_wilayah)
          )
        ),
        request_pengangkutan (id, jenis_sampah, estimasi_jumlah)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getRiwayatByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('riwayat_pengangkutan')
      .select(`
        *,
        jadwal_harian (id, tanggal, status,
          jadwal_tetap (id, hari,
            wilayah (id, nama_wilayah)
          )
        ),
        request_pengangkutan (id, jenis_sampah, estimasi_jumlah)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createRiwayat = async (req, res) => {
  try {
    const { user_id, jadwal_harian_id, request_id, tipe, catatan_petugas } = req.body;

    const { data, error } = await supabase
      .from('riwayat_pengangkutan')
      .insert([{ user_id, jadwal_harian_id, request_id, tipe, catatan_petugas }])
      .select();

    if (error) throw error;
    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteRiwayat = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('riwayat_pengangkutan')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'Riwayat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};