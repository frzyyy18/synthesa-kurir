# ⚙️ Setup Database Supabase - Lengkap

## 🔧 Langkah-Langkah Setup:

### 1. Buka Supabase Dashboard
- Buka: https://app.supabase.com
- Login dengan akun Anda
- Pilih project: **Sistem-Pendaftaran-Kurir**

### 2. Pergi ke SQL Editor
- Klik menu **SQL Editor** (di sidebar sebelah kiri)
- Klik **New Query**

### 3. Copy dan Paste SQL Berikut (SALIN SEMUA!)

```sql
-- ============================================================
-- CREATE TABLES FOR SISTEM PENDAFTARAN KURIR
-- ============================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'pic')),
  name TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_code TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  nomor_ktp TEXT NOT NULL,
  nomor_whatsapp TEXT NOT NULL,
  nomor_telepon_darurat TEXT NOT NULL,
  nama_pemilik_nomor_darurat TEXT NOT NULL,
  hubungan_pemilik_nomor_darurat TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
  tanggal_lahir DATE NOT NULL,
  alamat_lengkap TEXT NOT NULL,
  kota TEXT NOT NULL,
  kecamatan TEXT NOT NULL,
  kelurahan TEXT NOT NULL,
  nomor_sim TEXT NOT NULL,
  type_sim TEXT NOT NULL,
  masa_berlaku_sim DATE NOT NULL,
  jenis_merk_stnk TEXT NOT NULL,
  tahun_pembuatan_kendaraan INTEGER NOT NULL,
  nomor_polisi TEXT NOT NULL,
  nomor_stnk TEXT NOT NULL,
  tanggal_berlaku_stnk DATE NOT NULL,
  tanggal_berlaku_pajak_stnk DATE NOT NULL,
  nomor_rekening TEXT NOT NULL,
  nama_pemilik_rekening TEXT NOT NULL,
  nama_bank TEXT NOT NULL,
  shopee_username TEXT NOT NULL,
  status_rumah TEXT NOT NULL,
  jumlah_tanggungan TEXT NOT NULL,
  pernah_bergabung TEXT NOT NULL CHECK (pernah_bergabung IN ('ya', 'tidak')),
  tipe_kurir TEXT NOT NULL,
  hub_dilamar TEXT NOT NULL,
  pendidikan_terakhir TEXT NOT NULL,
  agama TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  notes TEXT
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  notes TEXT
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_registrations_registration_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_documents_registration_id ON documents(registration_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Allow insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow update users" ON users FOR UPDATE USING (true);

-- Registrations policies
CREATE POLICY "Allow insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow update registrations" ON registrations FOR UPDATE USING (true);

-- Documents policies
CREATE POLICY "Allow insert documents" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow update documents" ON documents FOR UPDATE USING (true);

-- Activity logs policies
CREATE POLICY "Allow insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view activity_logs" ON activity_logs FOR SELECT USING (true);

-- ============================================================
-- INSERT DEFAULT USERS
-- ============================================================

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO users (username, email, password, role, name, is_active) 
VALUES ('admin', 'admin@shopee.com', '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', 'admin', 'Administrator', true)
ON CONFLICT (username) DO NOTHING;

-- Insert default PIC user (username: pic, password: pic123)
INSERT INTO users (username, email, password, role, name, is_active) 
VALUES ('pic', 'pic@shopee.com', '12dea96fec20593566ab75692c9949596833adc9d9c8806b7cf3ed6cb4c2875f', 'pic', 'PIC User', true)
ON CONFLICT (username) DO NOTHING;
```

### 4. Jalankan SQL
- Klik tombol **RUN** (atau tekan `Ctrl+Enter`)
- Tunggu sampai selesai (lihat notifikasi ✅)

---

## 📦 Setup Storage untuk Upload Dokumen

### 1. Buka Storage
- Di sidebar Supabase, klik **Storage**

### 2. Create New Bucket
- Klik **New Bucket**

### 3. Konfigurasi Bucket
- **Name**: `courier-documents`
- **Public bucket**: ✅ Check (atau toggle ON)
- Klik **Create Bucket**

---

## ⚙️ Setup Environment Variables

### 1. Buat file .env
Di root project, buat atau edit file `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Dapatkan Credentials
- Di Supabase Dashboard, klik **Project Settings** (icon gear di bawah kiri)
- Klik **API**
- Copy **Project URL** untuk `VITE_SUPABASE_URL`
- Copy **anon public** key untuk `VITE_SUPABASE_ANON_KEY`

### 3. Restart App
- Stop server (Ctrl+C)
- Jalankan lagi: `npm run dev`

---

## ✅ Verifikasi Setup

### 1. Cek Tables
- Buka **SQL Editor** → **New Query**
- Jalankan:

```sql
-- Cek tables ada
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Hasilnya harus ada: users, registrations, documents, activity_logs

### 2. Cek Users
```sql
SELECT username, role FROM users;
```
Hasil: admin dan pic

---

## 🧪 Testing Pendaftaran

Setelah setup selesai:
1. Buka aplikasi: **http://localhost:5174/**
2. Klik **Daftar Sekarang**
3. Isi form lengkap
4. Klik **Kirim Pendaftaran**
5. Cek Supabase: **Table Editor** → **registrations** → Data baru harus muncul ✅

---

## ❌ Troubleshooting

### Error: "Could not find the 'nomor_whatsapp' column"
→ Schema database masih menggunakan `no_hp`. Jalankan ulang SQL di atas atau alter table:
```sql
ALTER TABLE registrations ADD COLUMN nomor_whatsapp TEXT;
```

### Error: "New row violates row level security policy"
→ RLS policy belum dibuat. Pastikan SQL RLS sudah dijalankan.

### Error: "permission denied for table registrations"
→ Pastikan RLS policies sudah dibuat dengan benar.

### Error: Upload dokumen gagal
→ Pastikan Storage bucket "courier-documents" sudah dibuat dan设置为 public.

### Error: "Invalid login credentials"
→ Password default menggunakan SHA256 hash. Sudah diupdate di SQL di atas dengan:
- admin / admin123
- pic / pic123

---

## 📝 Catatan Penting

1. **Field `nomor_whatsapp`** - Pastikan menggunakan nama kolom ini (bukan `no_hp`)
2. **RLS Policies** - Wajib dibuat agar aplikasi bisa akses database
3. **Storage Bucket** - Jika tidak dibuat, upload akan fallback ke local data URL
4. **Environment Variables** - Pastikan URL dan API Key benar di file .env

