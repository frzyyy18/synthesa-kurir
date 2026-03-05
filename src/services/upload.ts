import type { DocumentType } from '@/types';
import { DOCUMENT_LABELS } from '@/types';

export interface UploadResult {
  success: boolean;
  message: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface FileValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
}

// File validation rules untuk 9 dokumen
export const FILE_VALIDATIONS: Record<DocumentType, FileValidation> = {
  foto_selfie: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_selfie_penjamin: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_ktp: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_ktp_penjamin: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_sim: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_stnk_halaman1: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_stnk_halaman2: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_kk: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
  foto_ijazah: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
};

// Re-export DOCUMENT_LABELS
export { DOCUMENT_LABELS };

class UploadService {
  // Validate file
  static validateFile(file: File, docType: DocumentType): { valid: boolean; message?: string } {
    const validation = FILE_VALIDATIONS[docType];
    
    // Check file size
    if (file.size > validation.maxSize) {
      const maxSizeMB = validation.maxSize / (1024 * 1024);
      return { 
        valid: false, 
        message: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB` 
      };
    }

    // Check file type
    if (!validation.allowedTypes.includes(file.type)) {
      const allowedExtensions = validation.allowedTypes
        .map(t => t.split('/')[1].toUpperCase())
        .join(', ');
      return { 
        valid: false, 
        message: `Tipe file tidak diizinkan. Format yang diizinkan: ${allowedExtensions}` 
      };
    }

    return { valid: true };
  }

  // Convert file to base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Upload file (simulated - stores as base64 in localStorage)
  static async uploadFile(
    file: File, 
    docType: DocumentType
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file, docType);
    if (!validation.valid) {
      return { success: false, message: validation.message || 'Validasi file gagal' };
    }

    try {
      // Convert to base64
      const base64 = await this.fileToBase64(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${docType}_${timestamp}_${safeFileName}`;

      return {
        success: true,
        message: 'File berhasil diupload',
        fileName: uniqueFileName,
        fileUrl: base64,
        fileSize: file.size,
        mimeType: file.type,
      };
    } catch (error) {
      return { success: false, message: 'Gagal mengupload file' };
    }
  }

  // Get file extension
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file is image
  static isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }
}

export default UploadService;
