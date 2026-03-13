import { supabase } from "@/lib/supabase"
import type { Registration } from "../types"

class DatabaseService {
  static TABLES = {
    USERS: "shopee_courier_db_users_v2",
    REGISTRATIONS: "shopee_courier_db_registrations_v2",
    DOCUMENTS: "shopee_courier_db_documents_v2",
    ACTIVITY_LOGS: "shopee_courier_db_activity_logs_v2"
  }

  static generateId() {
    return "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  static generateRegistrationCode() {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `SPX-${timestamp}-${random}`
  }

  /* ===============================
     REGISTRATIONS
  =============================== */

  static async getRegistrations() {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("submitted_at", { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        // Fallback to local storage
        return this.getRegistrationsLocal()
      }

      // Map database field names to TypeScript interface
      const mappedData = (data || []).map(reg => ({
        ...reg,
        registrationCode: reg.registration_code,
        namaLengkap: reg.nama_lengkap,
        nomorKtp: reg.nomor_ktp,
        nomorSim: reg.nomor_sim,
        typeSim: reg.type_sim,
        masaBerlakuSim: reg.masa_berlaku_sim,
        nomorWhatsapp: reg.nomor_whatsapp,
        nomorTeleponDarurat: reg.nomor_telepon_darurat,
        namaPemilikNomorDarurat: reg.nama_pemilik_nomor_darurat,
        hubunganPemilikNomorDarurat: reg.hubungan_pemilik_nomor_darurat,
        jenisKelamin: reg.jenis_kelamin,
        tanggalLahir: reg.tanggal_lahir,
        alamatLengkap: reg.alamat_lengkap,
        tanggalBerlakuSim: reg.masa_berlaku_sim,
        jenisMerkStnk: reg.jenis_merk_stnk,
        tahunPembuatanKendaraan: reg.tahun_pembuatan_kendaraan,
        nomorPolisi: reg.nomor_polisi,
        nomorStnk: reg.nomor_stnk,
        tanggalBerlakuStnk: reg.tanggal_berlaku_stnk,
        tanggalBerlakuPajakStnk: reg.tanggal_berlaku_pajak_stnk,
        nomorRekening: reg.nomor_rekening,
        namaPemilikRekening: reg.nama_pemilik_rekening,
        namaBank: reg.nama_bank,
        shopeeUsername: reg.shopee_username,
        statusRumah: reg.status_rumah,
        jumlahTanggungan: reg.jumlah_tanggungan,
        pernahBergabung: reg.pernah_bergabung,
        jenisKurir: reg.tipe_kurir,
        hubDilamar: reg.hub_dilamar,
        pendidikanTerakhir: reg.pendidikan_terakhir,
        submittedAt: reg.submitted_at,
        verifiedAt: reg.verified_at,
        verifiedBy: reg.verified_by,
        approvedAt: reg.approved_at,
        approvedBy: reg.approved_by,
        rejectedAt: reg.rejected_at,
        rejectedBy: reg.rejected_by,
        rejectionReason: reg.rejection_reason,
        notes: reg.notes,
      }))

      // Fetch documents for each registration
      const registrationsWithDocuments = await Promise.all(
        mappedData.map(async (reg) => {
          const documents = await this.getDocumentsByRegistrationId(reg.id)
          return { ...reg, documents }
        })
      )

      return registrationsWithDocuments
    } catch (error) {
      console.error('Error fetching registrations:', error)
      // Fallback to local storage
      return this.getRegistrationsLocal()
    }
  }

  static getRegistrationsLocal() {
    return JSON.parse(localStorage.getItem(this.TABLES.REGISTRATIONS) || "[]")
  }

