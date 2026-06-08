import supabase from '../config/supabase.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';

const toFrontendStatus = (status) => {
  const map = {
    pending: 'menunggu',
    disetujui: 'diterima',
    dijadwalkan: 'dijadwalkan',
    selesai: 'selesai',
    ditolak: 'ditolak',
  };
  return map[status] ?? status;
};

const toDbStatus = (status) => {
  const map = {
    menunggu: 'pending',
    diterima: 'disetujui',
    dijadwalkan: 'dijadwalkan',
    selesai: 'selesai',
    ditolak: 'ditolak',
  };
  return map[status] ?? status;
};

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

    const mapped = data.map(r => ({ ...r, status: toFrontendStatus(r.status) }));
    res.json({ status: 'success', data: mapped });
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

    res.json({ status: 'success', data: { ...data, status: toFrontendStatus(data.status) } });
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

    const mapped = data.map(r => ({ ...r, status: toFrontendStatus(r.status) }));
    res.json({ status: 'success', data: mapped });
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

    // Kirim email notifikasi ke user
    const { data: userData } = await supabase
      .from('users')
      .select('nama, email')
      .eq('id', user_id)
      .single();
    
    console.log('userData email check:', userData);  
    if (userData?.email) {
      const template = emailTemplates.requestCreated(userData.nama, jenis_sampah, estimasi_jumlah);
      await sendEmail({ to: userData.email, ...template });
    }

    res.status(201).json({ status: 'success', data: { ...data[0], status: toFrontendStatus(data[0].status) } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateStatusRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: frontendStatus, alasan_penolakan, jadwal_harian_id } = req.body;
    const status = toDbStatus(frontendStatus);

    const { data, error } = await supabase
      .from('request_pengangkutan')
      .update({ status, alasan_penolakan, jadwal_harian_id })
      .eq('id', id)
      .select(`*, users (id, nama, email)`);

    if (error) throw error;

    // Kirim email notifikasi ke user
    const userData = data[0]?.users;
    if (userData?.email) {
      const template = emailTemplates.requestStatusUpdated(
        userData.nama,
        toFrontendStatus(status),
        alasan_penolakan
      );
      await sendEmail({ to: userData.email, ...template });
    }

    res.json({ status: 'success', data: { ...data[0], status: toFrontendStatus(data[0].status) } });
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