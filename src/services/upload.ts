/* ================================
   FILE UPLOAD SERVICE
   ================================

   STORAGE SETUP REQUIREMENTS:
   1. Create a storage bucket named "courier-documents" in Supabase
   2. Set bucket to public access
   3. Configure appropriate CORS policies
   4. If storage is not available, the system will fallback to local data URLs

   ================================ */

import type { DocumentType } from '@/types';
import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean
  message?: string
  fileName?: string
  fileUrl?: string
  fileSize?: number
  mimeType?: string
}

export interface FileValidation {
  maxSize: number
  allowedTypes: string[]
}

/* ================================
   LABEL DOKUMEN
================================ */

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  foto_ktp: "Foto KTP",
  foto_ktp_penjamin: "Foto KTP Penjamin",

  foto_selfie: "Selfie dengan Aplikasi Stamp",
  foto_selfie_penjamin: "Selfie dengan Penjamin",

  foto_sim: "Foto SIM",
  foto_kk: "Foto Kartu Keluarga",
  foto_ijazah: "Foto Ijazah",

  foto_stnk_halaman1: "Foto STNK Depan",
  foto_stnk_halaman2: "Foto STNK Belakang"
}

/* ================================
   VALIDASI FILE
================================ */

export const FILE_VALIDATIONS: Record<DocumentType, FileValidation> = {
  foto_ktp: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_ktp_penjamin: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_selfie: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_selfie_penjamin: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_sim: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_kk: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_ijazah: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_stnk_halaman1: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  },

  foto_stnk_halaman2: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/jpg"]
  }
}

/* ================================
   UPLOAD SERVICE
================================ */

class UploadService {

  static validateFile(file: File, docType: DocumentType) {

    const validation = FILE_VALIDATIONS[docType]

    if (file.size > validation.maxSize) {
      return {
        valid: false,
        message: "Ukuran file maksimal 5MB"
      }
    }

    if (!validation.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: "Format file harus JPG atau PNG"
      }
    }

    return { valid: true }
  }

  static async uploadFile(file: File, docType: DocumentType): Promise<UploadResult> {

    const validation = this.validateFile(file, docType)

    if (!validation.valid) {
      return { success: false, message: validation.message }
    }

    const fileExt = file.name.split(".").pop()

    const fileName = `${docType}-${Date.now()}.${fileExt}`

    try {
      const { error } = await supabase.storage
        .from("courier-documents")
        .upload(fileName, file)

      if (error) {
        console.warn('Storage upload failed, using local fallback:', error.message)
        // Fallback: create a local data URL for demo purposes
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              success: true,
              fileName,
              fileUrl: e.target?.result as string,
              fileSize: file.size,
              mimeType: file.type
            })
          }
          reader.onerror = () => {
            resolve({
              success: false,
              message: 'Failed to process file locally'
            })
          }
          reader.readAsDataURL(file)
        })
      }

      const { data } = supabase.storage
        .from("courier-documents")
        .getPublicUrl(fileName)

      return {
        success: true,
        fileName,
        fileUrl: data.publicUrl,
        fileSize: file.size,
        mimeType: file.type
      }
    } catch (error) {
      console.warn('Storage upload error, using local fallback:', error)
      // Fallback: create a local data URL for demo purposes
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            success: true,
            fileName,
            fileUrl: e.target?.result as string,
            fileSize: file.size,
            mimeType: file.type
          })
        }
        reader.onerror = () => {
          resolve({
            success: false,
            message: 'Failed to process file locally'
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  static formatFileSize(bytes: number) {

    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}

export default UploadService