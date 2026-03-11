# Sistem Pendaftaran Kurir Shopee Express

A React-based registration system for Shopee Express couriers built with TypeScript, Vite, and Supabase.

## Features

- User registration with document upload
- Admin dashboard for managing registrations
- Real-time status updates
- Activity logging
- Excel export functionality

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/ui components
- **Backend**: Supabase (Database + Storage + Auth)
- **State Management**: React hooks

## Setup

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get your credentials

4. Create environment variables file `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Supabase Setup

#### Database Tables

Create the following tables in your Supabase database:

**users**
```sql
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
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**registrations**
```sql
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_code TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  nomor_ktp TEXT NOT NULL,
  no_hp TEXT NOT NULL,
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
```

**documents**
```sql
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
```

**activity_logs** (Optional - system will work without it)
```sql
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
```

#### Storage Bucket Setup

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `courier-documents`
3. Set the bucket to **Public** (uncheck "Private")
4. Configure CORS policies if needed

**Important**: If the storage bucket is not properly configured, the system will automatically fallback to local data URLs for file storage. Documents will still be "uploaded" but stored locally in the browser.

#### Default Admin User

Insert this default admin user:

```sql
INSERT INTO users (username, email, password, role, name, is_active) VALUES
('admin', 'admin@shopee.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator', true);
```

Password: `admin123` (hashed)

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Default Credentials

- **Admin**: `admin` / `admin123`
- **PIC**: `pic` / `pic123` (if created)

## Features Overview

### User Registration
- Multi-step form with validation
- Document upload (9 required documents)
- Real-time form validation
- Email/WhatsApp notifications

### Admin Dashboard
- View all registrations
- Filter by status
- Document verification
- Approval/rejection workflow
- Activity logging
- Excel export

### Document Management
- Secure file upload to Supabase Storage
- Automatic fallback to local storage if cloud storage unavailable
- Image preview and download
- File validation (size, type)

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
├── services/      # API and external service integrations
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

### Key Services

- **DatabaseService**: Supabase database operations
- **UploadService**: File upload handling with fallback
- **NotificationService**: Email and WhatsApp notifications
- **AuthService**: User authentication
- **ExportService**: Excel export functionality

## Troubleshooting

### Storage Issues
If file uploads fail with 400 errors:
1. Ensure the `courier-documents` bucket exists in Supabase Storage
2. Make sure the bucket is set to public access
3. Check CORS policies in Supabase

The system will automatically fallback to local storage if cloud storage is unavailable.

### Database Connection
- Verify your Supabase URL and anon key in `.env`
- Ensure all required tables are created
- Check Row Level Security (RLS) policies if needed

## License

This project is for educational/demonstration purposes.
