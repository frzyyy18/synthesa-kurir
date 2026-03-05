import type { Registration, RegistrationStatus } from '@/types';

class NotificationService {
  // Send WhatsApp notification (simulated)
  static async sendWhatsApp(
    phone: string, 
    message: string
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`[WhatsApp Simulation] To: ${phone}, Message: ${message}`);
    
    return { success: true, message: 'WhatsApp berhasil dikirim (simulasi)' };
  }

  // Send Email notification (simulated)
  static async sendEmail(
    email: string, 
    subject: string, 
    body: string
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`[Email Simulation] To: ${email}, Subject: ${subject}, Body: ${body.substring(0, 50)}...`);
    
    return { success: true, message: 'Email berhasil dikirim (simulasi)' };
  }

  // Send status update notification
  static async sendStatusUpdate(
    registration: Registration
  ): Promise<{ success: boolean; message: string }> {
    const statusMessages: Record<RegistrationStatus, { whatsapp: string; email: { subject: string; body: string } }> = {
      pending: {
        whatsapp: `Halo ${registration.namaLengkap}, pendaftaran Anda dengan kode ${registration.registrationCode} telah diterima dan sedang diproses.`,
        email: {
          subject: 'Pendaftaran Diterima - Shopee Express',
          body: `Halo ${registration.namaLengkap},\n\nPendaftaran Anda dengan kode ${registration.registrationCode} telah berhasil diterima dan sedang dalam proses verifikasi.\n\nTerima kasih.`,
        },
      },
      verified: {
        whatsapp: `Halo ${registration.namaLengkap}, dokumen pendaftaran Anda dengan kode ${registration.registrationCode} telah terverifikasi. Menunggu persetujuan final.`,
        email: {
          subject: 'Dokumen Terverifikasi - Shopee Express',
          body: `Halo ${registration.namaLengkap},\n\nDokumen pendaftaran Anda dengan kode ${registration.registrationCode} telah berhasil diverifikasi. Saat ini menunggu persetujuan final.\n\nTerima kasih.`,
        },
      },
      approved: {
        whatsapp: `Selamat ${registration.namaLengkap}! Pendaftaran Anda dengan kode ${registration.registrationCode} telah DISETUJUI. Silakan datang ke ${registration.hubDilamar} untuk proses selanjutnya.`,
        email: {
          subject: 'Pendaftaran Disetujui - Shopee Express',
          body: `Selamat ${registration.namaLengkap}!\n\nPendaftaran Anda dengan kode ${registration.registrationCode} telah berhasil DISETUJUI.\n\nSilakan datang ke ${registration.hubDilamar} untuk proses onboarding selanjutnya.\n\nTerima kasih.`,
        },
      },
      rejected: {
        whatsapp: `Halo ${registration.namaLengkap}, mohon maaf pendaftaran Anda dengan kode ${registration.registrationCode} tidak dapat dilanjutkan. Alasan: ${registration.rejectionReason || 'Dokumen tidak memenuhi syarat'}`,
        email: {
          subject: 'Pendaftaran Ditolak - Shopee Express',
          body: `Halo ${registration.namaLengkap},\n\nMohon maaf, pendaftaran Anda dengan kode ${registration.registrationCode} tidak dapat dilanjutkan.\n\nAlasan: ${registration.rejectionReason || 'Dokumen tidak memenuhi syarat'}\n\nSilakan hubungi kami untuk informasi lebih lanjut.`,
        },
      },
    };

    const messageData = statusMessages[registration.status];
    
    // Send WhatsApp
    await this.sendWhatsApp(registration.nomorWhatsapp, messageData.whatsapp);

    // Send Email
    await this.sendEmail(registration.email, messageData.email.subject, messageData.email.body);

    return { success: true, message: 'Notifikasi status berhasil dikirim' };
  }

  // Send registration confirmation
  static async sendRegistrationConfirmation(
    registration: Registration
  ): Promise<{ success: boolean; message: string }> {
    const whatsappMessage = `Terima kasih ${registration.namaLengkap} telah mendaftar di Shopee Express. Kode pendaftaran Anda: ${registration.registrationCode}. Silakan simpan kode ini untuk cek status pendaftaran.`;
    
    const emailSubject = 'Konfirmasi Pendaftaran - Shopee Express';
    const emailBody = `Halo ${registration.namaLengkap},\n\nTerima kasih telah mendaftar di Shopee Express.\n\nKode pendaftaran Anda: ${registration.registrationCode}\n\nSilakan simpan kode ini untuk mengecek status pendaftaran Anda.\n\nTerima kasih.`;

    // Send WhatsApp
    await this.sendWhatsApp(registration.nomorWhatsapp, whatsappMessage);

    // Send Email
    await this.sendEmail(registration.email, emailSubject, emailBody);

    return { success: true, message: 'Konfirmasi pendaftaran berhasil dikirim' };
  }
}

export default NotificationService;
