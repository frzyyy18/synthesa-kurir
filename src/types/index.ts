// Tipe Data untuk Sistem Pendaftaran Kurir Shopee Express

export type UserRole = 'admin' | 'pic';
export type RegistrationStatus = 'pending' | 'verified' | 'approved' | 'rejected';
export type CourierType = 'rider_mitra' | 'rider_mitra_plus' | 'rider_dedicated' | 'driver_mitra' | 'driver_dedicated';
export type Gender = 'L' | 'P';
export type Religion = 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu';
export type Education = 'sd' | 'smp' | 'sma' | 'd1' | 'd2' | 'd3' | 's1' | 's2' | 's3';
export type HouseStatus = 'milik_sendiri' | 'sewa' | 'kontrak' | 'keluarga' | 'lainnya';
export type YesNo = 'ya' | 'tidak';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Registration {
  id: string;
  registrationCode: string;
  
  // 1. Email
  email: string;
  
  // 2. Pernah bergabung di Shopee Express
  pernahBergabung: YesNo;
  
  // 3. Jenis Kurir
  jenisKurir: CourierType;
  
  // 4. Agama
  agama: Religion;
  
  // 5. Pendidikan Terakhir
  pendidikanTerakhir: Education;
  
  // 6. Hub yang Dilamar
  hubDilamar: string;
  
  // 7. Nama Lengkap
  namaLengkap: string;
  
  // 8. Nomor KTP
  nomorKtp: string;
  
  // 9. Nomor WhatsApp
  nomorWhatsapp: string;
  
  // 10 & 11. Kontak Darurat
  nomorTeleponDarurat: string;
  namaPemilikNomorDarurat: string;
  
  // 12. Hubungan dengan Pemilik Nomor Darurat
  hubunganPemilikNomorDarurat: string;
  
  // 13. Jenis Kelamin
  jenisKelamin: Gender;
  
  // 14. Tanggal Lahir
  tanggalLahir: string;
  
  // 15-18. Alamat
  alamatLengkap: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  
  // 19-21. SIM
  nomorSim: string;
  typeSim: string;
  masaBerlakuSim: string;
  
  // 22-27. STNK/Kendaraan
  jenisMerkStnk: string;
  tahunPembuatanKendaraan: string;
  nomorPolisi: string;
  nomorStnk: string;
  tanggalBerlakuStnk: string;
  tanggalBerlakuPajakStnk: string;
  
  // 28-30. Rekening Bank
  nomorRekening: string;
  namaPemilikRekening: string;
  namaBank: string;
  
  // 40. Shopee Username
  shopeeUsername: string;
  
  // 41. Status Rumah
  statusRumah: HouseStatus;
  
  // 42. Jumlah Tanggungan
  jumlahTanggungan: string;
  
  // Status
  status: RegistrationStatus;
  
  // Timestamps
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  notes?: string;
  
  // Documents (31-39)
  documents: Document[];
}

export interface Document {
  id: string;
  registrationId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
}

export type DocumentType = 
  | 'foto_selfie'
  | 'foto_selfie_penjamin'
  | 'foto_ktp'
  | 'foto_ktp_penjamin'
  | 'foto_sim'
  | 'foto_stnk_halaman1'
  | 'foto_stnk_halaman2'
  | 'foto_kk'
  | 'foto_ijazah';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'verify' | 'approve' | 'reject' | 'export' | 'create' | 'update';
  entityType: string;
  entityId?: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  verifiedRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  todayRegistrations: number;
  totalPICs: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  role: UserRole | null;
}

// Labels untuk dropdown
export const COURIER_TYPE_LABELS: Record<CourierType, string> = {
  rider_mitra: 'Rider Mitra',
  rider_mitra_plus: 'Rider Mitra Plus',
  rider_dedicated: 'Rider Dedicated',
  driver_mitra: 'Driver Mitra',
  driver_dedicated: 'Driver Dedicated',
};

export const RELIGION_LABELS: Record<Religion, string> = {
  islam: 'Islam',
  kristen: 'Kristen Protestan',
  katolik: 'Katolik',
  hindu: 'Hindu',
  buddha: 'Buddha',
  konghucu: 'Konghucu',
};

export const EDUCATION_LABELS: Record<Education, string> = {
  sd: 'SD',
  smp: 'SMP',
  sma: 'SMA/SMK',
  d1: 'D1',
  d2: 'D2',
  d3: 'D3',
  s1: 'S1',
  s2: 'S2',
  s3: 'S3',
};

export const HOUSE_STATUS_LABELS: Record<HouseStatus, string> = {
  milik_sendiri: 'Milik Sendiri',
  sewa: 'Sewa',
  kontrak: 'Kontrak',
  keluarga: 'Keluarga',
  lainnya: 'Lainnya',
};

export const YES_NO_LABELS: Record<YesNo, string> = {
  ya: 'Ya',
  tidak: 'Tidak',
};

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  foto_selfie: 'Foto Selfie (dengan lokasi rumah)',
  foto_selfie_penjamin: 'Foto Selfie dengan Penjamin',
  foto_ktp: 'Foto KTP',
  foto_ktp_penjamin: 'Foto KTP Penjamin',
  foto_sim: 'Foto SIM',
  foto_stnk_halaman1: 'Foto STNK Halaman 1',
  foto_stnk_halaman2: 'Foto STNK Halaman 2',
  foto_kk: 'Foto KK',
  foto_ijazah: 'Foto Ijazah',
};
