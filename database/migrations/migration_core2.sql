-- =============================================================
-- ROUTE — Migration Part 2
-- Tabel: request_pengangkutan, riwayat_pengangkutan,
--        artikel_edukasi, pengumuman
--
-- PENTING: Jalankan SETELAH migration_core.sql
-- (yang sudah mendefinisikan wilayah, users,
--  jadwal_tetap, jadwal_harian, dan fungsi update_updated_at)
-- =============================================================


-- =============================================================
-- 5. REQUEST_PENGANGKUTAN
-- Permintaan pengangkutan tambahan dari warga, di luar
-- jadwal tetap. Admin/petugas bisa approve/reject/jadwalkan.
-- =============================================================

CREATE TYPE jenis_sampah_enum AS ENUM (
  'organik_basah',
  'organik_kering',
  'minyak_jelantah',
  'campuran'
);

CREATE TYPE estimasi_jumlah_enum AS ENUM (
  'kecil',    -- < 5 kg / 5 L
  'sedang',   -- 5–20 kg / L
  'besar'     -- > 20 kg / L
);

CREATE TYPE status_request_enum AS ENUM (
  'pending',
  'disetujui',
  'dijadwalkan',
  'selesai',
  'ditolak'
);

CREATE TABLE IF NOT EXISTS request_pengangkutan (
  id                  UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID                    NOT NULL REFERENCES users(id)          ON DELETE CASCADE,
  wilayah_id          UUID                    NOT NULL REFERENCES wilayah(id)        ON DELETE RESTRICT,
  jadwal_harian_id    UUID                             REFERENCES jadwal_harian(id)  ON DELETE SET NULL,
  jenis_sampah        TEXT                    NOT NULL,   -- free text (frontend maps to enum labels)
  estimasi_jumlah     TEXT                    NOT NULL,   -- free text e.g. "5 kg"
  catatan             TEXT,
  status              status_request_enum     NOT NULL DEFAULT 'pending',
  alasan_penolakan    TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_request_user_id       ON request_pengangkutan(user_id);
CREATE INDEX IF NOT EXISTS idx_request_wilayah_id    ON request_pengangkutan(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_request_status        ON request_pengangkutan(status);
CREATE INDEX IF NOT EXISTS idx_request_created_at    ON request_pengangkutan(created_at DESC);

CREATE OR REPLACE TRIGGER trg_request_updated_at
  BEFORE UPDATE ON request_pengangkutan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── RLS: request_pengangkutan ─────────────────────────────────
ALTER TABLE request_pengangkutan ENABLE ROW LEVEL SECURITY;

-- Warga hanya bisa baca request miliknya sendiri
CREATE POLICY "request: warga baca miliknya"
  ON request_pengangkutan FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR get_user_role() IN ('petugas', 'admin'));

-- Warga bisa insert request untuk dirinya sendiri
CREATE POLICY "request: warga bisa insert"
  ON request_pengangkutan FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND get_user_role() = 'warga');

-- Admin & petugas bisa update status
CREATE POLICY "request: admin petugas bisa update"
  ON request_pengangkutan FOR UPDATE
  TO authenticated
  USING     (get_user_role() IN ('admin', 'petugas'))
  WITH CHECK (get_user_role() IN ('admin', 'petugas'));

-- Hanya admin yang bisa delete
CREATE POLICY "request: admin bisa delete"
  ON request_pengangkutan FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');


-- =============================================================
-- 6. RIWAYAT_PENGANGKUTAN
-- Log setiap kejadian pengangkutan — baik dari jadwal tetap
-- maupun dari request. Dibuat oleh petugas saat selesai.
-- =============================================================

CREATE TYPE tipe_riwayat_enum AS ENUM (
  'jadwal_tetap',
  'request'
);

