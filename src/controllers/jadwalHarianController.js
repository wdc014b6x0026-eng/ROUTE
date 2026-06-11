import { supabaseAdmin } from '../config/supabase.js';

const HARI_MAP = {
  0: 'minggu', 1: 'senin', 2: 'selasa', 3: 'rabu',
  4: 'kamis', 5: 'jumat', 6: 'sabtu',
};

// GET semua jadwal harian
export const getAllJadwalHarian = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
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
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal harian by ID
export const getJadwalHarianById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
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
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal harian by tanggal
export const getJadwalHarianByTanggal = async (req, res) => {
  try {
    const { tanggal } = req.params;
    const { data, error } = await supabaseAdmin
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
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal harian dalam range tanggal (untuk admin dashboard chart)
// Query: GET /jadwal-harian/range?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getJadwalHarianByRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ status: 'error', message: 'Query params "from" dan "to" wajib diisi (YYYY-MM-DD)' });
    }

    const { data, error } = await supabaseAdmin
      .from('jadwal_harian')
      .select(`
        id, tanggal, status,
        jadwal_tetap (
          id, hari, jam_mulai, jam_selesai,
          wilayah (id, nama_wilayah, kecamatan, kota)
        )
      `)
      .gte('tanggal', from)
      .lte('tanggal', to)
      .order('tanggal', { ascending: true });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST buat jadwal harian baru
export const createJadwalHarian = async (req, res) => {
  try {
    const { jadwal_tetap_id, petugas_id, tanggal } = req.body;
    const { data, error } = await supabaseAdmin
      .from('jadwal_harian')
      .insert([{ jadwal_tetap_id, petugas_id, tanggal }])
      .select();

    if (error) throw error;
    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT update status jadwal harian (dipakai petugas)
export const updateStatusJadwalHarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan } = req.body;
    const { data, error } = await supabaseAdmin
      .from('jadwal_harian')
      .update({ status, catatan })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE jadwal harian
export const deleteJadwalHarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('jadwal_harian')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'Jadwal harian berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal hari ini untuk petugas yang sedang login
export const getJadwalByPetugas = async (req, res) => {
  try {
    const petugasId = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const hariMap = { 0:'minggu',1:'senin',2:'selasa',3:'rabu',4:'kamis',5:'jumat',6:'sabtu' };
    const hari = hariMap[new Date().getDay()];

    // Ambil jadwal tetap hari ini untuk petugas ini
    const { data: jadwalTetapList, error: jtError } = await supabaseAdmin
      .from('jadwal_tetap')
      .select(`*, wilayah (id, nama_wilayah, kecamatan, kota)`)
      .eq('petugas_id', petugasId)
      .eq('is_active', true)
      .eq('hari', hari);

    if (jtError) throw jtError;
    if (!jadwalTetapList || jadwalTetapList.length === 0) {
      return res.json({ status: 'success', data: [] });
    }

    // Auto-generate jadwal_harian kalau belum ada, lalu return
    const result = [];
    for (const jt of jadwalTetapList) {
      let { data: jh } = await supabaseAdmin
        .from('jadwal_harian')
        .select('*')
        .eq('jadwal_tetap_id', jt.id)
        .eq('tanggal', today)
        .maybeSingle();

      if (!jh) {
        const { data: newJh, error: insertError } = await supabaseAdmin
          .from('jadwal_harian')
          .insert([{ jadwal_tetap_id: jt.id, petugas_id: petugasId, tanggal: today, status: 'terjadwal' }])
          .select()
          .single();
        if (insertError) throw insertError;
        jh = newJh;
      }

      result.push({ ...jh, jadwal_tetap: jt });
    }

    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET riwayat jadwal harian untuk petugas yang sedang login
// Mengembalikan semua jadwal yang sudah selesai atau dibatalkan, urut terbaru dulu
export const getHistoryByPetugas = async (req, res) => {
  try {
    const petugasId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('jadwal_harian')
      .select(`
        id, tanggal, status, catatan,
        jadwal_tetap (
          id, hari, jam_mulai, jam_selesai,
          wilayah (id, nama_wilayah, kecamatan, kota)
        )
      `)
      .eq('petugas_id', petugasId)
      .in('status', ['sudah_diambil', 'dibatalkan'])
      .order('tanggal', { ascending: false });

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};