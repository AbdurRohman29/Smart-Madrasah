import React, { useState } from 'react';
import { ApplicationRecord, AuthUser, AdmissionTrack, ProgramMajor, UploadedDocuments } from '../types';
import { saveApplication } from '../utils/storage';
import { 
  FileText, User, Users, GraduationCap, Upload, CheckCircle2, 
  ArrowRight, ArrowLeft, AlertCircle, FileCheck, Eye, Trash2, 
  Sparkles, ShieldCheck
} from 'lucide-react';

interface SpmbRegistrationProps {
  currentUser: AuthUser;
  existingApplication?: ApplicationRecord | null;
  onSuccessSubmit: (app: ApplicationRecord) => void;
  onCancel?: () => void;
}

export const SpmbRegistration: React.FC<SpmbRegistrationProps> = ({
  currentUser,
  existingApplication,
  onSuccessSubmit,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [track, setTrack] = useState<AdmissionTrack>(existingApplication?.admissionTrack || 'Tahfidz Prestasi');
  const [major, setMajor] = useState<ProgramMajor>(existingApplication?.programMajor || 'Keagamaan & Tahfidz Al-Qur\'an');
  
  // Biodata Siswa
  const [candidateName, setCandidateName] = useState(existingApplication?.candidateName || currentUser.name || '');
  const [nisn, setNisn] = useState(existingApplication?.nisn || currentUser.nisn || '');
  const [nik, setNik] = useState(existingApplication?.nik || '3201123456780009');
  const [birthPlace, setBirthPlace] = useState(existingApplication?.birthPlace || 'Bandung');
  const [birthDate, setBirthDate] = useState(existingApplication?.birthDate || '2010-05-12');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>(existingApplication?.gender || 'Laki-laki');
  const [previousSchool, setPreviousSchool] = useState(existingApplication?.previousSchool || 'MTs Al-Falah Bandung');

  // Data Wali
  const [parentName, setParentName] = useState(existingApplication?.parentName || 'H. Ahmad Supriyanto');
  const [parentPhone, setParentPhone] = useState(existingApplication?.parentPhone || currentUser.phone || '081234567890');
  const [parentJob, setParentJob] = useState(existingApplication?.parentJob || 'Wiraswasta / Pegawai');
  const [address, setAddress] = useState(existingApplication?.address || 'Jl. Raya Cibiru No. 88, Bandung');

  // Nilai & Prestasi
  const [tahfidzJuz, setTahfidzJuz] = useState<number>(existingApplication?.tahfidzJuz || 3);
  const [averageScore, setAverageScore] = useState<number>(existingApplication?.averageReportScore || 88.5);

  // Documents
  const [documents, setDocuments] = useState<UploadedDocuments>(existingApplication?.documents || {
    kkName: 'Scan_Kartu_Keluarga.pdf',
    kkUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    aktaName: 'Scan_Akta_Kelahiran.pdf',
    aktaUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    raporName: 'Buku_Rapor_Semester1-5.pdf',
    raporUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
    fotoName: 'Pas_Foto_Resmi_3x4.jpg',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    piagamName: 'Sertifikat_Tahfidz_Prestasi.pdf',
    piagamUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=80',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Mock or Real File Upload
  const handleFileUpload = (docKey: keyof UploadedDocuments, nameKey: keyof UploadedDocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`Ukuran berkas ${file.name} melebihi 5 MB. Harap perkecil berkas.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => ({
        ...prev,
        [nameKey]: file.name,
        [docKey]: reader.result as string,
      }));
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const regNumber = existingApplication?.registrationNo || `SPMB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newApp: ApplicationRecord = {
        id: existingApplication?.id || `app_${Date.now()}`,
        userId: currentUser.id,
        registrationNo: regNumber,
        candidateName,
        nisn,
        nik,
        birthPlace,
        birthDate,
        gender,
        previousSchool,
        parentName,
        parentPhone,
        parentJob,
        address,
        admissionTrack: track,
        programMajor: major,
        tahfidzJuz: Number(tahfidzJuz),
        averageReportScore: Number(averageScore),
        documents,
        status: existingApplication?.status || 'menunggu_verifikasi',
        submissionDate: existingApplication?.submissionDate || new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        verificationNotes: 'Formulir berhasil diajukan dan sedang dalam antrean verifikasi berkas oleh Panitia SPMB.',
        testSchedule: {
          date: 'Sabtu, 14 November 2026',
          time: '08.00 - 11.30 WIB',
          room: 'Gedung Akademik Ibnu Sina (Lantai 2)',
          examiner: 'Tim Penguji SPMB',
          instructions: 'Membawa Kartu Tanda Peserta Ujian dan alat tulis.',
        },
      };

      saveApplication(newApp);
      setIsSubmitting(false);
      onSuccessSubmit(newApp);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl text-slate-100">
      {/* Wizard Header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Formulir SPMB Online 2026/2027
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Pendaftaran Siswa Baru Mandiri
            </h2>
            <p className="text-xs text-slate-400">
              Isi data calon siswa secara lengkap dan unggah dokumen pendukung.
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
            >
              Kembali ke Dashboard
            </button>
          )}
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[
            { step: 1, title: 'Jalur', icon: GraduationCap },
            { step: 2, title: 'Biodata', icon: User },
            { step: 3, title: 'Wali', icon: Users },
            { step: 4, title: 'Nilai', icon: FileText },
            { step: 5, title: 'Unggah Berkas', icon: Upload },
          ].map((item) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </button>
                <span className={`text-[11px] mt-1 font-medium hidden sm:block ${isCurrent ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Jalur & Peminatan */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
              1. Pilih Jalur Pendaftaran
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'Tahfidz Prestasi' as AdmissionTrack,
                  title: 'Jalur Tahfidz Prestasi',
                  desc: 'Hafalan minimal 3 Juz Al-Qur\'an. Bebas tes potensi akademik & beasiswa SPP.',
                  badge: 'Unggulan',
                },
                {
                  id: 'Akademik Rapor' as AdmissionTrack,
                  title: 'Jalur Akademik Rapor',
                  desc: 'Rata-rata rapor minimal 85,0 pada mapel IPA, Matematika, Agama & Bahasa Inggris.',
                  badge: 'Rapor',
                },
                {
                  id: 'Reguler CBT' as AdmissionTrack,
                  title: 'Jalur Reguler CBT',
                  desc: 'Seleksi ujian Computer-Based Test terpadu dan tes wawancara komitmen.',
                  badge: 'Umum',
                },
                {
                  id: 'Afirmasi / KIP' as AdmissionTrack,
                  title: 'Jalur Afirmasi / KIP',
                  desc: 'Bantuan biaya dan beasiswa penuh bagi santri berprestasi pemilik KIP / PKH.',
                  badge: 'Beasiswa',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setTrack(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    track === item.id
                      ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-950'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
              2. Pilihan Peminatan / Jurusan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Keagamaan & Tahfidz Al-Qur\'an',
                'MIPA Riset & Sains',
                'IPS Humaniora & Bisnis',
                'Bahasa & Komunikasi Global',
              ].map((m) => (
                <div
                  key={m}
                  onClick={() => setMajor(m as ProgramMajor)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    major === m
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{m}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Biodata Calon Siswa */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Biodata Diri Calon Siswa
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Lengkap (Sesuai Ijazah / Akta) *
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                NISN (Nomor Induk Siswa Nasional) *
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="10 digit nomor NISN"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                NIK (Nomor Induk Kependudukan) *
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 digit NIK KK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Asal Sekolah / Madrasah (SMP / MTs)
            </label>
            <input
              type="text"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              placeholder="Contoh: MTsN 1 Bandung"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Data Orang Tua / Wali */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Data Orang Tua / Wali Murid
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Lengkap Ayah / Ibu / Wali *
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nomor WhatsApp Aktif Wali (Wajib untuk Info Hasil) *
              </label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pekerjaan Orang Tua / Wali
              </label>
              <input
                type="text"
                value={parentJob}
                onChange={(e) => setParentJob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Alamat Lengkap Domisili Calon Siswa
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Nilai Rapor & Tahfidz */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Riwayat Akademik & Hafalan Al-Qur'an
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Jumlah Hafalan Al-Qur'an (Juz)
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Hafalan mutqin yang siap diuji tasmi' saat wawancara.
              </p>
              <input
                type="number"
                min={0}
                max={30}
                value={tahfidzJuz}
                onChange={(e) => setTahfidzJuz(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-emerald-300 block mt-2">
                {tahfidzJuz >= 3 ? '✓ Memenuhi syarat Jalur Tahfidz Prestasi' : 'Pendaftar memiliki hafalan dasar'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Rata-rata Nilai Rapor Semester 1 - 5
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Skala 0 - 100 (Mapel IPA, Matematika, B. Inggris, Agama).
              </p>
              <input
                type="number"
                step="0.1"
                min={60}
                max={100}
                value={averageScore}
                onChange={(e) => setAverageScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-emerald-300 block mt-2">
                {averageScore >= 85 ? '✓ Memenuhi kriteria Jalur Unggulan' : 'Standar seleksi reguler'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Unggah Dokumen Mandiri */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Unggah Dokumen Pendukung Mandiri
            </h3>
            <span className="text-[11px] text-slate-400">
              Format: PDF, JPG, PNG (Maks. 5 MB)
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: '1. Scan Kartu Keluarga (KK) *', docKey: 'kkUrl' as const, nameKey: 'kkName' as const, required: true },
              { label: '2. Scan Akta Kelahiran Calon Siswa *', docKey: 'aktaUrl' as const, nameKey: 'aktaName' as const, required: true },
              { label: '3. Scan Buku Rapor Semester 1-5 / SKL *', docKey: 'raporUrl' as const, nameKey: 'raporName' as const, required: true },
              { label: '4. Pas Foto Resmi 3x4 Calon Siswa (Latar Merah/Biru) *', docKey: 'fotoUrl' as const, nameKey: 'fotoName' as const, required: true },
              { label: '5. Scan Piagam / Sertifikat Prestasi / KIP (Opsional)', docKey: 'piagamUrl' as const, nameKey: 'piagamName' as const, required: false },
            ].map((item, idx) => {
              const isUploaded = !!documents[item.docKey];
              const fileName = documents[item.nameKey] || 'Belum diunggah';

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isUploaded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {isUploaded ? <FileCheck className="w-5 h-5" /> : <Upload className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-200">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400">
                        {fileName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs cursor-pointer transition flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploaded ? 'Ganti Berkas' : 'Pilih Berkas'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(item.docKey, item.nameKey, e)}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Dengan mengirimkan formulir ini, saya menyatakan bahwa seluruh data dan dokumen yang dilampirkan adalah benar dan sah. Panitia berhak membatalkan pendaftaran jika ditemukan manipulasi data.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
          >
            Lanjut Langkah Berikutnya
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 transition cursor-pointer"
          >
            {isSubmitting ? (
              <span>Menyimpan Formulir...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim & Ajukan Pendaftaran Sekarang</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
