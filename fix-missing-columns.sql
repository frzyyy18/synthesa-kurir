-- SQL untuk menambahkan kolom yang hilang ke tabel registrations
-- Jalankan ini di Supabase SQL Editor jika tabel sudah ada

-- Tambahkan kolom tipe_kurir jika belum ada
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS tipe_kurir TEXT;

-- Tambahkan kolom hub_dilamar jika belum ada
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS hub_dilamar TEXT;

-- Tambahkan kolom nomor_whatsapp jika belum ada (ganti no_hp)
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS nomor_whatsapp TEXT;

-- Jika masih menggunakan no_hp, salin datanya ke nomor_whatsapp
UPDATE registrations SET nomor_whatsapp = no_hp WHERE nomor_whatsapp IS NULL AND no_hp IS NOT NULL;

