-- =============================================================
-- ROUTE — Core Seed Data
-- Tabel: wilayah, users, jadwal_tetap, jadwal_harian
-- 
-- PENTING: Jalankan SETELAH migration_core.sql
-- Seed ini menggunakan UUID statis agar relasi antar tabel
-- konsisten dan mudah di-debug saat development.
-- =============================================================


-- =============================================================
-- 1. WILAYAH (5 area simulasi di Denpasar)
-- =============================================================
INSERT INTO wilayah (id, nama_wilayah, kecamatan, kota) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Kelurahan Renon',       'Denpasar Selatan', 'Denpasar'),
  ('a1000000-0000-0000-0000-000000000002', 'Kelurahan Sanur',       'Denpasar Selatan', 'Denpasar'),
  ('a1000000-0000-0000-0000-000000000003', 'Kelurahan Pemecutan',   'Denpasar Barat',   'Denpasar'),
  ('a1000000-0000-0000-0000-000000000004', 'Kelurahan Dauh Puri',   'Denpasar Barat',   'Denpasar'),
  ('a1000000-0000-0000-0000-000000000005', 'Kelurahan Kesiman',     'Denpasar Timur',   'Denpasar');


-- =============================================================
-- 2. USERS
-- 
-- Catatan Supabase Auth:
-- Pada environment production, user dibuat via Supabase Auth
-- (signUp) dan tabel ini diisi otomatis via trigger/function.
-- Untuk keperluan seed development, insert langsung ke tabel
-- users dengan UUID yang sama seperti yang ada di auth.users.
--
-- Cara membuat user dev di Supabase dashboard:
--   Authentication → Users → Invite / Add User
--   Lalu salin UUID yang digenerate ke seed di bawah.
--
-- UUID di bawah adalah PLACEHOLDER — ganti dengan UUID asli
-- dari Supabase Auth sebelum menjalankan seed ini.
-- =============================================================

-- Admin (1)
INSERT INTO users (id, nama, email, role, no_telepon, alamat, wilayah_id) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Admin ROUTE',
    'admin@route.dev',
    'admin',
    '081200000001',
    'Kantor Dinas Lingkungan Hidup, Denpasar',
    NULL  -- admin tidak terikat satu wilayah
  );

-- Petugas (3) — masing-masing di-assign ke wilayah berbeda
INSERT INTO users (id, nama, email, role, no_telepon, alamat, wilayah_id) VALUES
  (
    'b1000000-0000-0000-0000-000000000002',
    'I Made Sudana',
    'petugas.renon@route.dev',
    'petugas',
    '081200000002',
    'Jl. Raya Renon No. 12, Denpasar',
    'a1000000-0000-0000-0000-000000000001'  -- Renon
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Ni Wayan Sari',
    'petugas.sanur@route.dev',
    'petugas',
    '081200000003',
    'Jl. Danau Tamblingan No. 5, Sanur',
    'a1000000-0000-0000-0000-000000000002'  -- Sanur
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Ketut Wirawan',
    'petugas.pemecutan@route.dev',
    'petugas',
    '081200000004',
    'Jl. Gunung Agung No. 8, Denpasar Barat',
    'a1000000-0000-0000-0000-000000000003'  -- Pemecutan
  );

-- Warga (5)
INSERT INTO users (id, nama, email, role, no_telepon, alamat, wilayah_id) VALUES
  (
    'b1000000-0000-0000-0000-000000000005',
    'Budi Santoso',
    'warga1@route.dev',
    'warga',
    '081200000005',
    'Jl. Tukad Badung No. 3, Renon',
    'a1000000-0000-0000-0000-000000000001'  -- Renon
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'Putu Ayu Lestari',
    'warga2@route.dev',
    'warga',
    '081200000006',
    'Jl. Segara Ayu No. 7, Sanur',
    'a1000000-0000-0000-0000-000000000002'  -- Sanur
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'Agus Permana',
    'warga3@route.dev',
    'warga',
    '081200000007',
    'Jl. Gunung Salak No. 15, Pemecutan',
    'a1000000-0000-0000-0000-000000000003'  -- Pemecutan
  ),
  (
    'b1000000-0000-0000-0000-000000000008',
    'Dewi Rahayu',
    'warga4@route.dev',
    'warga',
    '081200000008',
    'Jl. Nusa Indah No. 22, Dauh Puri',
    'a1000000-0000-0000-0000-000000000004'  -- Dauh Puri
  ),
  (
    'b1000000-0000-0000-0000-000000000009',
    'Wayan Eka Putra',
    'warga5@route.dev',
    'warga',
    '081200000009',
    'Jl. WR Supratman No. 9, Kesiman',
    'a1000000-0000-0000-0000-000000000005'  -- Kesiman
  );


-- =============================================================
-- 3. JADWAL_TETAP
-- Setiap wilayah dapat 3 hari pengangkutan per minggu
-- =============================================================
INSERT INTO jadwal_tetap (id, wilayah_id, petugas_id, hari, jam_mulai, jam_selesai, is_active) VALUES
  -- Renon: Senin, Rabu, Jumat
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'senin',  '07:00', '10:00', TRUE),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'rabu',   '07:00', '10:00', TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'jumat',  '07:00', '10:00', TRUE),

  -- Sanur: Selasa, Kamis, Sabtu
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'selasa', '08:00', '11:00', TRUE),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'kamis',  '08:00', '11:00', TRUE),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'sabtu',  '08:00', '11:00', TRUE),

  -- Pemecutan: Senin, Rabu, Sabtu
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'senin',  '06:30', '09:30', TRUE),
  ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'rabu',   '06:30', '09:30', TRUE),
  ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'sabtu',  '06:30', '09:30', TRUE);


-- =============================================================
-- 4. JADWAL_HARIAN
-- Contoh instansi untuk minggu ini (simulasi tanggal statis)
-- Dalam production, baris ini digenerate otomatis oleh
-- scheduled function / cron job di Supabase Edge Functions.
-- =============================================================
INSERT INTO jadwal_harian (id, jadwal_tetap_id, petugas_id, tanggal, status) VALUES
  -- Renon — Senin 19 Mei 2025 (sudah selesai)
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', '2025-05-19', 'sudah_diambil'),
  -- Renon — Rabu 21 Mei 2025 (sudah selesai)
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', '2025-05-21', 'sudah_diambil'),
  -- Renon — Jumat 23 Mei 2025 (sedang berjalan hari ini)
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', '2025-05-23', 'dalam_perjalanan'),

  -- Sanur — Selasa 20 Mei 2025 (sudah selesai)
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', '2025-05-20', 'sudah_diambil'),
  -- Sanur — Kamis 22 Mei 2025 (terjadwal)
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', '2025-05-22', 'terjadwal'),

  -- Pemecutan — Senin 19 Mei 2025 (dibatalkan, simulasi kasus gagal)
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000004', '2025-05-19', 'dibatalkan'),
  -- Pemecutan — Rabu 21 Mei 2025 (sudah selesai)
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000004', '2025-05-21', 'sudah_diambil');
