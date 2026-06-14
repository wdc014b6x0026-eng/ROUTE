import { supabaseAdmin } from '../config/supabase.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';

const HARI_ORDER = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

const getEffectiveDiff = (item, todayIdx, currentMinutes) => {
  const idx = HARI_ORDER.indexOf(item.hari?.toLowerCase());
  let diff = (idx - todayIdx + 7) % 7;

  if (diff === 0 && item.jam_selesai) {
    const [h, m] = item.jam_selesai.split(':').map(Number);
    if (currentMinutes >= h * 60 + m) diff = 7;
  }

  return diff;
};

// GET semua jadwal tetap
export const getAllJadwalTetap = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('jadwal_tetap')
      .select(`*, wilayah (id, nama_wilayah, kecamatan, kota), users (id, nama, email)`);

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal tetap by ID
export const getJadwalTetapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('jadwal_tetap')
      .select(`*, wilayah (id, nama_wilayah, kecamatan, kota), users (id, nama, email)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET jadwal tetap by wilayah — diurutkan berdasarkan jadwal terdekat yang masih aktif
export const getJadwalTetapByWilayah = async (req, res) => {
  try {
    const { wilayah_id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('jadwal_tetap')
      .select(`*, wilayah (id, nama_wilayah, kecamatan, kota), users (id, nama, email)`)
      .eq('wilayah_id', wilayah_id)
      .eq('is_active', true);

    if (error) throw error;

    const now = new Date();
    const todayIdx = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const sorted = (data ?? []).sort((a, b) => {
      const aDiff = getEffectiveDiff(a, todayIdx, currentMinutes);
      const bDiff = getEffectiveDiff(b, todayIdx, currentMinutes);

      if (aDiff === bDiff) {
        return (a.jam_mulai ?? '').localeCompare(b.jam_mulai ?? '');
      }

      return aDiff - bDiff;
    });

    res.json({ status: 'success', data: sorted });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST buat jadwal tetap baru
export const createJadwalTetap = async (req, res) => {
  try {
    const { wilayah_id, petugas_id, hari, jam_mulai, jam_selesai } = req.body;
    const { data, error } = await supabaseAdmin
      .from('jadwal_tetap')
      .insert([{ wilayah_id, petugas_id, hari, jam_mulai, jam_selesai }])
      .select(`*, wilayah (id, nama_wilayah, kecamatan, kota)`);

    if (error) throw error;

    const wilayahNama = data[0]?.wilayah?.nama_wilayah;

    if (wilayah_id) {
      const { data: wargaList } = await supabaseAdmin
        .from('users')
        .select('nama, email')
        .eq('wilayah_id', wilayah_id)
        .eq('role', 'warga');

      if (wargaList?.length > 0) {
        for (const warga of wargaList) {
          if (warga.email) {
            const template = emailTemplates.jadwalTetapBaru(
              warga.nama, hari, jam_mulai, jam_selesai, wilayahNama
            );
            await sendEmail({ to: warga.email, ...template });
          }
        }
        console.log(`Email jadwal tetap dikirim ke ${wargaList.length} warga`);
      }
    }

    res.status(201).json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// PUT update jadwal tetap
export const updateJadwalTetap = async (req, res) => {
  try {
    const { id } = req.params;
    const { petugas_id, hari, jam_mulai, jam_selesai, is_active } = req.body;
    const { data, error } = await supabaseAdmin
      .from('jadwal_tetap')
      .update({ petugas_id, hari, jam_mulai, jam_selesai, is_active })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// DELETE jadwal tetap
export const deleteJadwalTetap = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('jadwal_tetap')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ status: 'success', message: 'Jadwal tetap berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};