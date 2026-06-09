import supabase from '../config/supabase.js';

// GET semua jadwal harian
export const getAllJadwalHarian = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jadwal_harian')
      .select(`
        *,
        jadwal_tetap (
          id, hari, jam_mulai, jam_selesai,
          wilayah (id, nama_wilayah, kecamatan, kota)
        ),
        users (id, nama, email)
      `)
      .order('tanggal', { ascending: false });

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

// GET jadwal harian by ID
export const getJadwalHarianById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('jadwal_harian')
      .select(`
        *,
        jadwal_tetap (
          id, hari, jam_mulai, jam_selesai,
          wilayah (id, nama_wilayah, kecamatan, kota)
        ),
        users (id, nama, email)
      `)
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

// GET jadwal harian by tanggal
export const getJadwalHarianByTanggal = async (req, res) => {
  try {
    const { tanggal } = req.params;
    const { data, error } = await supabase
      .from('jadwal_harian')
      .select(`
        *,
        jadwal_tetap (
          id, hari, jam_mulai, jam_selesai,
          wilayah (id, nama_wilayah, kecamatan, kota)
        ),
        users (id, nama, email)
      `)
      .eq('tanggal', tanggal);

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

// POST buat jadwal harian baru
export const createJadwalHarian = async (req, res) => {
  try {
    const { jadwal_tetap_id, petugas_id, tanggal } = req.body;
    const { data, error } = await supabase
      .from('jadwal_harian')
      .insert([{ jadwal_tetap_id, petugas_id, tanggal }])
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

// PUT update status jadwal harian (dipakai petugas)
export const updateStatusJadwalHarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    const { data, error } = await supabase
      .from('jadwal_harian')
      .update({ status, catatan })
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

// DELETE jadwal harian
export const deleteJadwalHarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('jadwal_harian')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      status: 'success',
      message: 'Jadwal harian berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getJadwalByPetugas = async (req, res) => {
  try {
    const petugasId = req.user.id;
    
    const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();
    const hariMap = {
      'senin': 'senin', 'selasa': 'selasa', 'rabu': 'rabu',
      'kamis': 'kamis', 'jumat': 'jumat', 'sabtu': 'sabtu', 'minggu': 'minggu'
    };
    const hari = hariMap[hariIni] ?? hariIni;

    const { data, error } = await supabase
      .from('jadwal_tetap')
      .select(`
        *,
        wilayah (id, nama_wilayah, kecamatan, kota)
      `)
      .eq('petugas_id', petugasId)
      .eq('is_active', true)
      .eq('hari', hari);

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};