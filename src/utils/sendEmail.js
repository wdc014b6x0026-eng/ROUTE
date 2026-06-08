import transporter from '../config/mailer.js';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ROUTE App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

export const emailTemplates = {
  requestCreated: (userName, jenisSampah, estimasi) => ({
    subject: 'Request Pengangkutan Berhasil Dibuat',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ROUTE</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>Request Pengangkutan Diterima</h2>
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Request pengangkutan sampah kamu berhasil dibuat dengan detail:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Jenis Sampah</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${jenisSampah}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Estimasi</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${estimasi}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Status</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">Menunggu konfirmasi</td>
            </tr>
          </table>
          <p>Kami akan segera memproses request kamu. Pantau statusnya di aplikasi ROUTE.</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2026 ROUTE — Routing & Operational Updates for Trash Execution</p>
        </div>
      </div>
    `,
  }),

  requestStatusUpdated: (userName, status, alasan) => ({
    subject: `Status Request Diperbarui: ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ROUTE</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>Update Status Request</h2>
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Status request pengangkutan kamu telah diperbarui menjadi <strong>${status}</strong>.</p>
          ${alasan ? `<p>Alasan: ${alasan}</p>` : ''}
          <p>Buka aplikasi ROUTE untuk detail lebih lanjut.</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2026 ROUTE — Routing & Operational Updates for Trash Execution</p>
        </div>
      </div>
    `,
  }),

  jadwalReminder: (userName, hari, jamMulai, wilayah) => ({
    subject: 'Pengingat Jadwal Pengangkutan Sampah',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">ROUTE</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>Pengingat Jadwal Pengangkutan</h2>
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Jadwal pengangkutan sampah di wilayah kamu:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Hari</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${hari}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Jam</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${jamMulai}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db;"><strong>Wilayah</strong></td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${wilayah}</td>
            </tr>
          </table>
          <p>Pastikan sampah sudah dipilah dan siap diambil ya!</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>© 2026 ROUTE — Routing & Operational Updates for Trash Execution</p>
        </div>
      </div>
    `,
  }),
};