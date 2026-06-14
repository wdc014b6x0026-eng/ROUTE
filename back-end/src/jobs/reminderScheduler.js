import cron from 'node-cron';
import { supabaseAdmin } from '../config/supabase.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';

const HARI_MAP = {
  0: 'minggu',
  1: 'senin',
  2: 'selasa',
  3: 'rabu',
  4: 'kamis',
  5: 'jumat',
  6: 'sabtu',
};

export const startReminderScheduler = () => {
  cron.schedule('0 18 * * *', async () => {
    console.log('Running reminder scheduler...');

    try {
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      const hariBesok = HARI_MAP[besok.getDay()];

      const { data: jadwalList, error } = await supabaseAdmin
        .from('jadwal_tetap')
        .select(`*, wilayah (id, nama_wilayah, kecamatan, kota)`)
        .eq('hari', hariBesok)
        .eq('is_active', true);

      if (error) throw error;

      if (!jadwalList || jadwalList.length === 0) {
        console.log(`Tidak ada jadwal untuk hari ${hariBesok}`);
        return;
      }

      let totalEmail = 0;

      for (const jadwal of jadwalList) {
        const wilayahId = jadwal.wilayah_id;
        const wilayahNama = jadwal.wilayah?.nama_wilayah;

        const { data: wargaList } = await supabaseAdmin
          .from('users')
          .select('nama, email')
          .eq('wilayah_id', wilayahId)
          .eq('role', 'warga');

        if (!wargaList || wargaList.length === 0) continue;

        for (const warga of wargaList) {
          if (!warga.email) continue;
          const template = emailTemplates.jadwalReminder(
            warga.nama,
            hariBesok,
            jadwal.jam_mulai,
            wilayahNama
          );
          await sendEmail({ to: warga.email, ...template });
          totalEmail++;
        }
      }

      console.log(`Reminder dikirim ke ${totalEmail} warga untuk jadwal hari ${hariBesok}`);
    } catch (error) {
      console.error('Reminder scheduler error:', error.message);
    }
  }, {
    timezone: 'Asia/Makassar'
  });

  console.log('Reminder scheduler started — runs daily at 18:00 WITA');
};