  static async getRegistrationByCode(code: string) {

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("registration_code", code)
      .single()

    if (error || !data) return null

    // Map snake_case database fields to camelCase TypeScript interface
    const mappedData = {
      id: data.id,
      registrationCode: data.registration_code,
      email: data.email,
      pernahBergabung: data.pernah_bergabung,
      jenisKurir: data.tipe_kurir,
      agama: data.agama,
      pendidikanTerakhir: data.pendidikan_terakhir,
      hubDilamar: data.hub_dilamar,
      namaLengkap: data.nama_lengkap,
      nomorKtp: data.nomor_ktp,
      nomorWhatsapp: data.nomor_whatsapp,
      nomorTeleponDarurat: data.nomor_telepon_darurat,
      namaPemilikNomorDarurat: data.nama_pemilik_nomor_darurat,
      hubunganPemilikNomorDarurat: data.hubungan_pemilik_nomor_darurat,
      jenisKelamin: data.jenis_kelamin,
      tanggalLahir: data.tanggal_lahir,
      alamatLengkap: data.alamat_lengkap,
      kota: data.kota,
      kecamatan: data.kecamatan,
      kelurahan: data.kelurahan,
      nomorSim: data.nomor_sim,
      typeSim: data.type_sim,
      masaBerlakuSim: data.masa_berlaku_sim,
      jenisMerkStnk: data.jenis_merk_stnk,
      tahunPembuatanKendaraan: data.tahun_pembuatan_kendaraan,
      nomorPolisi: data.nomor_polisi,
      nomorStnk: data.nomor_stnk,
      tanggalBerlakuStnk: data.tanggal_berlaku_stnk,
      tanggalBerlakuPajakStnk: data.tanggal_berlaku_pajak_stnk,
      nomor_rekening: data.nomor_rekening,
      nama_pemilik_rekening: data.nama_pemilik_rekening,
      nama_bank: data.nama_bank,
      shopee_username: data.shopee_username,
      statusRumah: data.status_rumah,
      jumlahTanggungan: data.jumlah_tanggungan,
      status: data.status,
      submittedAt: data.submitted_at,
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
      approvedAt: data.approved_at,
      approvedBy: data.approved_by,
      rejectedAt: data.rejected_at,
      rejectedBy: data.rejected_by,
      rejectionReason: data.rejection_reason,
      notes: data.notes,
    }

    // Fetch documents for this registration
    const documents = await this.getDocumentsByRegistrationId(mappedData.id)
    return { ...mappedData, documents }
  }

