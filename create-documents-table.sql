-- ============================================================
-- CREATE DOCUMENTS TABLE
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create documents table (if not exists)
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_registration_id ON documents(registration_id);

-- ============================================================
-- RLS POLICIES FOR DOCUMENTS
-- ============================================================

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert documents
CREATE POLICY "Allow insert documents" ON documents FOR INSERT WITH CHECK (true);

-- Allow anyone to view documents
CREATE POLICY "Allow view documents" ON documents FOR SELECT USING (true);

-- Allow anyone to update documents
CREATE POLICY "Allow update documents" ON documents FOR UPDATE USING (true);

-- ============================================================
-- ✅ DONE
-- ============================================================

