export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  nisn?: string;
  applicationId?: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'menunggu_verifikasi'
  | 'terverifikasi'
  | 'jadwal_tes'
  | 'diterima'
  | 'cadangan'
  | 'ditolak';

export type AdmissionTrack =
  | 'Tahfidz Prestasi'
  | 'Akademik Rapor'
  | 'Reguler CBT'
  | 'Afirmasi / KIP';

export type ProgramMajor =
  | 'MIPA Riset & Sains'
  | 'Keagamaan & Tahfidz Al-Qur\'an'
  | 'IPS Humaniora & Bisnis'
  | 'Bahasa & Komunikasi Global';

export interface UploadedDocuments {
  kkName?: string;
  kkUrl?: string;
  aktaName?: string;
  aktaUrl?: string;
  raporName?: string;
  raporUrl?: string;
  fotoName?: string;
  fotoUrl?: string;
  piagamName?: string;
  piagamUrl?: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  registrationNo: string;
  candidateName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  previousSchool: string;
  parentName: string;
  parentPhone: string;
  parentJob: string;
  address: string;
  admissionTrack: AdmissionTrack;
  programMajor: ProgramMajor;
  tahfidzJuz?: number;
  averageReportScore?: number;
  documents: UploadedDocuments;
  status: ApplicationStatus;
  verificationNotes?: string;
  submissionDate: string;
  lastUpdated: string;
  testSchedule?: {
    date: string;
    time: string;
    room: string;
    examiner: string;
    instructions: string;
  };
  scores?: {
    cbt: number;
    wawancara: number;
    tahfidz: number;
  };
}

export interface RoomHotspot {
  id: string;
  pitch: number; // vertical angle in degrees (-90 to 90)
  yaw: number;   // horizontal angle in degrees (0 to 360)
  label: string;
  type: 'navigate' | 'info';
  targetRoomId?: string;
  infoTitle?: string;
  infoText?: string;
}

export interface RoomProfile {
  id: string;
  name: string;
  code: string;
  category: 'Kelas Digital' | 'Ibadah' | 'Laboratorium' | 'Perpustakaan' | 'Asrama' | 'Olahraga & Hall' | 'Gerbang & Plaza';
  tagline: string;
  description: string;
  floor: string;
  building: string;
  capacity: number;
  specs: {
    ac: boolean;
    projector: boolean;
    smartboard: boolean;
    soundSystem: boolean;
    cctv: boolean;
    wifiSpeed: string;
    areaSize: string;
  };
  pic: {
    name: string;
    role: string;
    photo: string;
    email: string;
  };
  keyFeatures: string[];
  equipmentList: string[];
  schedule: string;
  galleryImages: string[];
  hotspots: RoomHotspot[];
  theme: {
    skyTop: string;
    skyBottom: string;
    floorColor: string;
    wallColor: string;
    decorTheme: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Pengumuman' | 'Jadwal Tes' | 'Kelulusan' | 'Daftar Ulang' | 'Kegiatan';
  content: string;
  isUrgent?: boolean;
  targetRole?: 'all' | 'calon_siswa' | 'diterima';
}

export interface ActivityGalleryItem {
  id: string;
  title: string;
  category: 'Tahfidz & Ibadah' | 'Sains & Robotika' | 'Ekstrakurikuler' | 'Olahraga & Seni' | 'Prestasi & Wisuda';
  date: string;
  description: string;
  imageUrl: string;
  location: string;
  likes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'status_change' | 'announcement' | 'system' | 'reminder';
  read: boolean;
  linkTab?: string;
}
