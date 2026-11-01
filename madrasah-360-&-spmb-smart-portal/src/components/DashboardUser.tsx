import React from 'react';
import { AuthUser, ApplicationRecord, Announcement } from '../types';
import { 
  Sparkles, FileText, CheckCircle2, Clock, AlertCircle, 
  Printer, ArrowRight, Compass, MessageSquare, Bell, Calendar, 
  Award, Shield, FileCheck
} from 'lucide-react';

interface DashboardUserProps {
  currentUser: AuthUser;
  application: ApplicationRecord | null;
  announcements: Announcement[];
  onOpenTour: () => void;
  onOpenSpmbForm: () => void;
  onOpenCardModal: () => void;
  onOpenChatbot: () => void;
}

export const DashboardUser: React.FC<DashboardUserProps> = ({
  currentUser,
  application,
  announcements,
  onOpenTour,
  onOpenSpmbForm,
  onOpenCardModal,
  onOpenChatbot,
}) => {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'diterima':
        return {
          label: 'Lolos Diterima',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: 'Selamat! Anda dinyatakan lolos seleksi penerimaan santri baru. Silakan unduh bukti kelulusan & jadwal daftar ulang.',
          step: 4,
        };
      case 'jadwal_tes':
      case 'terverifikasi':
        return {
          label: 'Berkas Terverifikasi',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          desc: 'Berkas administrasi Anda telah diverifikasi oleh Panitia. Anda siap mengikuti ujian seleksi dan wawancara.',
          step: 3,
        };
      case 'menunggu_verifikasi':
        return {
          label: 'Menunggu Verifikasi',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: 'Formulir dan berkas Anda sedang dalam proses peninjauan verifikator panitia (estimasi 1x24 jam).',
          step: 2,
        };
      case 'cadangan':
        return {
          label: 'Daftar Tunggu / Cadangan',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          desc: 'Anda masuk dalam kuota cadangan penerimaan santri baru peringkat atas.',
          step: 3,
        };
      case 'ditolak':
        return {
          label: 'Belum Memenuhi Syarat',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          desc: 'Mohon maaf, hasil seleksi Anda belum memenuhi batas kuota penerimaan gelombang ini.',
          step: 4,
        };
      default:
        return {
          label: 'Belum Terdaftar / Draft',
          color: 'bg-slate-700 text-slate-300 border-slate-600',
          desc: 'Anda belum menyelesaikan pengisian formulir pendaftaran SPMB.',
          step: 1,
        };
    }
  };

  const statusInfo = getStatusBadge(application?.status);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Calon Siswa Baru TA 2026/2027
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ahlan wa Sahlan, {currentUser.name}!
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Selamat datang di sistem seleksi dan pendaftaran online Madrasah Aliyah Unggulan Al-Ikhlas. Pantau status berkas, jadwal tes, serta jelajahi ruang kelas impian Anda secara 360 derajat interaktif.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {application ? (
              <button
                onClick={onOpenCardModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak Kartu Peserta Ujian
              </button>
            ) : (
              <button
                onClick={onOpenSpmbForm}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Isi Formulir SPMB Sekarang
              </button>
            )}

            <button
              onClick={onOpenTour}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Jelajahi Virtual Tour 360°
            </button>

            <button
              onClick={onOpenChatbot}
              className="px-4 py-2.5 rounded-xl bg-teal-900/40 hover:bg-teal-900/60 text-teal-300 font-semibold text-xs sm:text-sm border border-teal-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Tanya Asisten AI SPMB
            </button>
          </div>
        </div>

        {/* Decorative Watermark & Light Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Live Application Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Status Pendaftaran Calon Siswa
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-xl font-bold text-white">
                {application ? application.registrationNo : 'Belum Memiliki Nomor Pendaftaran'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {application && (
            <button
              onClick={onOpenSpmbForm}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 transition"
            >
              Ubah / Lengkapi Berkas
            </button>
          )}
        </div>

        <p className="text-sm text-slate-300 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
          {statusInfo.desc}
          {application?.verificationNotes && (
            <span className="block mt-1 text-xs text-amber-300 font-medium">
              Catatan Panitia: "{application.verificationNotes}"
            </span>
          )}
        </p>

        {/* Animated Progress Stages */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, label: 'Isi Formulir' },
              { num: 2, label: 'Verifikasi Berkas' },
              { num: 3, label: 'Ujian & Wawancara' },
              { num: 4, label: 'Hasil Seleksi' },
            ].map((st) => {
              const isActive = statusInfo.step >= st.num;
              return (
                <div key={st.num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-2 transition ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-medium ${isActive ? 'text-emerald-300 font-bold' : 'text-slate-500'}`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Schedule Card if available */}
        {application?.testSchedule && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              Jadwal Tes Potensi Akademik CBT & Wawancara
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <p className="text-slate-400">Hari & Waktu</p>
                <p className="text-white font-bold">{application.testSchedule.date}, {application.testSchedule.time}</p>
              </div>
              <div>
                <p className="text-slate-400">Ruangan Ujian</p>
                <p className="text-white font-bold">{application.testSchedule.room}</p>
              </div>
              <div>
                <p className="text-slate-400">Penguji</p>
                <p className="text-white font-bold">{application.testSchedule.examiner}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Details & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Summary Specs */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" /> Ringkasan Pendaftaran
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Jalur Pendaftaran:</span>
              <span className="text-white font-bold">{application?.admissionTrack || 'Tahfidz Prestasi'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Pilihan Jurusan:</span>
              <span className="text-white font-bold text-right">{application?.programMajor || 'Keagamaan & Tahfidz'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Asal Madrasah/Sekolah:</span>
              <span className="text-white font-medium">{application?.previousSchool || '-'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Hafalan Al-Qur'an:</span>
              <span className="text-emerald-400 font-bold">{application?.tahfidzJuz ? `${application.tahfidzJuz} Juz` : '-'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Rata-rata Rapor:</span>
              <span className="text-white font-bold">{application?.averageReportScore || '-'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenCardModal}
              disabled={!application}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Lihat Detail Berkas Pendaftaran
            </button>
          </div>
        </div>

        {/* Announcements Stream */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4" /> Pengumuman Penting Calon Siswa
            </h3>
            <span className="text-[11px] text-slate-400">
              Terupdate secara berkala
            </span>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/40 transition space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-500">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