CREATE TABLE IF NOT EXISTS riwayat_pengangkutan (
  id                  UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID                    NOT NULL REFERENCES users(id)                   ON DELETE CASCADE,
  jadwal_harian_id    UUID                    NOT NULL REFERENCES jadwal_harian(id)           ON DELETE RESTRICT,
  request_id          UUID                             REFERENCES request_pengangkutan(id)    ON DELETE SET NULL,
  tipe                tipe_riwayat_enum       NOT NULL,
  waktu_pengambilan   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  catatan_petugas     TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riwayat_user_id           ON riwayat_pengangkutan(user_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_jadwal_harian_id  ON riwayat_pengangkutan(jadwal_harian_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_created_at        ON riwayat_pengangkutan(created_at DESC);


-- ── RLS: riwayat_pengangkutan ─────────────────────────────────
ALTER TABLE riwayat_pengangkutan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "riwayat: warga baca miliknya"
  ON riwayat_pengangkutan FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR get_user_role() IN ('petugas', 'admin'));

CREATE POLICY "riwayat: petugas admin bisa insert"
  ON riwayat_pengangkutan FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role() IN ('petugas', 'admin'));

CREATE POLICY "riwayat: admin bisa delete"
  ON riwayat_pengangkutan FOR DELETE
  TO authenticated
  USING (get_user_role() = 'admin');


-- =============================================================
-- 7. ARTIKEL_EDUKASI
-- Konten edukasi tentang pengelolaan sampah. Ditulis oleh admin,
-- dipublikasikan ke halaman Education.
-- =============================================================

CREATE TABLE IF NOT EXISTS artikel_edukasi (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  penulis_id      UUID          NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  judul           VARCHAR(255)  NOT NULL,
  konten          TEXT          NOT NULL,
  kategori        VARCHAR(100),
  thumbnail_url   VARCHAR(500),
  is_published    BOOLEAN       NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artikel_is_published  ON artikel_edukasi(is_published);
CREATE INDEX IF NOT EXISTS idx_artikel_published_at  ON artikel_edukasi(published_at DESC);

CREATE OR REPLACE TRIGGER trg_artikel_updated_at
  BEFORE UPDATE ON artikel_edukasi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── RLS: artikel_edukasi ──────────────────────────────────────
ALTER TABLE artikel_edukasi ENABLE ROW LEVEL SECURITY;

-- Semua orang (termasuk anon) bisa membaca artikel yang sudah dipublikasikan
CREATE POLICY "artikel: semua bisa baca yang published"
  ON artikel_edukasi FOR SELECT
  USING (is_published = TRUE);

-- Admin login bisa membaca semua (termasuk draft)
CREATE POLICY "artikel: admin baca semua"
  ON artikel_edukasi FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- Hanya admin yang bisa insert / update / delete
CREATE POLICY "artikel: admin bisa tulis"
  ON artikel_edukasi FOR ALL
  TO authenticated
  USING     (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');


-- =============================================================
-- 8. PENGUMUMAN
-- Pengumuman resmi dari admin ke semua pengguna.
-- Ditampilkan di halaman Announcements dan dashboard.
-- =============================================================

CREATE TYPE tipe_pengumuman_enum AS ENUM (
  'kebijakan',
  'jadwal',
  'sampah',
  'umum'
);

CREATE TABLE IF NOT EXISTS pengumuman (
  id              UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id        UUID                    NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  judul           VARCHAR(255)            NOT NULL,
  isi             TEXT                    NOT NULL,
  tipe            TEXT                    NOT NULL DEFAULT 'umum',  -- free text to match frontend TYPES array
  is_active       BOOLEAN                 NOT NULL DEFAULT TRUE,
  berlaku_mulai   TIMESTAMP WITH TIME ZONE,
  berlaku_sampai  TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pengumuman_is_active   ON pengumuman(is_active);
CREATE INDEX IF NOT EXISTS idx_pengumuman_created_at  ON pengumuman(created_at DESC);


-- ── RLS: pengumuman ───────────────────────────────────────────
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;

-- Semua orang (anon + auth) bisa membaca pengumuman aktif
CREATE POLICY "pengumuman: semua bisa baca yang aktif"
  ON pengumuman FOR SELECT
  USING (is_active = TRUE);

-- Admin login bisa membaca semua
CREATE POLICY "pengumuman: admin baca semua"
  ON pengumuman FOR SELECT
  TO authenticated
  USING (get_user_role() = 'admin');

-- Hanya admin yang bisa insert / update / delete
CREATE POLICY "pengumuman: admin bisa tulis"
  ON pengumuman FOR ALL
  TO authenticated
  USING     (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');