    static async createRegistration(registration: any) {
    try {
      const registrationCode = "SPX-" + Date.now()

      // Validate required fields
      const requiredFields = ['namaLengkap', 'nomorKtp', 'nomorWhatsapp', 'nomorTeleponDarurat', 'namaPemilikNomorDarurat', 'hubunganPemilikNomorDarurat', 'jenisKelamin', 'tanggalLahir', 'alamatLengkap', 'kota', 'kecamatan', 'kelurahan', 'nomorSim', 'typeSim', 'masaBerlakuSim', 'jenisMerkStnk', 'tahunPembuatanKendaraan', 'nomorPolisi', 'nomorStnk', 'tanggalBerlakuStnk', 'tanggalBerlakuPajakStnk', 'nomor_rekening', 'nama_pemilik_rekening', 'nama_bank', 'shopee_username', 'statusRumah', 'jumlahTanggungan', 'pernahBergabung', 'jenisKurir', 'hubDilamar', 'pendidikanTerakhir', 'agama']
      
      const missingFields = requiredFields.filter(field => !registration[field])
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      const { data, error } = await supabase
        .from("registrations")
        .insert({
          registration_code: registrationCode,
          email: registration.email,
          nama_lengkap: registration.namaLengkap,
          nomor_ktp: registration.nomorKtp,
          nomor_whatsapp: registration.nomorWhatsapp,
          nomor_telepon_darurat: registration.nomorTeleponDarurat,
          nama_pemilik_nomor_darurat: registration.namaPemilikNomorDarurat,
          hubungan_pemilik_nomor_darurat: registration.hubunganPemilikNomorDarurat,
          jenis_kelamin: registration.jenisKelamin,
          tanggal_lahir: registration.tanggalLahir ? new Date(registration.tanggalLahir).toISOString().split('T')[0] : null,
          alamat_lengkap: registration.alamatLengkap,
          kota: registration.kota,
          kecamatan: registration.kecamatan,
          kelurahan: registration.kelurahan,
          nomor_sim: registration.nomorSim,
          type_sim: registration.typeSim,
          masa_berlaku_sim: registration.masaBerlakuSim ? new Date(registration.masaBerlakuSim).toISOString().split('T')[0] : null,
          jenis_merk_stnk: registration.jenisMerkStnk,
          tahun_pembuatan_kendaraan: parseInt(registration.tahunPembuatanKendaraan),
          nomor_polisi: registration.nomorPolisi,
          nomor_stnk: registration.nomorStnk,
          tanggal_berlaku_stnk: registration.tanggalBerlakuStnk ? new Date(registration.tanggalBerlakuStnk).toISOString().split('T')[0] : null,
          tanggal_berlaku_pajak_stnk: registration.tanggalBerlakuPajakStnk ? new Date(registration.tanggalBerlakuPajakStnk).toISOString().split('T')[0] : null,
          nomor_rekening: registration.nomor_rekening,
          nama_pemilik_rekening: registration.nama_pemilik_rekening,
          nama_bank: registration.nama_bank,
          shopee_username: registration.shopee_username,
          status_rumah: registration.statusRumah,
          jumlah_tanggungan: registration.jumlahTanggungan,
          pernah_bergabung: registration.pernahBergabung,
          tipe_kurir: registration.jenisKurir,
          hub_dilamar: registration.hubDilamar,
          pendidikan_terakhir: registration.pendidikanTerakhir,
          agama: registration.agama,
          status: "pending",
          submitted_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Supabase error details:', error)
        const errorMessage = error.message || error.details || JSON.stringify(error)
        throw new Error(`Supabase Insert Error: ${errorMessage}`)
      }

      console.log('Registration created in Supabase:', data)
      
      // Map the response to include camelCase fields
      const createdRegistration = data[0] || data
      return {
        ...createdRegistration,
        registrationCode: createdRegistration.registration_code,
        namaLengkap: createdRegistration.nama_lengkap,
        nomorKtp: createdRegistration.nomor_ktp,
        nomorWhatsapp: createdRegistration.nomor_whatsapp,
        status: createdRegistration.status || 'pending',
        submittedAt: createdRegistration.submitted_at,
      }
    } catch (error) {
      console.error('Error creating registration:', error)
      throw error
    }
  }

  static createRegistrationLocal(registration: any, registrationCode: string) {
    const registrations = this.getRegistrationsLocal()
    const newRegistration = {
      id: this.generateId(),
      registrationCode,
      ...registration,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      documents: []
    }
    registrations.push(newRegistration)
    localStorage.setItem(this.TABLES.REGISTRATIONS, JSON.stringify(registrations))
    return newRegistration
  }
  

static async updateRegistration(id: string, updates: any) {
  // Transform camelCase to snake_case for database columns
  const dbUpdates: any = { ...updates };
  
  if (dbUpdates.verifiedAt) {
    dbUpdates.verified_at = dbUpdates.verifiedAt;
    delete dbUpdates.verifiedAt;
  }
  if (dbUpdates.verifiedBy) {
    dbUpdates.verified_by = dbUpdates.verifiedBy;
    delete dbUpdates.verifiedBy;
  }
  if (dbUpdates.approvedAt) {
    dbUpdates.approved_at = dbUpdates.approvedAt;
    delete dbUpdates.approvedAt;
  }
  if (dbUpdates.approvedBy) {
    dbUpdates.approved_by = dbUpdates.approvedBy;
    delete dbUpdates.approvedBy;
  }
  if (dbUpdates.rejectedAt) {
    dbUpdates.rejected_at = dbUpdates.rejectedAt;
    delete dbUpdates.rejectedAt;
  }
  if (dbUpdates.rejectedBy) {
    dbUpdates.rejected_by = dbUpdates.rejectedBy;
    delete dbUpdates.rejectedBy;
  }
  if (dbUpdates.rejectionReason) {
    dbUpdates.rejection_reason = dbUpdates.rejectionReason;
    delete dbUpdates.rejectionReason;
  }

  const { data, error } = await supabase
    .from("registrations")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating registration:", error)
    throw error
  }

  return data
}

