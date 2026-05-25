-- =============================================================
-- ROUTE — Core Migration
-- Tabel: wilayah, users, jadwal_tetap, jadwal_harian
-- Database: Supabase (PostgreSQL)
-- =============================================================

-- -------------------------------------------------------------
-- EXTENSIONS
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================
-- 1. WILAYAH
-- Master data area pengangkutan, dibuat duluan karena
-- direferensikan oleh users dan jadwal_tetap
-- =============================================================
CREATE TABLE IF NOT EXISTS wilayah (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_wilayah  VARCHAR(100)  NOT NULL,
  kecamatan     VARCHAR(100)  NOT NULL,
  kota          VARCHAR(100)  NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk filter jadwal berdasarkan wilayah
CREATE INDEX IF NOT EXISTS idx_wilayah_kota ON wilayah(kota);


-- =============================================================
-- 2. USERS
-- Satu tabel untuk semua role (warga, petugas, admin).
-- Password dikelola Supabase Auth — tabel ini menyimpan
-- data profil tambahan yang di-link ke auth.users via id.
-- =============================================================
CREATE TYPE user_role AS ENUM ('warga', 'petugas', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  role          user_role     NOT NULL DEFAULT 'warga',
  no_telepon    VARCHAR(20),
  alamat        TEXT,
  wilayah_id    UUID          REFERENCES wilayah(id) ON DELETE SET NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk filter user berdasarkan role dan wilayah
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_wilayah_id ON users(wilayah_id);

-- Trigger: auto-update kolom updated_at setiap kali baris diubah
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =============================================================
-- 3. JADWAL_TETAP
-- Template jadwal pengangkutan per wilayah per hari,
-- dikelola oleh admin dan di-assign ke satu petugas.
-- =============================================================
CREATE TYPE hari_enum AS ENUM (
  'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'
);

CREATE TABLE IF NOT EXISTS jadwal_tetap (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  wilayah_id    UUID          NOT NULL REFERENCES wilayah(id) ON DELETE CASCADE,
  petugas_id    UUID          NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  hari          hari_enum     NOT NULL,
  jam_mulai     TIME          NOT NULL,
  jam_selesai   TIME          NOT NULL,
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Satu wilayah hanya boleh punya satu jadwal tetap per hari
  CONSTRAINT uq_jadwal_tetap_wilayah_hari UNIQUE (wilayah_id, hari),
  CONSTRAINT chk_jam CHECK (jam_selesai > jam_mulai)
);

CREATE INDEX IF NOT EXISTS idx_jadwal_tetap_wilayah_id ON jadwal_tetap(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_tetap_petugas_id ON jadwal_tetap(petugas_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_tetap_hari       ON jadwal_tetap(hari);

CREATE OR REPLACE TRIGGER trg_jadwal_tetap_updated_at
  BEFORE UPDATE ON jadwal_tetap
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- =============================================================
-- 4. JADWAL_HARIAN
-- Instansi harian yang di-generate dari jadwal_tetap.
-- Petugas mengupdate status di tabel ini.
-- =============================================================
CREATE TYPE status_jadwal_harian AS ENUM (
  'terjadwal',
  'dalam_perjalanan',
  'sudah_diambil',
  'dibatalkan'
);

CREATE TABLE IF NOT EXISTS jadwal_harian (
  id                  UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
  jadwal_tetap_id     UUID                    NOT NULL REFERENCES jadwal_tetap(id) ON DELETE RESTRICT,
  petugas_id          UUID                    NOT NULL REFERENCES users(id)        ON DELETE RESTRICT,
  tanggal             DATE                    NOT NULL,
  status              status_jadwal_harian    NOT NULL DEFAULT 'terjadwal',
  catatan             TEXT,
  status_updated_at   TIMESTAMP WITH TIME ZONE,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Satu jadwal tetap hanya menghasilkan satu instansi per tanggal
  CONSTRAINT uq_jadwal_harian_per_tanggal UNIQUE (jadwal_tetap_id, tanggal)
);

CREATE INDEX IF NOT EXISTS idx_jadwal_harian_tanggal    ON jadwal_harian(tanggal);
CREATE INDEX IF NOT EXISTS idx_jadwal_harian_petugas_id ON jadwal_harian(petugas_id);
CREATE INDEX IF NOT EXISTS idx_jadwal_harian_status     ON jadwal_harian(status);

-- Trigger: catat waktu terakhir status diubah
CREATE OR REPLACE FUNCTION update_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_jadwal_harian_status
  BEFORE UPDATE ON jadwal_harian
  FOR EACH ROW EXECUTE FUNCTION update_status_updated_at();


-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- Helper function: ambil role user yang sedang login
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ── wilayah ──────────────────────────────────────────────────
ALTER TABLE wilayah ENABLE ROW LEVEL SECURITY;

-- Semua user yang login bisa membaca wilayah
CREATE POLICY "wilayah: semua bisa baca"
  ON wilayah FOR SELECT
  TO authenticated
  USING (true);

-- Hanya admin yang bisa insert / update / delete
CREATE POLICY "wilayah: hanya admin bisa tulis"
  ON wilayah FOR ALL
  TO authenticated
  USING     (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');


-- ── users ─────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- User hanya bisa membaca profilnya sendiri
CREATE POLICY "users: baca profil sendiri"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admin bisa membaca semua user
CREATE POLICY "users: admin baca semua"
  ON users FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- User hanya bisa update profilnya sendiri
CREATE POLICY "users: update profil sendiri"
  ON users FOR UPDATE
  TO authenticated
  USING     (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin bisa update semua user (misal: ganti role)
CREATE POLICY "users: admin update semua"
  ON users FOR UPDATE
  TO authenticated
  USING     (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');


-- ── jadwal_tetap ──────────────────────────────────────────────
ALTER TABLE jadwal_tetap ENABLE ROW LEVEL SECURITY;

-- Semua user login bisa membaca jadwal aktif di wilayahnya
CREATE POLICY "jadwal_tetap: warga baca wilayah sendiri"
  ON jadwal_tetap FOR SELECT
  TO authenticated
  USING (
    wilayah_id = (SELECT wilayah_id FROM users WHERE id = auth.uid())
    OR get_user_role() IN ('petugas', 'admin')
  );

-- Hanya admin yang bisa insert / update / delete
CREATE POLICY "jadwal_tetap: hanya admin bisa tulis"
  ON jadwal_tetap FOR ALL
  TO authenticated
  USING     (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');


-- ── jadwal_harian ─────────────────────────────────────────────
ALTER TABLE jadwal_harian ENABLE ROW LEVEL SECURITY;

-- Warga bisa membaca jadwal harian di wilayahnya
CREATE POLICY "jadwal_harian: warga baca wilayah sendiri"
  ON jadwal_harian FOR SELECT
  TO authenticated
  USING (
    jadwal_tetap_id IN (
      SELECT id FROM jadwal_tetap
      WHERE wilayah_id = (SELECT wilayah_id FROM users WHERE id = auth.uid())
    )
    OR get_user_role() IN ('petugas', 'admin')
  );

-- Petugas hanya bisa update jadwal yang ditugaskan ke dirinya
CREATE POLICY "jadwal_harian: petugas update miliknya"
  ON jadwal_harian FOR UPDATE
  TO authenticated
  USING     (petugas_id = auth.uid() OR get_user_role() = 'admin')
  WITH CHECK (petugas_id = auth.uid() OR get_user_role() = 'admin');

-- Hanya admin yang bisa insert / delete
CREATE POLICY "jadwal_harian: hanya admin insert delete"
  ON jadwal_harian FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "jadwal_harian: hanya admin delete"
  ON jadwal_harian FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');
