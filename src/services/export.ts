import * as XLSX from 'xlsx';
import type { Registration, User } from '@/types';
import { COURIER_TYPE_LABELS, RELIGION_LABELS, EDUCATION_LABELS, HOUSE_STATUS_LABELS, YES_NO_LABELS } from '@/types';

class ExportService {
  // Export registrations to Excel
  static exportRegistrations(
    registrations: Registration[], 
    filename: string = 'data-pendaftaran-shopee.xlsx'
  ): void {
    const data = registrations.map(reg => ({
      'Kode Pendaftaran': reg.registrationCode,
      'Email': reg.email,
      'Pernah Bergabung': YES_NO_LABELS[reg.pernahBergabung],
      'Jenis Kurir': COURIER_TYPE_LABELS[reg.jenisKurir],
      'Agama': RELIGION_LABELS[reg.agama],
      'Pendidikan Terakhir': EDUCATION_LABELS[reg.pendidikanTerakhir],
      'Hub yang Dilamar': reg.hubDilamar,
      'Nama Lengkap': reg.namaLengkap,
      'Nomor KTP': reg.nomorKtp,
      'Nomor WhatsApp': reg.nomorWhatsapp,
      'Nomor Telepon Darurat': reg.nomorTeleponDarurat,
      'Nama Pemilik Nomor Darurat': reg.namaPemilikNomorDarurat,
      'Hubungan dengan Pemilik Nomor': reg.hubunganPemilikNomorDarurat,
      'Jenis Kelamin': reg.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      'Tanggal Lahir': reg.tanggalLahir,
      'Alamat Lengkap': reg.alamatLengkap,
      'Kota': reg.kota,
      'Kecamatan': reg.kecamatan,
      'Kelurahan': reg.kelurahan,
      'Nomor SIM': reg.nomorSim,
      'Type SIM': reg.typeSim,
      'Masa Berlaku SIM': reg.masaBerlakuSim,
      'Jenis Merk STNK': reg.jenisMerkStnk,
      'Tahun Pembuatan Kendaraan': reg.tahunPembuatanKendaraan,
      'Nomor Polisi': reg.nomorPolisi,
      'Nomor STNK': reg.nomorStnk,
      'Tanggal Berlaku STNK': reg.tanggalBerlakuStnk,
      'Tanggal Berlaku Pajak STNK': reg.tanggalBerlakuPajakStnk,
      'Nomor Rekening': reg.nomorRekening,
      'Nama Pemilik Rekening': reg.namaPemilikRekening,
      'Nama Bank': reg.namaBank,
      'Shopee Username': reg.shopeeUsername,
      'Status Rumah': HOUSE_STATUS_LABELS[reg.statusRumah],
      'Jumlah Tanggungan': reg.jumlahTanggungan,
      'Status': this.getStatusLabel(reg.status),
      'Tanggal Daftar': new Date(reg.submittedAt).toLocaleString('id-ID'),
      'Tanggal Verifikasi': reg.verifiedAt ? new Date(reg.verifiedAt).toLocaleString('id-ID') : '-',
      'Tanggal Persetujuan': reg.approvedAt ? new Date(reg.approvedAt).toLocaleString('id-ID') : '-',
      'Catatan': reg.notes || '-',
    }));

    this.downloadExcel(data, filename);
  }

  // Export users to Excel
  static exportUsers(
    users: User[], 
    filename: string = 'data-pengguna.xlsx'
  ): void {
    const data = users.map(user => ({
      'Username': user.username,
      'Nama': user.name,
      'Email': user.email,
      'No. Telepon': user.phone || '-',
      'Role': user.role === 'admin' ? 'Administrator' : 'PIC',
      'Status': user.isActive ? 'Aktif' : 'Nonaktif',
      'Terakhir Login': user.lastLogin ? new Date(user.lastLogin).toLocaleString('id-ID') : '-',
      'Dibuat Pada': new Date(user.createdAt).toLocaleString('id-ID'),
    }));

    this.downloadExcel(data, filename);
  }

  // Export activity logs to Excel
  static exportActivityLogs(
    logs: { userName: string; action: string; description: string; timestamp: string }[],
    filename: string = 'log-aktivitas.xlsx'
  ): void {
    const data = logs.map(log => ({
      'Pengguna': log.userName,
      'Aksi': this.getActionLabel(log.action),
      'Deskripsi': log.description,
      'Waktu': new Date(log.timestamp).toLocaleString('id-ID'),
    }));

    this.downloadExcel(data, filename);
  }

  // Helper method to download Excel
  private static downloadExcel(data: unknown[], filename: string): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Auto-width columns
    const colWidths = this.calculateColumnWidths(data);
    ws['!cols'] = colWidths;
    
    XLSX.writeFile(wb, filename);
  }

  // Calculate column widths
  private static calculateColumnWidths(data: unknown[]): { wch: number }[] {
    if (data.length === 0) return [];
    
    const firstRow = data[0] as Record<string, string>;
    return Object.keys(firstRow).map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String((row as Record<string, string>)[key] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
  }

  // Get status label
  private static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Menunggu Verifikasi',
      verified: 'Terverifikasi',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    return labels[status] || status;
  }

  // Get action label
  private static getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      create: 'Membuat',
      update: 'Mengupdate',
      delete: 'Menghapus',
      verify: 'Verifikasi',
      approve: 'Menyetujui',
      reject: 'Menolak',
      export: 'Export',
    };
    return labels[action] || action;
  }
}

export default ExportService;