  static async getRegistrationById(id: string) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .single()

    if (error) return null

    // Map database field names to TypeScript interface
    const mappedData = {
      ...data,
      registrationCode: data.registration_code,
      namaLengkap: data.nama_lengkap,
      nomorKtp: data.nomor_ktp,
      nomorWhatsapp: data.nomor_whatsapp,
      nomorTeleponDarurat: data.nomor_telepon_darurat,
      namaPemilikNomorDarurat: data.nama_pemilik_nomor_darurat,
      hubunganPemilikNomorDarurat: data.hubungan_pemilik_nomor_darurat,
      jenisKelamin: data.jenis_kelamin,
      tanggalLahir: data.tanggal_lahir,
      alamatLengkap: data.alamat_lengkap,
      tanggalBerlakuSim: data.masa_berlaku_sim,
      jenisMerkStnk: data.jenis_merk_stnk,
      tahunPembuatanKendaraan: data.tahun_pembuatan_kendaraan,
      nomorPolisi: data.nomor_polisi,
      nomorStnk: data.nomor_stnk,
      tanggalBerlakuStnk: data.tanggal_berlaku_stnk,
      tanggalBerlakuPajakStnk: data.tanggal_berlaku_pajak_stnk,
      nomor_rekening: data.nomor_rekening,
      nama_pemilik_rekening: data.nama_pemilik_rekening,
      nama_bank: data.nama_bank,
      shopee_username: data.shopee_username,
      statusRumah: data.status_rumah,
      jumlahTanggungan: data.jumlah_tanggungan,
      pernahBergabung: data.pernah_bergabung,
      jenisKurir: data.tipe_kurir,
      hubDilamar: data.hub_dilamar,
      pendidikanTerakhir: data.pendidikan_terakhir,
      submittedAt: data.submitted_at,
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
      approvedAt: data.approved_at,
      approvedBy: data.approved_by,
      rejectedAt: data.rejected_at,
      rejectedBy: data.rejected_by,
      rejectionReason: data.rejection_reason,
      notes: data.notes,
    }

