import { useState, useEffect } from 'react';
import { 
  Package, Users, FileCheck, LogOut, Menu, X, 
  LayoutDashboard, ClipboardList, Search, Filter,
  CheckCircle, XCircle, Clock, Eye, Download, UserPlus,
  Activity, Upload, AlertCircle, Check, ArrowLeft,
  ArrowRight, Lock, Calendar, User as UserIcon,
  Bike, Car, Rocket, Search as SearchIcon, 
  DollarSign, Clock as ClockIcon, Shield,
  Phone, Mail, MapPin as MapPinIcon, Clock3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import DatabaseService from '@/services/database';
import AuthService from '@/services/auth';
import UploadService, { DOCUMENT_LABELS, FILE_VALIDATIONS } from '@/services/upload';
import NotificationService from '@/services/notification';
import ExportService from '@/services/export';
import type { 
  User, Registration, ActivityLog, DashboardStats, RegistrationStatus, 
  DocumentType, CourierType, Religion, Education, Gender, HouseStatus, YesNo 
} from '@/types';
import { 
  COURIER_TYPE_LABELS, RELIGION_LABELS, EDUCATION_LABELS, 
  HOUSE_STATUS_LABELS, YES_NO_LABELS 
} from '@/types';
import * as React from 'react';

// DatabaseService.init();

type View = 'landing' | 'register' | 'check-status' | 'login' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [authState, setAuthState] = useState(AuthService.getAuthState());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const state = AuthService.getAuthState();
    setAuthState(state);
    if (state.isAuthenticated) setCurrentView('dashboard');
  }, []);

  const handleLogin = () => {
    setAuthState(AuthService.getAuthState());
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setAuthState(AuthService.getAuthState());
    setCurrentView('landing');
    toast.success('Berhasil logout');
  };

  switch (currentView) {
    case 'landing': return <LandingPage onNavigate={setCurrentView} />;
    case 'register': return <RegistrationPage onNavigate={setCurrentView} />;
    case 'check-status': return <CheckStatusPage onNavigate={setCurrentView} />;
    case 'login': return <LoginPage onNavigate={setCurrentView} onLogin={handleLogin} />;
    case 'dashboard': return authState.isAuthenticated ? (
      <Dashboard onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={authState.user!} />
    ) : <LoginPage onNavigate={setCurrentView} onLogin={handleLogin} />;
    default: return <LandingPage onNavigate={setCurrentView} />;
  }
}

