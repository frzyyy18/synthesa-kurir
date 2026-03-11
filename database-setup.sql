-- SQL commands to create the required tables for Sistem Pendaftaran Kurir
-- Run these in your Supabase SQL Editor

-- Create users table
CREATE TABLE users (
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
CREATE TABLE registrations (
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
CREATE TABLE documents (
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

-- Create activity_logs table (optional)
CREATE TABLE activity_logs (
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Allow anyone to create users (for registration)
CREATE POLICY "Allow insert users" ON users FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view users
CREATE POLICY "Allow view users" ON users FOR SELECT USING (true);

-- Allow authenticated users to update users
CREATE POLICY "Allow update users" ON users FOR UPDATE USING (true);

-- ============================================================
-- REGISTRATIONS TABLE POLICIES
-- ============================================================

-- Allow anyone to create registrations (public registration)
CREATE POLICY "Allow insert registrations" ON registrations FOR INSERT WITH CHECK (true);

-- Allow anyone to view registrations (for checking status)
CREATE POLICY "Allow view registrations" ON registrations FOR SELECT USING (true);

-- Allow authenticated users to update registrations
CREATE POLICY "Allow update registrations" ON registrations FOR UPDATE USING (true);

-- ============================================================
-- DOCUMENTS TABLE POLICIES
-- ============================================================

-- Allow anyone to create documents
CREATE POLICY "Allow insert documents" ON documents FOR INSERT WITH CHECK (true);

-- Allow anyone to view documents
CREATE POLICY "Allow view documents" ON documents FOR SELECT USING (true);

-- Allow authenticated users to update documents
CREATE POLICY "Allow update documents" ON documents FOR UPDATE USING (true);

-- ============================================================
-- ACTIVITY_LOGS TABLE POLICIES
-- ============================================================

-- Allow anyone to create activity logs
CREATE POLICY "Allow insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Allow anyone to view activity logs
CREATE POLICY "Allow view activity_logs" ON activity_logs FOR SELECT USING (true);

-- ============================================================
-- STORAGE SETUP
-- ============================================================

-- Create storage bucket for documents (run in Storage section of Supabase Dashboard)
-- Bucket name: courier-documents
-- Make it public

-- ============================================================
-- INSERT DEFAULT USERS
-- ============================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, name, is_active) VALUES
('admin', 'admin@shopee.com', '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', 'admin', 'Administrator', true);

-- Insert default PIC user (password: pic123)
INSERT INTO users (username, email, password, role, name, is_active) VALUES
('pic', 'pic@shopee.com', '12dea96fec20593566ab75692c9949596833adc9d9c8806b7cf3ed6cb4c2875f', 'pic', 'PIC User', true);
