-- =============================================================
-- ROUTE — Core Seed Data
-- Password semua akun dev: Route1234!
-- Jalankan di Supabase SQL Editor (satu kali, dev only).
-- =============================================================


-- =============================================================
-- 1. WILAYAH
-- =============================================================
INSERT INTO wilayah (id, nama_wilayah, kecamatan, kota) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Kelurahan Renon',     'Denpasar Selatan', 'Denpasar'),
  ('a1000000-0000-0000-0000-000000000002', 'Kelurahan Sanur',     'Denpasar Selatan', 'Denpasar'),
  ('a1000000-0000-0000-0000-000000000003', 'Kelurahan Pemecutan', 'Denpasar Barat',   'Denpasar'),
  ('a1000000-0000-0000-0000-000000000004', 'Kelurahan Dauh Puri', 'Denpasar Barat',   'Denpasar'),
  ('a1000000-0000-0000-0000-000000000005', 'Kelurahan Kesiman',   'Denpasar Timur',   'Denpasar')
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 2. USERS
-- WHERE NOT EXISTS guards the auth.users insert so re-running
-- the seed never creates duplicate accounts.
-- =============================================================

-- ── Admin ─────────────────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Admin ROUTE","role":"admin"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Admin ROUTE', 'admin@route.dev', 'admin',
       '081200000001', 'Kantor Dinas Lingkungan Hidup, Denpasar', NULL
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Petugas Renon ─────────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'petugas.renon@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"I Made Sudana","role":"petugas"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'petugas.renon@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'I Made Sudana', 'petugas.renon@route.dev', 'petugas',
       '081200000002', 'Jl. Raya Renon No. 12, Denpasar',
       'a1000000-0000-0000-0000-000000000001'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Petugas Sanur ─────────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'petugas.sanur@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Ni Wayan Sari","role":"petugas"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'petugas.sanur@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Ni Wayan Sari', 'petugas.sanur@route.dev', 'petugas',
       '081200000003', 'Jl. Danau Tamblingan No. 5, Sanur',
       'a1000000-0000-0000-0000-000000000002'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Petugas Pemecutan ─────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'petugas.pemecutan@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Ketut Wirawan","role":"petugas"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'petugas.pemecutan@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Ketut Wirawan', 'petugas.pemecutan@route.dev', 'petugas',
       '081200000004', 'Jl. Gunung Agung No. 8, Denpasar Barat',
       'a1000000-0000-0000-0000-000000000003'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Warga 1 (Renon) ───────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'warga1@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Budi Santoso","role":"warga"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'warga1@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Budi Santoso', 'warga1@route.dev', 'warga',
       '081200000005', 'Jl. Tukad Badung No. 3, Renon',
       'a1000000-0000-0000-0000-000000000001'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Warga 2 (Sanur) ───────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'warga2@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Putu Ayu Lestari","role":"warga"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'warga2@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Putu Ayu Lestari', 'warga2@route.dev', 'warga',
       '081200000006', 'Jl. Segara Ayu No. 7, Sanur',
       'a1000000-0000-0000-0000-000000000002'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Warga 3 (Pemecutan) ───────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'warga3@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Agus Permana","role":"warga"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'warga3@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Agus Permana', 'warga3@route.dev', 'warga',
       '081200000007', 'Jl. Gunung Salak No. 15, Pemecutan',
       'a1000000-0000-0000-0000-000000000003'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Warga 4 (Dauh Puri) ───────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'warga4@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Dewi Rahayu","role":"warga"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'warga4@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Dewi Rahayu', 'warga4@route.dev', 'warga',
       '081200000008', 'Jl. Nusa Indah No. 22, Dauh Puri',
       'a1000000-0000-0000-0000-000000000004'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- ── Warga 5 (Kesiman) ─────────────────────────────────────────
WITH new_user AS (
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data,
    is_super_admin, confirmation_token, recovery_token,
    email_change_token_new, email_change
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'warga5@route.dev',
    crypt('Route1234!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"nama":"Wayan Eka Putra","role":"warga"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    FALSE, '', '', '', ''
  WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'warga5@route.dev')
  RETURNING id
)
INSERT INTO public.users (id, nama, email, role, no_telepon, alamat, wilayah_id)
SELECT id, 'Wayan Eka Putra', 'warga5@route.dev', 'warga',
       '081200000009', 'Jl. WR Supratman No. 9, Kesiman',
       'a1000000-0000-0000-0000-000000000005'
FROM new_user
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- 3. JADWAL_TETAP
-- petugas_id resolved by email — no hardcoded UUIDs needed.
-- =============================================================
INSERT INTO jadwal_tetap (id, wilayah_id, petugas_id, hari, jam_mulai, jam_selesai, is_active)
SELECT
  c.id::UUID,
  c.wilayah_id::UUID,
  u.id,
  c.hari::hari_enum,
  c.jam_mulai::TIME,
  c.jam_selesai::TIME,
  TRUE
FROM (VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'petugas.renon@route.dev',     'senin',  '07:00', '10:00'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'petugas.renon@route.dev',     'rabu',   '07:00', '10:00'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'petugas.renon@route.dev',     'jumat',  '07:00', '10:00'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'petugas.sanur@route.dev',     'selasa', '08:00', '11:00'),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'petugas.sanur@route.dev',     'kamis',  '08:00', '11:00'),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'petugas.sanur@route.dev',     'sabtu',  '08:00', '11:00'),
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'petugas.pemecutan@route.dev', 'senin',  '06:30', '09:30'),
  ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'petugas.pemecutan@route.dev', 'rabu',   '06:30', '09:30'),
  ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'petugas.pemecutan@route.dev', 'sabtu',  '06:30', '09:30')
) AS c(id, wilayah_id, petugas_email, hari, jam_mulai, jam_selesai)
JOIN public.users u ON u.email = c.petugas_email
ON CONFLICT (wilayah_id, hari) DO NOTHING;


-- =============================================================
-- 4. JADWAL_HARIAN
-- Dates calculated relative to current week — always fresh.
-- =============================================================
INSERT INTO jadwal_harian (id, jadwal_tetap_id, petugas_id, tanggal, status)
SELECT
  h.id::UUID,
  h.jadwal_tetap_id::UUID,
  u.id,
  (CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INT + h.offset_days)::DATE,
  h.status::status_jadwal_harian
FROM (VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'petugas.renon@route.dev',     1, 'sudah_diambil'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'petugas.renon@route.dev',     3, 'sudah_diambil'),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'petugas.renon@route.dev',     5, 'dalam_perjalanan'),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'petugas.sanur@route.dev',     2, 'sudah_diambil'),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'petugas.sanur@route.dev',     4, 'terjadwal'),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000007', 'petugas.pemecutan@route.dev', 1, 'dibatalkan'),
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000008', 'petugas.pemecutan@route.dev', 3, 'sudah_diambil')
) AS h(id, jadwal_tetap_id, petugas_email, offset_days, status)
JOIN public.users u ON u.email = h.petugas_email
ON CONFLICT (jadwal_tetap_id, tanggal) DO NOTHING;