# ROUTE — Routing & Operational Updates for Trash Execution

Sistem koordinasi pengangkutan sampah berbasis web untuk mendukung kebijakan sampah organik Bali.

## Tim Pengembang

**TP-G009 | Capstone Project Dicoding x Tempa**

- Angelica Audeska Sali — Frontend (WDC014B6X0026)
- Firmanda Arbito — Backend (WDC284B6Y0007)
- Shofy Naila Az Zahra — Backend (WDC223B6X0003)

## Tentang Proyek

ROUTE menghubungkan warga, petugas pengangkut, dan admin dalam satu platform untuk membuat pengangkutan sampah lebih teratur, transparan, dan efisien.

**Fitur yang sudah diimplementasi (Minggu 1–3):**
- Autentikasi pengguna (login & register dengan role)
- Dashboard warga, petugas, dan admin
- Manajemen jadwal pengangkutan
- Pemantauan status pengangkutan real-time
- Pengajuan request pengangkutan tambahan
- Dashboard petugas (jadwal harian & daftar request)

**Fitur yang sedang dikembangkan (Minggu 4–5):**
- Halaman edukasi pengelolaan sampah
- Fitur riwayat aktivitas
- Fitur pengumuman admin
- Integrasi notifikasi email
- Integrasi frontend–backend penuh (Supabase)

## Teknologi

- **Frontend:** React.js, TanStack Router, Tailwind CSS
- **Backend:** Node.js, Supabase (PostgreSQL)
- **Tools:** Vite, TypeScript

## Cara Menjalankan

### Prasyarat
- Node.js 18+
- Bun (direkomendasikan) atau npm

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd bali-waste-smart-main

# Install dependencies
bun install
# atau: npm install

# Jalankan development server
bun run dev
# atau: npm run dev
```

> **Catatan:** Saat ini aplikasi berjalan dengan data mock. 