    // Fetch documents separately
    const documents = await this.getDocumentsByRegistrationId(id)
    return { ...mappedData, documents }
  }

  /* ===============================
     DOCUMENTS
  =============================== */

  static async createDocument(document: any) {
    try {
      // Transform camelCase to snake_case for database columns
      const dbDocument = {
        registration_id: document.registrationId,
        type: document.type,
        file_name: document.fileName,
        file_url: document.fileUrl,
        file_size: document.fileSize,
        mime_type: document.mimeType,
        uploaded_at: document.uploadedAt || new Date().toISOString(),
        status: document.status || 'pending',
      }

      console.log('Creating document in Supabase:', dbDocument)

      const { data, error } = await supabase
        .from("documents")
        .insert(dbDocument)
        .select()

      if (error) {
        console.error('❌ Supabase error creating document:', error.message, error.details)
        // Try local fallback but log the error
        console.warn('⚠️ Falling back to local storage for document')
        return this.createDocumentLocal(document)
      }

      console.log('✅ Document created successfully in Supabase:', data)
      return data ? data[0] : data
    } catch (error: any) {
      console.error('❌ Exception creating document:', error.message)
      return this.createDocumentLocal(document)
    }
  }

  static getDocuments() {
    return JSON.parse(localStorage.getItem(this.TABLES.DOCUMENTS) || "[]")
  }

  static createDocumentLocal(document: any) {
    const documents = this.getDocuments()
    const newDocument = {
      id: this.generateId(),
      ...document,
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    }
    documents.push(newDocument)

    // Update registration with document
    const registrations = this.getRegistrationsLocal()
    const registration = registrations.find((r: Registration) => r.id === document.registrationId)
    if (registration) {
      registration.documents = registration.documents || []
      registration.documents.push(newDocument)
      localStorage.setItem(this.TABLES.REGISTRATIONS, JSON.stringify(registrations))
    }

    localStorage.setItem(this.TABLES.DOCUMENTS, JSON.stringify(documents))
    return newDocument
  }

  static async getDocumentsByRegistrationId(registrationId: string) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("registration_id", registrationId)

      if (error) {
        console.error('Supabase error:', error)
        // Fallback to local storage
        return this.getDocumentsByRegistrationIdLocal(registrationId)
      }

      // Map database field names to TypeScript interface
      const mappedDocuments = (data || []).map(doc => ({
        ...doc,
        registrationId: doc.registration_id,
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        fileSize: doc.file_size,
        mimeType: doc.mime_type,
        uploadedAt: doc.uploaded_at,
        verifiedAt: doc.verified_at,
        verifiedBy: doc.verified_by,
      }))

      return mappedDocuments
    } catch (error) {
      console.error('Error fetching documents:', error)
      // Fallback to local storage
      return this.getDocumentsByRegistrationIdLocal(registrationId)
    }
  }

  static getDocumentsByRegistrationIdLocal(registrationId: string) {
    const documents = JSON.parse(localStorage.getItem(this.TABLES.DOCUMENTS) || "[]")
    return documents.filter((doc: any) => doc.registrationId === registrationId)
  }

  static async updateDocument(id: string, updates: any) {
    // Transform camelCase to snake_case for database columns
    const dbUpdates = { ...updates }
    if (updates.verifiedAt) dbUpdates.verified_at = updates.verifiedAt
    if (updates.verifiedBy) dbUpdates.verified_by = updates.verifiedBy
    // Remove camelCase versions
    delete dbUpdates.verifiedAt
    delete dbUpdates.verifiedBy

    const { data, error } = await supabase
      .from("documents")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return data
  }

  /* ===============================
     USERS
  =============================== */

  static async getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    return data || []
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (error) return null

    return data
  }

  static async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single()

    if (error) return null

    return data
  }

  static async createUser(user: any) {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single()

    if (error) throw error

    return data
  }

  static async updateUser(id: string, updates: any) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return data
  }

  /* ===============================
     DASHBOARD
  =============================== */

  static async getDashboardStats() {

    const { data: registrations } = await supabase
      .from("registrations")
      .select("*")

    const { data: users } = await supabase
      .from("users")
      .select("*")

    const today = new Date().toISOString().split("T")[0]

    const safeRegistrations = registrations || []
    const safeUsers = users || []

    return {

      totalRegistrations: safeRegistrations.length,

      pendingRegistrations:
        safeRegistrations.filter(r => r.status === "pending").length,

      verifiedRegistrations:
        safeRegistrations.filter(r => r.status === "verified").length,

      approvedRegistrations:
        safeRegistrations.filter(r => r.status === "approved").length,

      rejectedRegistrations:
        safeRegistrations.filter(r => r.status === "rejected").length,

      todayRegistrations:
        safeRegistrations.filter(r =>
          r.submitted_at?.startsWith(today)
        ).length,

      totalPICs:
        safeUsers.filter(u => u.role === "pic").length
    }
  }

  /* ===============================
     ACTIVITY LOGS
  =============================== */

static async createActivityLog(log: any) {
  try {
    // Transform camelCase to snake_case for database columns
    const dbLog: any = { ...log };
    if (dbLog.userId) {
      dbLog.user_id = dbLog.userId;
      delete dbLog.userId;
    }
    if (dbLog.userName) {
      dbLog.user_name = dbLog.userName;
      delete dbLog.userName;
    }

    const { data, error } = await supabase
      .from("activity_logs")
      .insert(dbLog)
      .select()
      .single()

    if (error) {
      console.warn('Failed to create activity log:', error)
      return null
    }

    return data
  } catch (error) {
    console.warn('Activity log creation failed:', error)
    return null
  }
}

  static async getActivityLogs() {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("timestamp", { ascending: false })

      if (error) {
        console.warn('Failed to fetch activity logs:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn('Activity logs fetch failed:', error)
      return []
    }
  }

}

export default DatabaseService