// Landing Page - SYNTAKA Style
function LandingPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const courierTypes = [
    {
      id: 'rider_mitra',
      name: 'Rider Mitra',
      vehicle: 'Motor',
      icon: Bike,
      color: 'bg-sky-500',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-600',
      borderColor: 'border-sky-500',
      salary: 'Rp 2.200/paket',
      period: '2 Mingguan'
    },
    {
      id: 'rider_mitra_plus',
      name: 'Rider Mitra Plus',
      vehicle: 'Motor',
      icon: Bike,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      salary: '80% UMK',
      period: 'Bulanan'
    },
    {
      id: 'rider_dedicated',
      name: 'Rider Dedicated',
      vehicle: 'Motor',
      icon: Bike,
      color: 'bg-violet-500',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-500',
      salary: '100% UMK',
      period: 'Bulanan'
    },
    {
      id: 'driver_mitra',
      name: 'Driver Mitra',
      vehicle: 'Mobil',
      icon: Car,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-500',
      salary: 'Rp 5.500/paket',
      period: '2 Mingguan'
    },
    {
      id: 'driver_dedicated',
      name: 'Driver Dedicated',
      vehicle: 'Mobil',
      icon: Car,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-500',
      salary: '100% UMK + Tunjangan',
      period: 'Bulanan (Kontrak)'
    }
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Penghasilan Menarik',
      description: 'Gaji kompetitif dengan berbagai pilihan jenis kurir. Rider Mitra mulai dari Rp 2.200/paket atau pilih sistem bulanan dengan UMK.',
      color: 'bg-sky-500'
    },
    {
      icon: ClockIcon,
      title: 'Fleksibel',
      description: 'Pilih jadwal dan area pengiriman sesuai kebutuhan Anda. Cocok untuk pekerjaan sampingan atau utama.',
      color: 'bg-emerald-500'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Bergabung dengan PT. SYNTHESA ANTA KARYA yang sudah berpengalaman dalam industri logistik.',
      color: 'bg-violet-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-sky-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-sky-500 font-bold text-xl">S</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-tight">SYNTAKA</span>
                <span className="text-xs text-sky-100 block leading-tight">PT. SYNTHESA ANTA KARYA</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => onNavigate('landing')} className="text-white hover:text-sky-100 transition-colors">Beranda</button>
              <button onClick={() => document.getElementById('courier-types')?.scrollIntoView({ behavior: 'smooth' })} className="text-white hover:text-sky-100 transition-colors">Pendaftaran</button>
              <button onClick={() => onNavigate('check-status')} className="text-white hover:text-sky-100 transition-colors">Cek Status</button>
              <button onClick={() => onNavigate('login')} className="text-white hover:text-sky-100 transition-colors">Login</button>
            </div>
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sky-600 px-4 py-4 space-y-3">
            <button onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }} className="block text-white w-full text-left py-2">Beranda</button>
            <button onClick={() => { document.getElementById('courier-types')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block text-white w-full text-left py-2">Pendaftaran</button>
            <button onClick={() => { onNavigate('check-status'); setMobileMenuOpen(false); }} className="block text-white w-full text-left py-2">Cek Status</button>
            <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="block text-white w-full text-left py-2">Login</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-500 to-sky-600 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Bergabung sebagai Kurir Profesional
            </h1>
            <p className="text-lg md:text-xl text-sky-100 mb-10 leading-relaxed">
              Daftar sekarang dan jadi bagian dari tim pengiriman SYNTAKA. 
              Penghasilan menarik, jadwal fleksibel, dan jaminan keamanan kerja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate('register')}
                className="bg-white text-sky-600 font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-50 transition-colors shadow-lg"
              >
                <Rocket className="h-5 w-5" />
                Daftar Sekarang
              </button>
              <button 
                onClick={() => onNavigate('check-status')}
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <SearchIcon className="h-5 w-5" />
                Cek Status
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">1000+</div>
              <div className="text-sky-100 mt-1">Kurir Aktif</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">50+</div>
              <div className="text-sky-100 mt-1">Hub di Indonesia</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white">4.9</div>
              <div className="text-sky-100 mt-1">Rating Aplikasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courier Types Section */}
      <section id="courier-types" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilihan Jenis Kurir</h2>
            <p className="text-lg text-gray-600">Sesuaikan dengan kebutuhan dan kendaraan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courierTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${type.bgColor} p-4 rounded-xl`}>
                    <type.icon className={`h-8 w-8 ${type.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{type.name}</h3>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${type.bgColor} ${type.textColor}`}>
                      {type.vehicle}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Gaji</span>
                    <span className={`font-bold ${type.textColor}`}>{type.salary}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Periode</span>
                    <span className="font-medium text-gray-700">{type.period}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('register')}
                  className={`w-full py-3 rounded-xl font-semibold border-2 ${type.borderColor} ${type.textColor} hover:${type.bgColor} transition-colors`}
                >
                  Pilih Tipe Ini
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Bergabung dengan SYNTAKA?</h2>
            <div className="w-24 h-1 bg-sky-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-sky-500 font-bold text-xl">S</span>
                </div>
                <div>
                  <span className="font-bold block">SYNTAKA</span>
                  <span className="text-xs text-slate-400">PT. SYNTHESA ANTA KARYA</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                PT. SYNTHESA ANTA KARYA adalah perusahaan logistik terpercaya yang menghubungkan pengirim dan penerima dengan aman dan cepat.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white transition-colors">Beranda</button></li>
                <li><button onClick={() => document.getElementById('courier-types')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition-colors">Pendaftaran</button></li>
                <li><button onClick={() => onNavigate('check-status')} className="text-slate-400 hover:text-white transition-colors">Cek Status</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Kontak</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-5 w-5" />
                  021-1234-5678
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                  info@syntaka.id
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPinIcon className="h-5 w-5" />
                  Jakarta, Indonesia
                </li>
              </ul>

              <h4 className="font-bold text-lg mt-6 mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Senin - Jumat: 08:00 - 17:00
                </li>
                <li className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  Sabtu: 08:00 - 12:00
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500 text-sm">&copy; 2024 PT. SYNTHESA ANTA KARYA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Registration Page
function RegistrationPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  
  const [formData, setFormData] = useState({
    email: '', pernahBergabung: '' as YesNo | '', jenisKurir: '' as CourierType | '',
    agama: '' as Religion | '', pendidikanTerakhir: '' as Education | '', hubDilamar: '',
    namaLengkap: '', nomorKtp: '', nomorWhatsapp: '', nomorTeleponDarurat: '',
    namaPemilikNomorDarurat: '', hubunganPemilikNomorDarurat: '', jenisKelamin: '' as Gender | '',
    tanggalLahir: '', alamatLengkap: '', kota: '', kecamatan: '', kelurahan: '',
    nomorSim: '', typeSim: '', masaBerlakuSim: '', jenisMerkStnk: '', tahunPembuatanKendaraan: '',
    nomorPolisi: '', nomorStnk: '', tanggalBerlakuStnk: '', tanggalBerlakuPajakStnk: '',
    nomorRekening: '', namaPemilikRekening: '', namaBank: '', shopeeUsername: '',
    statusRumah: '' as HouseStatus | '', jumlahTanggungan: '',
  });

  const [documents, setDocuments] = useState<Record<DocumentType, { file: File | null; preview: string | null }>>({
    foto_selfie: { file: null, preview: null }, foto_selfie_penjamin: { file: null, preview: null },
    foto_ktp: { file: null, preview: null }, foto_ktp_penjamin: { file: null, preview: null },
    foto_sim: { file: null, preview: null }, foto_stnk_halaman1: { file: null, preview: null },
    foto_stnk_halaman2: { file: null, preview: null }, foto_kk: { file: null, preview: null },
    foto_ijazah: { file: null, preview: null },
  });

  const handleInputChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleFileChange = (docType: DocumentType, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setDocuments(prev => ({ ...prev, [docType]: { file, preview: e.target?.result as string } }));
      reader.readAsDataURL(file);
    } else {
      setDocuments(prev => ({ ...prev, [docType]: { file: null, preview: null } }));
    }
  };

// ...existing code...

  const isStep1Valid = formData.email && formData.pernahBergabung && formData.jenisKurir && formData.agama && formData.pendidikanTerakhir && formData.hubDilamar;
  const isStep2Valid = formData.namaLengkap && formData.nomorKtp && formData.nomorWhatsapp && formData.nomorTeleponDarurat && formData.namaPemilikNomorDarurat && formData.hubunganPemilikNomorDarurat && formData.jenisKelamin && formData.tanggalLahir;
  const isStep3Valid = formData.alamatLengkap && formData.kota && formData.kecamatan && formData.kelurahan;
  const isStep4Valid = formData.nomorSim && formData.typeSim && formData.masaBerlakuSim && formData.jenisMerkStnk && formData.tahunPembuatanKendaraan && formData.nomorPolisi && formData.nomorStnk && formData.tanggalBerlakuStnk && formData.tanggalBerlakuPajakStnk;
  const isStep5Valid = formData.nomorRekening && formData.namaPemilikRekening && formData.namaBank && formData.shopeeUsername && formData.statusRumah && formData.jumlahTanggungan;
  const isStep6Valid = Object.values(documents).every(d => d.file !== null);

  const stepTitles = ['Informasi Dasar', 'Data Pribadi', 'Alamat Domisili', 'SIM & Kendaraan', 'Rekening & Informasi Lainnya', 'Upload Dokumen', 'Selesai'];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create registration
      const registration = await DatabaseService.createRegistration({
        email: formData.email,
        pernahBergabung: formData.pernahBergabung as YesNo,
        jenisKurir: formData.jenisKurir as CourierType,
        agama: formData.agama as Religion,
        pendidikanTerakhir: formData.pendidikanTerakhir as Education,
        hubDilamar: formData.hubDilamar,
        namaLengkap: formData.namaLengkap,
        nomorKtp: formData.nomorKtp,
        nomorWhatsapp: formData.nomorWhatsapp,
        nomorTeleponDarurat: formData.nomorTeleponDarurat,
        namaPemilikNomorDarurat: formData.namaPemilikNomorDarurat,
        hubunganPemilikNomorDarurat: formData.hubunganPemilikNomorDarurat,
        jenisKelamin: formData.jenisKelamin as Gender,
        tanggalLahir: formData.tanggalLahir,
        alamatLengkap: formData.alamatLengkap,
        kota: formData.kota,
        kecamatan: formData.kecamatan,
        kelurahan: formData.kelurahan,
        nomorSim: formData.nomorSim,
        typeSim: formData.typeSim,
        masaBerlakuSim: formData.masaBerlakuSim,
        jenisMerkStnk: formData.jenisMerkStnk,
        tahunPembuatanKendaraan: formData.tahunPembuatanKendaraan,
        nomorPolisi: formData.nomorPolisi,
        nomorStnk: formData.nomorStnk,
        tanggalBerlakuStnk: formData.tanggalBerlakuStnk,
        tanggalBerlakuPajakStnk: formData.tanggalBerlakuPajakStnk,
        nomorRekening: formData.nomorRekening,
        namaPemilikRekening: formData.namaPemilikRekening,
        namaBank: formData.namaBank,
        shopeeUsername: formData.shopeeUsername,
        statusRumah: formData.statusRumah as HouseStatus,
        jumlahTanggungan: formData.jumlahTanggungan,
        status: 'pending',
      });

      // Upload documents
      const uploadErrors: string[] = [];
      for (const docTypeKey of Object.keys(documents) as DocumentType[]) {
        const docData = documents[docTypeKey];
        if (docData.file) {
          try {
            const result = await UploadService.uploadFile(docData.file, docTypeKey);
            if (result.success) {
              await DatabaseService.createDocument({
                registrationId: registration.id,
                type: docTypeKey,
                fileName: result.fileName!,
                fileUrl: result.fileUrl!,
                fileSize: result.fileSize!,
                mimeType: result.mimeType!,
                uploadedAt: new Date().toISOString(),
                status: 'pending',
              });
            } else {
              uploadErrors.push(`${DOCUMENT_LABELS[docTypeKey]}: ${result.message}`);
            }
          } catch (error) {
            uploadErrors.push(`${DOCUMENT_LABELS[docTypeKey]}: Upload failed`);
          }
        }
      }

      // Send notification
      await NotificationService.sendRegistrationConfirmation(registration);

      setRegistrationCode(registration.registrationCode);
      setStep(7); // Success step

      if (uploadErrors.length > 0) {
        toast.success(`Pendaftaran berhasil! Namun ${uploadErrors.length} dokumen gagal diupload: ${uploadErrors.join(', ')}`);
      } else {
        toast.success('Pendaftaran berhasil!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sky-500 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate('landing')} className="text-white p-2 hover:bg-sky-600 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-sky-500 font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-white">SYNTAKA - Pendaftaran Kurir</span>
            </div>
          </div>
          <div className="text-sm text-sky-100">Langkah {step} dari 6</div>
        </div>
      </header>

      {step < 7 && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s < step ? 'bg-sky-500 text-white' : s === step ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{s < step ? <Check className="h-4 w-4" /> : s}</div>
                {s < 6 && <div className={`flex-1 h-1 mx-1 transition-colors ${s < step ? 'bg-sky-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="text-center mt-3"><p className="text-lg font-medium text-gray-700">{stepTitles[step - 1]}</p></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="email@contoh.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Apakah sudah pernah bergabung di Shopee Express? *</Label>
                    <Select value={formData.pernahBergabung} onValueChange={(v) => handleInputChange('pernahBergabung', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent><SelectItem value="ya">Ya</SelectItem><SelectItem value="tidak">Tidak</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kurir *</Label>
                    <Select value={formData.jenisKurir} onValueChange={(v) => handleInputChange('jenisKurir', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih jenis kurir" /></SelectTrigger>
                      <SelectContent>{Object.entries(COURIER_TYPE_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Agama *</Label>
                    <Select value={formData.agama} onValueChange={(v) => handleInputChange('agama', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih agama" /></SelectTrigger>
                      <SelectContent>{Object.entries(RELIGION_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pendidikan Terakhir *</Label>
                    <Select value={formData.pendidikanTerakhir} onValueChange={(v) => handleInputChange('pendidikanTerakhir', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih pendidikan" /></SelectTrigger>
                      <SelectContent>{Object.entries(EDUCATION_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Hub yang Dilamar *</Label>
                    <Input value={formData.hubDilamar} onChange={(e) => handleInputChange('hubDilamar', e.target.value)} placeholder="Masukkan nama hub" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nama Lengkap (sesuai KTP) *</Label>
                    <Input value={formData.namaLengkap} onChange={(e) => handleInputChange('namaLengkap', e.target.value)} placeholder="Masukkan nama lengkap" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor KTP *</Label>
                    <Input value={formData.nomorKtp} onChange={(e) => handleInputChange('nomorKtp', e.target.value)} placeholder="3175xxxxxxxxxxxx" maxLength={16} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor WhatsApp *</Label>
                    <Input value={formData.nomorWhatsapp} onChange={(e) => handleInputChange('nomorWhatsapp', e.target.value)} placeholder="081234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Telepon Darurat *</Label>
                    <Input value={formData.nomorTeleponDarurat} onChange={(e) => handleInputChange('nomorTeleponDarurat', e.target.value)} placeholder="081234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Pemilik Nomor Darurat *</Label>
                    <Input value={formData.namaPemilikNomorDarurat} onChange={(e) => handleInputChange('namaPemilikNomorDarurat', e.target.value)} placeholder="Nama kontak darurat" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Hubungan dengan Pemilik Nomor Darurat *</Label>
                    <Input value={formData.hubunganPemilikNomorDarurat} onChange={(e) => handleInputChange('hubunganPemilikNomorDarurat', e.target.value)} placeholder="Contoh: Ayah, Ibu, Saudara" />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin *</Label>
                    <Select value={formData.jenisKelamin} onValueChange={(v) => handleInputChange('jenisKelamin', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Lahir *</Label>
                    <Input type="date" value={formData.tanggalLahir} onChange={(e) => handleInputChange('tanggalLahir', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Alamat Lengkap (Domisili) *</Label>
                  <Textarea value={formData.alamatLengkap} onChange={(e) => handleInputChange('alamatLengkap', e.target.value)} placeholder="Jl. Contoh No. 123, RT/RW" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Kota/Kabupaten *</Label><Input value={formData.kota} onChange={(e) => handleInputChange('kota', e.target.value)} placeholder="Kota" /></div>
                  <div className="space-y-2"><Label>Kecamatan *</Label><Input value={formData.kecamatan} onChange={(e) => handleInputChange('kecamatan', e.target.value)} placeholder="Kecamatan" /></div>
                  <div className="space-y-2"><Label>Kelurahan *</Label><Input value={formData.kelurahan} onChange={(e) => handleInputChange('kelurahan', e.target.value)} placeholder="Kelurahan" /></div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Data SIM</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Nomor SIM *</Label><Input value={formData.nomorSim} onChange={(e) => handleInputChange('nomorSim', e.target.value)} placeholder="Nomor SIM" /></div>
                  <div className="space-y-2"><Label>Type SIM *</Label>
                    <Select value={formData.typeSim} onValueChange={(v) => handleInputChange('typeSim', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih type SIM" /></SelectTrigger>
                      <SelectContent><SelectItem value="A">SIM A (Mobil)</SelectItem><SelectItem value="C">SIM C (Motor)</SelectItem><SelectItem value="A UMUM">SIM A Umum</SelectItem><SelectItem value="C UMUM">SIM C Umum</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Masa Berlaku SIM *</Label><Input type="date" value={formData.masaBerlakuSim} onChange={(e) => handleInputChange('masaBerlakuSim', e.target.value)} /></div>
                </div>
                <Separator className="my-4" />
                <h3 className="font-semibold text-lg">Data Kendaraan (STNK)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Jenis/Merk STNK *</Label><Input value={formData.jenisMerkStnk} onChange={(e) => handleInputChange('jenisMerkStnk', e.target.value)} placeholder="Contoh: Honda Vario 150" /></div>
                  <div className="space-y-2"><Label>Tahun Pembuatan Kendaraan *</Label><Input value={formData.tahunPembuatanKendaraan} onChange={(e) => handleInputChange('tahunPembuatanKendaraan', e.target.value)} placeholder="2020" maxLength={4} /></div>
                  <div className="space-y-2"><Label>Nomor Polisi *</Label><Input value={formData.nomorPolisi} onChange={(e) => handleInputChange('nomorPolisi', e.target.value.toUpperCase())} placeholder="B 1234 ABC" /></div>
                  <div className="space-y-2"><Label>Nomor STNK *</Label><Input value={formData.nomorStnk} onChange={(e) => handleInputChange('nomorStnk', e.target.value)} placeholder="Nomor STNK" /></div>
                  <div className="space-y-2"><Label>Tanggal Berlaku STNK *</Label><Input type="date" value={formData.tanggalBerlakuStnk} onChange={(e) => handleInputChange('tanggalBerlakuStnk', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Tanggal Berlaku Pajak STNK *</Label><Input type="date" value={formData.tanggalBerlakuPajakStnk} onChange={(e) => handleInputChange('tanggalBerlakuPajakStnk', e.target.value)} /></div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Data Rekening Bank</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nomor Rekening *</Label><Input value={formData.nomorRekening} onChange={(e) => handleInputChange('nomorRekening', e.target.value)} placeholder="Nomor rekening" /></div>
                  <div className="space-y-2"><Label>Nama Pemilik Rekening (harus nama pribadi) *</Label><Input value={formData.namaPemilikRekening} onChange={(e) => handleInputChange('namaPemilikRekening', e.target.value)} placeholder="Nama sesuai rekening" /></div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nama Bank *</Label>
                    <Select value={formData.namaBank} onValueChange={(v) => handleInputChange('namaBank', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih bank" /></SelectTrigger>
                      <SelectContent><SelectItem value="BCA">BCA</SelectItem><SelectItem value="Mandiri">Mandiri</SelectItem><SelectItem value="BNI">BNI</SelectItem><SelectItem value="BRI">BRI</SelectItem><SelectItem value="BSI">BSI</SelectItem><SelectItem value="CIMB">CIMB Niaga</SelectItem><SelectItem value="Permata">Permata</SelectItem><SelectItem value="Danamon">Danamon</SelectItem><SelectItem value="Lainnya">Lainnya</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-4" />
                <h3 className="font-semibold text-lg">Informasi Lainnya</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Shopee Username *</Label><Input value={formData.shopeeUsername} onChange={(e) => handleInputChange('shopeeUsername', e.target.value)} placeholder="Username Shopee Anda" /></div>
                  <div className="space-y-2">
                    <Label>Status Rumah Saat Ini *</Label>
                    <Select value={formData.statusRumah} onValueChange={(v) => handleInputChange('statusRumah', v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih status rumah" /></SelectTrigger>
                      <SelectContent>{Object.entries(HOUSE_STATUS_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2"><Label>Jumlah Tanggungan *</Label><Input value={formData.jumlahTanggungan} onChange={(e) => handleInputChange('jumlahTanggungan', e.target.value)} placeholder="Contoh: 2" type="number" min="0" /></div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">Semua dokumen wajib diupload. Maksimal ukuran file 5MB per dokumen. Format: JPG, JPEG, PNG.</AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(DOCUMENT_LABELS) as DocumentType[]).map((docType) => (
                    <DocumentUploadCard key={docType} docType={docType} label={DOCUMENT_LABELS[docType]} fileData={documents[docType]} onFileChange={(file) => handleFileChange(docType, file)} />
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
                <p className="text-gray-600 mb-6">Terima kasih telah mendaftar di Shopee Express. Kode pendaftaran Anda:</p>
                <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <div className="text-3xl font-mono font-bold text-sky-600 tracking-wider">{registrationCode}</div>
                </div>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Simpan kode pendaftaran ini untuk cek status pendaftaran Anda. Notifikasi juga telah dikirim ke email dan WhatsApp Anda.</p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => onNavigate('check-status')} className="bg-sky-500 hover:bg-sky-600">Cek Status Pendaftaran</Button>
                  <Button variant="outline" onClick={() => onNavigate('landing')}>Kembali ke Beranda</Button>
                </div>
              </div>
            )}
          </CardContent>

          {step < 7 && (
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />Sebelumnya
              </Button>
              {step < 6 ? (
                <Button onClick={() => setStep(step + 1)} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid) || (step === 4 && !isStep4Valid) || (step === 5 && !isStep5Valid)} className="bg-sky-500 hover:bg-sky-600">
                  Selanjutnya<ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStep6Valid || isSubmitting} className="bg-sky-500 hover:bg-sky-600">
                  {isSubmitting ? <><div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />Memproses...</> : <><Check className="mr-2 h-4 w-4" />Kirim Pendaftaran</>}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

function DocumentUploadCard({ docType, label, fileData, onFileChange }: { docType: DocumentType; label: string; fileData: { file: File | null; preview: string | null }; onFileChange: (file: File | null) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const validation = FILE_VALIDATIONS[docType];

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <Label className="font-medium text-sm">{label}</Label>
        <span className="text-xs text-red-500">*Wajib</span>
      </div>
      {fileData.file ? (
        <div className="space-y-3">
          <div className="relative">
            <img src={fileData.preview!} alt={label} className="w-full h-40 object-cover rounded-lg" />
            <button onClick={() => onFileChange(null)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-sm text-gray-600 truncate">{fileData.file.name}</p>
          <p className="text-xs text-gray-500">{UploadService.formatFileSize(fileData.file.size)}</p>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Klik untuk upload</p>
          <p className="text-xs text-gray-400 mt-1">Maks {UploadService.formatFileSize(validation.maxSize)}</p>
          <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
        </div>
      )}
    </div>
  );
}

// Check Status Page
function CheckStatusPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [searchCode, setSearchCode] = useState('');
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) { toast.error('Masukkan kode pendaftaran'); return; }
    setLoading(true); setSearched(true);
    try {
      const result = await DatabaseService.getRegistrationByCode(searchCode.toUpperCase().trim());
      setRegistration(result || null);
    } catch (error) {
      toast.error('Terjadi kesalahan saat mencari pendaftaran');
      setRegistration(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sky-500 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => onNavigate('landing')} className="text-white flex items-center gap-2 mb-4 hover:text-sky-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />Kembali
          </button>
          <h1 className="text-2xl font-bold text-white">Cek Status Pendaftaran</h1>
          <p className="text-sky-100">Masukkan kode pendaftaran Anda</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-2">
              <Input value={searchCode} onChange={(e) => setSearchCode(e.target.value.toUpperCase())} placeholder="Masukkan kode pendaftaran (contoh: SPX-ABC123)" className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <Button onClick={handleSearch} disabled={loading} className="bg-sky-500 hover:bg-sky-600">{loading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Search className="h-4 w-4" />}</Button>
            </div>

            {searched && !loading && (
              <div className="mt-6">
                {registration ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : registration.status === 'verified' ? 'bg-blue-100 text-blue-800 border-blue-200' : registration.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                      <div className="flex items-center space-x-3">
                        {registration.status === 'pending' ? <Clock className="h-6 w-6" /> : registration.status === 'verified' ? <FileCheck className="h-6 w-6" /> : registration.status === 'approved' ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        <div>
                          <p className="font-semibold">{registration.status === 'pending' ? 'Menunggu Verifikasi' : registration.status === 'verified' ? 'Terverifikasi' : registration.status === 'approved' ? 'Disetujui' : 'Ditolak'}</p>
                          <p className="text-sm opacity-80">Kode: {registration.registrationCode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Detail Pendaftaran</h3>
                      <div className="space-y-2 text-sm">
registration.namaLengkap
                        <div className="flex justify-between"><span className="text-gray-600">Email</span><span className="font-medium">{registration.email}</span></div>
registration.nomorWhatsapp
COURIER_TYPE_LABELS[registration.jenisKurir as CourierType]
registration.hubDilamar
new Date(registration.submittedAt).toLocaleDateString('id-ID')
                        {registration.rejectionReason && <div className="flex justify-between"><span className="text-gray-600">Alasan Penolakan</span><span className="font-medium text-red-600">{registration.rejectionReason}</span></div>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Pendaftaran Tidak Ditemukan</h3>
                    <p className="text-gray-500 mt-2">Kode pendaftaran yang Anda masukkan tidak ditemukan. Pastikan kode sudah benar.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Login Page
function LoginPage({ onNavigate, onLogin }: { onNavigate: (view: View) => void; onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  if (!username || !password) {
    toast.error("Masukkan username dan password")
    return
  }

  setLoading(true)

  const result = await AuthService.login(username, password)

  if (result.success) {
    toast.success("Login berhasil")
    onLogin()
  } else {
    toast.error(result.message)
  }

  setLoading(false)
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-sky-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"><Lock className="h-8 w-8 text-sky-600" /></div>
          <CardTitle className="text-2xl">Login PIC / Admin</CardTitle>
          <CardDescription>Masukkan kredensial Anda untuk mengakses dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" /></div>
            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600" disabled={loading}>{loading ? <><div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />Memproses...</> : 'Login'}</Button>
          </form>
          <div className="mt-4 text-center"><Button variant="link" onClick={() => onNavigate('landing')}>Kembali ke Beranda</Button></div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p>Admin: <code className="bg-gray-200 px-1 rounded">admin / admin123</code></p>
            <p>PIC: <code className="bg-gray-200 px-1 rounded">pic / pic123</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard
function Dashboard({ onLogout, sidebarOpen, setSidebarOpen, user }: { onLogout: () => void; sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void; user: User }) {
  const [activeTab, setActiveTab] = useState('registrations');
const [stats, setStats] = useState<DashboardStats>({ totalRegistrations: 0, pendingRegistrations: 0, verifiedRegistrations: 0, approvedRegistrations: 0, rejectedRegistrations: 0, todayRegistrations: 0, totalPICs: 0 });

useEffect(() => {
  const loadStats = async () => {
    try {
      const dashboardStats = await DatabaseService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };
  loadStats();
}, []);
// registrations state removed


  const isAdmin = user.role === 'admin';

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && <div className="flex items-center space-x-2"><Package className="h-6 w-6 text-orange-400" /><span className="font-bold">{isAdmin ? 'Admin' : 'PIC'}</span></div>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-slate-800">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {isAdmin && <SidebarButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" collapsed={!sidebarOpen} />}
          <SidebarButton active={activeTab === 'registrations'} onClick={() => setActiveTab('registrations')} icon={ClipboardList} label="Pendaftaran" collapsed={!sidebarOpen} />
          {isAdmin && <SidebarButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Pengguna" collapsed={!sidebarOpen} />}
          {isAdmin && <SidebarButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={Activity} label="Log Aktivitas" collapsed={!sidebarOpen} />}
          <SidebarButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserIcon} label="Profil" collapsed={!sidebarOpen} />
        </nav>
        <div className="p-2 border-t border-slate-700">
          <Button variant="ghost" className={`w-full justify-start text-white hover:bg-slate-800 ${!sidebarOpen && 'justify-center'}`} onClick={onLogout}><LogOut className="h-5 w-5" />{sidebarOpen && <span className="ml-2">Logout</span>}</Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{isAdmin ? 'Dashboard Administrator' : 'Dashboard PIC'}</h1>
            <p className="text-sm text-gray-500">Selamat datang, {user.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right"><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'PIC'}</p></div>
            <Avatar><AvatarFallback className="bg-slate-800 text-white">{user.name.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          {activeTab === 'dashboard' && isAdmin && <DashboardPanel stats={stats} />}
          {activeTab === 'registrations' && <RegistrationsPanel user={user} />}
          {activeTab === 'users' && isAdmin && <UsersPanel />}
          {activeTab === 'logs' && isAdmin && <LogsPanel />}
          {activeTab === 'profile' && <ProfilePanel user={user} />}
        </ScrollArea>
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, icon: Icon, label, collapsed }: { active: boolean; onClick: () => void; icon: typeof Users; label: string; collapsed: boolean }) {
  return (
    <Button variant={active ? 'secondary' : 'ghost'} className={`w-full justify-start ${collapsed && 'justify-center'} ${active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} onClick={onClick}>
      <Icon className="h-5 w-5" />{!collapsed && <span className="ml-2">{label}</span>}
    </Button>
  );
}

function DashboardPanel({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <DashboardStatCard title="Total Pendaftaran" value={stats.totalRegistrations} icon={ClipboardList} />
        <DashboardStatCard title="Menunggu" value={stats.pendingRegistrations} icon={Clock} color="yellow" />
        <DashboardStatCard title="Terverifikasi" value={stats.verifiedRegistrations} icon={FileCheck} color="blue" />
        <DashboardStatCard title="Disetujui" value={stats.approvedRegistrations} icon={CheckCircle} color="green" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <DashboardStatCard title="Ditolak" value={stats.rejectedRegistrations} icon={XCircle} color="red" />
        <DashboardStatCard title="Hari Ini" value={stats.todayRegistrations} icon={Calendar} />
        <DashboardStatCard title="Total PIC" value={stats.totalPICs} icon={Users} />
      </div>
    </div>
  );
}

function DashboardStatCard({ title, value, icon: Icon, color = 'gray' }: { title: string; value: number; icon: typeof Users; color?: 'gray' | 'yellow' | 'blue' | 'green' | 'red' }) {
  const colors = { gray: 'bg-gray-100 text-gray-600', yellow: 'bg-yellow-100 text-yellow-600', blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', red: 'bg-red-100 text-red-600' };
  return (
    <Card>
      <CardContent className="p-6">
        <div className={`p-3 rounded-lg w-fit ${colors[color]}`}><Icon className="h-6 w-6" /></div>
        <div className="mt-4"><p className="text-3xl font-bold">{value}</p><p className="text-sm text-gray-500">{title}</p></div>
      </CardContent>
    </Card>
  );
}

function RegistrationsPanel({ user }: { user: User }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [filterStatus, setFilterStatus] = useState<RegistrationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    const loadRegistrations = async () => {
      const data = await DatabaseService.getRegistrations();
      setRegistrations(data);
    };
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    const data = await DatabaseService.getRegistrations();
    setRegistrations(data);
  };

 const safeRegistrations = Array.isArray(registrations) ? registrations : []

  const filteredRegistrations = safeRegistrations.filter(r => {
    if (!r) return false; // Skip undefined or null items
    // Filter by status
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    
    // Filter by search query (name, code, or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
(r.namaLengkap || '').toLowerCase().includes(query) ||
             (r.registrationCode || '').toLowerCase().includes(query) ||
             (r.email || '').toLowerCase().includes(query);
    }
    
    return true;
  });

  const handleVerify = async (registration: Registration) => {
    DatabaseService.updateRegistration(registration.id, { status: 'verified', verified_at: new Date().toISOString(), verifiedBy: user.id });
    const updated = await DatabaseService.getRegistrationById(registration.id)!;
    await NotificationService.sendStatusUpdate(updated);
    DatabaseService.createActivityLog({ userId: user.id, userName: user.name, action: 'verify', entityType: 'registration', entityId: registration.id, description: `Verifikasi dokumen pendaftaran ${registration.registrationCode}` });
    toast.success('Dokumen berhasil diverifikasi'); await loadRegistrations(); setSelectedRegistration(null);
  };

  const handleApprove = async (registration: Registration) => {
    DatabaseService.updateRegistration(registration.id, { status: 'approved', approvedAt: new Date().toISOString(), approvedBy: user.id });
    const updated = await DatabaseService.getRegistrationById(registration.id)!;
    await NotificationService.sendStatusUpdate(updated);
    DatabaseService.createActivityLog({ userId: user.id, userName: user.name, action: 'approve', entityType: 'registration', entityId: registration.id, description: `Approve pendaftaran ${registration.registrationCode}` });
    toast.success('Pendaftaran berhasil disetujui'); await loadRegistrations(); setSelectedRegistration(null);
  };

  const handleReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;
    DatabaseService.updateRegistration(selectedRegistration.id, { status: 'rejected', rejectedAt: new Date().toISOString(), rejectedBy: user.id, rejectionReason });
    const updated = await DatabaseService.getRegistrationById(selectedRegistration.id)!;
    await NotificationService.sendStatusUpdate(updated);
    DatabaseService.createActivityLog({ userId: user.id, userName: user.name, action: 'reject', entityType: 'registration', entityId: selectedRegistration.id, description: `Reject pendaftaran ${selectedRegistration.registrationCode}` });
    toast.success('Pendaftaran ditolak'); setShowRejectDialog(false); setRejectionReason(''); await loadRegistrations(); setSelectedRegistration(null);
  };

  // Function to download document
    const downloadDocument = (fileUrl: string, fileName: string, candidateName: string, docType: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    // Create clean filename: NamaKandidat_TipeDokumen.jpg
    const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanDocType = DOCUMENT_LABELS[docType as DocumentType]?.replace(/[^a-zA-Z0-9]/g, '_') || docType;
    const extension = fileName.split('.').pop() || 'jpg';
    link.download = `${cleanName}_${cleanDocType}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Mendownload ${DOCUMENT_LABELS[docType as DocumentType]}`);
  };

  const handleExport = () => {
    ExportService.exportRegistrations(filteredRegistrations);
    DatabaseService.createActivityLog({ userId: user.id, userName: user.name, action: 'export', entityType: 'registration', description: `Export ${filteredRegistrations.length} data pendaftaran` });
    toast.success('Data berhasil diexport');
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    const variants: Record<RegistrationStatus, string> = { pending: 'bg-yellow-100 text-yellow-800', verified: 'bg-blue-100 text-blue-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
    const labels: Record<RegistrationStatus, string> = { pending: 'Menunggu', verified: 'Terverifikasi', approved: 'Disetujui', rejected: 'Ditolak' };
    return <Badge className={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Data Pendaftaran</CardTitle>
            <Button onClick={handleExport} variant="outline"><Download className="mr-2 h-4 w-4" />Export Excel</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama, kode, atau email..." className="pl-10" /></div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as RegistrationStatus | 'all')}>
              <SelectTrigger className="w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Status</SelectItem><SelectItem value="pending">Menunggu</SelectItem><SelectItem value="verified">Terverifikasi</SelectItem><SelectItem value="approved">Disetujui</SelectItem><SelectItem value="rejected">Ditolak</SelectItem></SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow><TableHead>Kode</TableHead><TableHead>Nama</TableHead><TableHead>Jenis Kurir</TableHead><TableHead>Hub</TableHead><TableHead>Status</TableHead><TableHead>Tanggal</TableHead><TableHead>Aksi</TableHead></TableRow>
            </TableHeader>
            <TableBody>
{filteredRegistrations.map((reg) => (
  <TableRow key={reg.id}>
    <TableCell>{reg.registrationCode}</TableCell>
    <TableCell>{reg.namaLengkap}</TableCell>
    <TableCell>{COURIER_TYPE_LABELS[reg.jenisKurir as CourierType]}</TableCell>

                    <TableCell>{reg.hubDilamar}</TableCell>
                    <TableCell>{getStatusBadge(reg.status)}</TableCell>
                    <TableCell>{new Date(reg.submittedAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => setSelectedRegistration(reg)}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRegistration && (
            <>
              <DialogHeader><DialogTitle>Detail Pendaftaran</DialogTitle><DialogDescription>Kode: {selectedRegistration.registrationCode}</DialogDescription></DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">{getStatusBadge(selectedRegistration.status)}<span className="text-sm text-gray-500">{new Date(selectedRegistration.submittedAt).toLocaleString('id-ID')}</span></div>
                <Tabs defaultValue="personal">
                  <TabsList className="grid w-full grid-cols-5"><TabsTrigger value="personal">Pribadi</TabsTrigger><TabsTrigger value="address">Alamat</TabsTrigger><TabsTrigger value="sim">SIM</TabsTrigger><TabsTrigger value="vehicle">Kendaraan</TabsTrigger><TabsTrigger value="documents">Dokumen</TabsTrigger></TabsList>
  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <InfoItem label="Email" value={selectedRegistration.email} />

<InfoItem label="Nama" value={selectedRegistration.namaLengkap} />
<InfoItem label="Nomor KTP" value={selectedRegistration.nomorKtp} />

                      <InfoItem label="Nomor WhatsApp" value={selectedRegistration.nomorWhatsapp} />
                      <InfoItem label="Jenis Kurir" value={COURIER_TYPE_LABELS[selectedRegistration.jenisKurir]} />
                      <InfoItem label="Agama" value={RELIGION_LABELS[selectedRegistration.agama]} />
                      <InfoItem label="Pendidikan" value={EDUCATION_LABELS[selectedRegistration.pendidikanTerakhir]} />
                      <InfoItem label="Jenis Kelamin" value={selectedRegistration.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                      <InfoItem label="Tanggal Lahir" value={selectedRegistration.tanggalLahir} />
                      <InfoItem label="Pernah Bergabung" value={YES_NO_LABELS[selectedRegistration.pernahBergabung]} />
                      <InfoItem label="Hub yang Dilamar" value={selectedRegistration.hubDilamar} />
                      <InfoItem label="Kontak Darurat" value={`${selectedRegistration.namaPemilikNomorDarurat} (${selectedRegistration.hubunganPemilikNomorDarurat})`} />
                      <InfoItem label="Nomor Darurat" value={selectedRegistration.nomorTeleponDarurat} />
                    </div>
                  </TabsContent>
                  <TabsContent value="address" className="space-y-4"><InfoItem label="Alamat Lengkap" value={selectedRegistration.alamatLengkap} /><div className="grid grid-cols-3 gap-4 text-sm"><InfoItem label="Kota" value={selectedRegistration.kota} /><InfoItem label="Kecamatan" value={selectedRegistration.kecamatan} /><InfoItem label="Kelurahan" value={selectedRegistration.kelurahan} /></div></TabsContent>
                  <TabsContent value="sim" className="space-y-4"><div className="grid grid-cols-2 gap-4 text-sm"><InfoItem label="Nomor SIM" value={selectedRegistration.nomorSim} /><InfoItem label="Type SIM" value={selectedRegistration.typeSim} /><InfoItem label="Masa Berlaku SIM" value={selectedRegistration.masaBerlakuSim} /></div></TabsContent>
                  <TabsContent value="vehicle" className="space-y-4"><div className="grid grid-cols-2 gap-4 text-sm"><InfoItem label="Jenis/Merk" value={selectedRegistration.jenisMerkStnk} /><InfoItem label="Tahun Pembuatan" value={selectedRegistration.tahunPembuatanKendaraan} /><InfoItem label="Nomor Polisi" value={selectedRegistration.nomorPolisi} /><InfoItem label="Nomor STNK" value={selectedRegistration.nomorStnk} /><InfoItem label="Berlaku STNK" value={selectedRegistration.tanggalBerlakuStnk} /><InfoItem label="Berlaku Pajak" value={selectedRegistration.tanggalBerlakuPajakStnk} /></div></TabsContent>
                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRegistration.documents && selectedRegistration.documents.length > 0 ? (
                        selectedRegistration.documents.map((doc) => (
                          <div key={doc.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{DOCUMENT_LABELS[doc.type]}</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => downloadDocument(doc.fileUrl, doc.fileName, selectedRegistration.namaLengkap, doc.type)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download
                              </Button>
                            </div>
                            <img 
                              src={doc.fileUrl} 
                              alt={doc.fileName} 
                              className="w-full h-40 object-cover rounded" 
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjkgMTlIMTQuMUMxNS4xIDE5IDE2IDE4LjEgMTYgMTdWNFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEwIDZDOS40IDYgOSA2LjQgOSA3VjEzQzkgMTMuNiA5LjQgMTQgMTAgMTRDMTMuNiAxNCAxNCAxMy42IDE0IDEzVjdDMTQgNi40IDEzLjYgNiAxMCA2WiIgZmlsbD0iIzlDQTQ5RiIvPgo8L3N2Zz4=';
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">Tidak ada dokumen yang diupload</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                {selectedRegistration.rejectionReason && <Alert className="bg-red-50 border-red-200"><AlertCircle className="h-4 w-4 text-red-600" /><AlertDescription className="text-red-700"><strong>Alasan Penolakan:</strong> {selectedRegistration.rejectionReason}</AlertDescription></Alert>}
              </div>
              <DialogFooter className="space-x-2">
                {selectedRegistration.status === 'pending' && <Button onClick={() => handleVerify(selectedRegistration)} className="bg-blue-600 hover:bg-blue-700"><FileCheck className="mr-2 h-4 w-4" />Verifikasi Dokumen</Button>}
                {selectedRegistration.status === 'verified' && (<><Button variant="destructive" onClick={() => setShowRejectDialog(true)}><XCircle className="mr-2 h-4 w-4" />Tolak</Button><Button onClick={() => handleApprove(selectedRegistration)} className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2 h-4 w-4" />Setujui</Button></>)}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tolak Pendaftaran</DialogTitle><DialogDescription>Masukkan alasan penolakan pendaftaran ini</DialogDescription></DialogHeader>
          <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Alasan penolakan..." rows={4} />
          <DialogFooter><Button variant="outline" onClick={() => setShowRejectDialog(false)}>Batal</Button><Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>Tolak Pendaftaran</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (<div><p className="text-gray-500 text-xs">{label}</p><p className="font-medium">{value || '-'}</p></div>);
}

function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', email: '', phone: '', password: '', role: 'pic' as 'pic' | 'admin' });

  useEffect(() => {
    const loadUsers = async () => {
      const data = await DatabaseService.getUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.name || !newUser.email || !newUser.password) { toast.error('Semua field wajib diisi'); return; }
    const existingUser = await DatabaseService.getUserByUsername(newUser.username);
    if (existingUser) { toast.error('Username sudah digunakan'); return; }
    await DatabaseService.createUser({ ...newUser, password: AuthService.hashPassword(newUser.password), isActive: true });
    toast.success('User berhasil ditambahkan'); setShowAddDialog(false); setNewUser({ username: '', name: '', email: '', phone: '', password: '', role: 'pic' });
    const data = await DatabaseService.getUsers();
    setUsers(data);
  };

  const handleToggleActive = async (user: User) => {
    await DatabaseService.updateUser(user.id, { isActive: !user.isActive });
    const data = await DatabaseService.getUsers();
    setUsers(data);
    toast.success(`User ${user.isActive ? 'dinonaktifkan' : 'diaktifkan'}`);
  };

  const handleExport = () => { ExportService.exportUsers(users); toast.success('Data berhasil diexport'); };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manajemen Pengguna</CardTitle>
          <div className="space-x-2"><Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button><Button onClick={() => setShowAddDialog(true)} className="bg-sky-500 hover:bg-sky-600"><UserPlus className="mr-2 h-4 w-4" />Tambah User</Button></div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Username</TableHead><TableHead>Nama</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role === 'admin' ? 'Admin' : 'PIC'}</Badge></TableCell>
                <TableCell><Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{user.isActive ? 'Aktif' : 'Nonaktif'}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => handleToggleActive(user)}>{user.isActive ? 'Nonaktifkan' : 'Aktifkan'}</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Pengguna Baru</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Username</Label><Input value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} /></div><div className="space-y-2"><Label>Nama</Label><Input value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} /></div></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>No. Telepon</Label><Input value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} /></div>
            <div className="space-y-2"><Label>Role</Label><Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v as 'pic' | 'admin'})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pic">PIC</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddDialog(false)}>Batal</Button><Button onClick={handleAddUser} className="bg-sky-500 hover:bg-sky-600">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function LogsPanel() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  useEffect(() => {
  const loadLogs = async () => {
    const data = await DatabaseService.getActivityLogs();
    setLogs(data || []);
  };

  loadLogs();
}, []);


const handleExport = () => {
  ExportService.exportActivityLogs(
    logs.map((l: ActivityLog) => ({
      userName: l.userName,
      action: l.action,
      description: l.description,
      timestamp: l.timestamp
    }))
  );
};
  return (
    <Card>
      <CardHeader><div className="flex items-center justify-between"><CardTitle>Log Aktivitas</CardTitle><Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export</Button></div></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>Pengguna</TableHead><TableHead>Aksi</TableHead><TableHead>Deskripsi</TableHead></TableRow></TableHeader>
          <TableBody>{logs.slice(0, 50).map(log => (<TableRow key={log.id}><TableCell className="text-sm">{new Date(log.timestamp).toLocaleString('id-ID')}</TableCell><TableCell>{log.userName}</TableCell><TableCell className="capitalize">{log.action}</TableCell><TableCell>{log.description}</TableCell></TableRow>))}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProfilePanel({ user }: { user: User }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { toast.error('Password baru tidak cocok'); return; }
    if (newPassword.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    const result = await AuthService.changePassword(user.id, oldPassword, newPassword);
    if (result.success) { toast.success(result.message); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }
    else { toast.error(result.message); }
  };


  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Informasi Profil</CardTitle></CardHeader>
        <CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><InfoItem label="Nama" value={user.name} /><InfoItem label="Username" value={user.username} /><InfoItem label="Email" value={user.email} /><InfoItem label="No. Telepon" value={user.phone || '-'} /><InfoItem label="Role" value={user.role === 'admin' ? 'Administrator' : 'PIC'} /></div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Ubah Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Password Lama</Label><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
          <div className="space-y-2"><Label>Password Baru</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
          <div className="space-y-2"><Label>Konfirmasi Password Baru</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
          <Button onClick={handleChangePassword} className="bg-sky-500 hover:bg-sky-600">Ubah Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
