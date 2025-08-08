-- 1. Create pelaku_usaha table
CREATE TABLE IF NOT EXISTS pelaku_usaha (
  id BIGSERIAL PRIMARY KEY,
  nama_pemilik TEXT NOT NULL,
  jenis_lapak TEXT NOT NULL CHECK (jenis_lapak IN ('Kios', 'Los', 'PKL')),
  lokasi TEXT NOT NULL,
  jenis_dagangan TEXT NOT NULL,
  uttp_1_jenis TEXT DEFAULT '',
  uttp_1_merk TEXT DEFAULT '',
  uttp_1_kondisi TEXT DEFAULT '' CHECK (uttp_1_kondisi IN ('', 'Baik', 'Rusak')),
  uttp_1_tahun_tera INTEGER,
  uttp_2_jenis TEXT DEFAULT '',
  uttp_2_merk TEXT DEFAULT '',
  uttp_2_kondisi TEXT DEFAULT '' CHECK (uttp_2_kondisi IN ('', 'Baik', 'Rusak')),
  uttp_2_tahun_tera INTEGER,
  uttp_3_jenis TEXT DEFAULT '',
  uttp_3_merk TEXT DEFAULT '',
  uttp_3_kondisi TEXT DEFAULT '' CHECK (uttp_3_kondisi IN ('', 'Baik', 'Rusak')),
  uttp_3_tahun_tera INTEGER,
  jumlah_te INTEGER DEFAULT 0,
  jumlah_tm INTEGER DEFAULT 0,
  jumlah_cb INTEGER DEFAULT 0,
  jumlah_tbi INTEGER DEFAULT 0,
  jumlah_tf INTEGER DEFAULT 0,
  jumlah_dl INTEGER DEFAULT 0,
  jumlah_at INTEGER DEFAULT 0,
  catatan TEXT DEFAULT '',
  tanggal_tera_terakhir DATE DEFAULT CURRENT_DATE,
  tanggal_exp_tera DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
  status_tera TEXT DEFAULT 'Aktif' CHECK (status_tera IN ('Aktif', 'Perlu Tera Ulang', 'Tidak Aktif')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create artikel table
CREATE TABLE IF NOT EXISTS artikel (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  gambar_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create notifikasi table
CREATE TABLE IF NOT EXISTS notifikasi (
  id BIGSERIAL PRIMARY KEY,
  jenis TEXT NOT NULL CHECK (jenis IN ('permohonan_baru', 'tera_exp_warning', 'tera_expired')),
  judul TEXT NOT NULL,
  pesan TEXT NOT NULL,
  pelaku_usaha_id BIGINT REFERENCES pelaku_usaha(id) ON DELETE CASCADE,
  dibaca BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create permohonan_tera table
CREATE TABLE IF NOT EXISTS permohonan_tera (
  id BIGSERIAL PRIMARY KEY,
  nama_pemohon TEXT NOT NULL,
  email TEXT NOT NULL,
  telepon TEXT NOT NULL,
  jenis_permohonan TEXT NOT NULL CHECK (jenis_permohonan IN ('tera_baru', 'tera_ulang')),
  deskripsi TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE pelaku_usaha ENABLE ROW LEVEL SECURITY;
ALTER TABLE artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE permohonan_tera ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Open policies (ubah sesuai kebutuhan keamanan produksi)
CREATE POLICY "Allow all on pelaku_usaha" ON pelaku_usaha FOR ALL USING (true);
CREATE POLICY "Allow all on artikel" ON artikel FOR ALL USING (true);
CREATE POLICY "Allow all on notifikasi" ON notifikasi FOR ALL USING (true);
CREATE POLICY "Allow all on permohonan_tera" ON permohonan_tera FOR ALL USING (true);
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);

-- 8. Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Attach Trigger
CREATE TRIGGER update_pelaku_usaha_updated_at
BEFORE UPDATE ON pelaku_usaha
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artikel_updated_at
BEFORE UPDATE ON artikel
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 10. Insert sample data
INSERT INTO pelaku_usaha (nama_pemilik, jenis_lapak, lokasi, jenis_dagangan, uttp_1_jenis, uttp_1_merk, uttp_1_kondisi, uttp_1_tahun_tera, jumlah_te, jumlah_tm, tanggal_tera_terakhir, tanggal_exp_tera)
VALUES
('Budi Santoso', 'Kios', 'Blok A-15', 'Kelontong', 'Timbangan Elektronik', 'Sonic', 'Baik', 2024, 2, 1, '2024-01-15', '2025-01-15'),
('Siti Aminah', 'Los', 'Blok B-08', 'Sayur', 'Timbangan Manual', 'Camry', 'Baik', 2023, 1, 2, '2023-06-10', '2024-06-10'),
('Ahmad Wijaya', 'PKL', 'Area C-12', 'Daging', 'Timbangan Floor', 'Digital', 'Baik', 2024, 0, 0, '2024-03-20', '2025-03-20');

INSERT INTO artikel (judul, konten, excerpt, status)
VALUES
('Pentingnya Kalibrasi UTTP untuk Keadilan Perdagangan', 'Kalibrasi UTTP penting...', 'Kalibrasi untuk keadilan.', 'published'),
('Jadwal Tera Ulang Tahun 2024', 'Jadwal lengkap tera ulang...', 'Jadwal terbaru UTTP.', 'published'),
('Tips Merawat Alat Timbang Agar Awet', 'Tips merawat alat timbang...', 'Perawatan alat timbang.', 'draft');

INSERT INTO notifikasi (jenis, judul, pesan, pelaku_usaha_id)
VALUES
('tera_exp_warning', 'Peringatan Tera Akan Berakhir', 'UTTP milik Siti Aminah akan berakhir masa teranya dalam 3 bulan (Juni 2024)', 2),
('permohonan_baru', 'Permohonan Tera Baru', 'Ada permohonan tera baru dari Toko Makmur Jaya', NULL);

INSERT INTO permohonan_tera (nama_pemohon, email, telepon, jenis_permohonan, deskripsi)
VALUES
('Toko Makmur Jaya', 'makmur@email.com', '081234567890', 'tera_baru', 'Permohonan tera untuk timbangan elektronik baru');

INSERT INTO users (id, email, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@kemetrologian.go.id', 'admin');

-- 11. Function to generate notification for expiring tera (avoid duplicates)
CREATE OR REPLACE FUNCTION generate_tera_notifications()
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifikasi (jenis, judul, pesan, pelaku_usaha_id)
  SELECT
    'tera_exp_warning',
    'Peringatan Tera Akan Berakhir',
    FORMAT('UTTP milik %s akan berakhir masa teranya pada %s', p.nama_pemilik, TO_CHAR(p.tanggal_exp_tera, 'DD Mon YYYY')),
    p.id
  FROM pelaku_usaha p
  WHERE
    p.tanggal_exp_tera BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
    AND NOT EXISTS (
      SELECT 1 FROM notifikasi n
      WHERE n.pelaku_usaha_id = p.id
      AND n.jenis = 'tera_exp_warning'
      AND DATE(n.created_at) = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;
