import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus, AdmissionTrack, Announcement } from '../types';
import { exportApplicationsToExcel } from '../utils/excelExport';
import { updateApplicationStatus, addAnnouncement } from '../utils/storage';
import { 
  Users, UserCheck, Clock, CheckCircle2, XCircle, Search, 
  Filter, Download, Eye, FileText, Calendar, PlusCircle, 
  ShieldCheck, ArrowUpDown, ChevronRight, X, Sparkles, Send, 
  Phone, Mail, FileCheck, Layers
} from 'lucide-react';

interface DashboardAdminProps {
  applications: ApplicationRecord[];
  onRefreshApplications: () => void;
  onSelectCandidateForCard?: (app: ApplicationRecord) => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  applications,
  onRefreshApplications,
  onSelectCandidateForCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // Status Change State in modal
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('terverifikasi');
  const [verifierNotes, setVerifierNotes] = useState('');
  const [testDate, setTestDate] = useState('Sabtu, 14 November 2026');
  const [testTime, setTestTime] = useState('08.00 - 11.30 WIB');
  const [testRoom, setTestRoom] = useState('Lab Komputer CBT Al-Biruni');
  const [examiner, setExaminer] = useState('Tim Penguji SPMB Al-Ikhlas');
  const [testNotes, setTestNotes] = useState('Membawa kartu tanda peserta ujian dan pensil 2B.');

  // Broadcast Announcement State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('Pengumuman');
  const [annContent, setAnnContent] = useState('');

  // Statistics Calculation
  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'menunggu_verifikasi').length;
  const verified = applications.filter((a) => a.status === 'terverifikasi' || a.status === 'jadwal_tes').length;
  const accepted = applications.filter((a) => a.status === 'diterima').length;
  const waitlist = applications.filter((a) => a.status === 'cadangan').length;
  const rejected = applications.filter((a) => a.status === 'ditolak').length;

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchQuery =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nisn.includes(searchQuery) ||
      app.previousSchool.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchTrack = filterTrack === 'all' || app.admissionTrack === filterTrack;

    return matchQuery && matchStatus && matchTrack;
  });

  const handleOpenDetailModal = (app: ApplicationRecord) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setVerifierNotes(app.verificationNotes || '');
    if (app.testSchedule) {
      setTestDate(app.testSchedule.date);
      setTestTime(app.testSchedule.time);
      setTestRoom(app.testSchedule.room);
      setExaminer(app.testSchedule.examiner);
      setTestNotes(app.testSchedule.instructions);
    }
  };

  const handleSaveStatusUpdate = () => {
    if (!selectedApp) return;

    const schedule =
      newStatus === 'terverifikasi' || newStatus === 'jadwal_tes'
        ? {
            date: testDate,
            time: testTime,
            room: testRoom,
            examiner,
            instructions: testNotes,
          }
        : selectedApp.testSchedule;

    updateApplicationStatus(selectedApp.id, newStatus, verifierNotes, schedule);
    onRefreshApplications();
    setSelectedApp(null);
  };

  const handleExportExcel = () => {
    exportApplicationsToExcel(filteredApps, 'Laporan_Pendaftar_SPMB_AlIkhlas');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    addAnnouncement({
      id: 'ann_' + Date.now(),
      title: annTitle,
      category: annCategory,
      content: annContent,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      isUrgent: true,
      targetRole: 'calon_siswa',
    });

    setAnnTitle('');
    setAnnContent('');
    setIsBroadcastOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin & Panitia SPMB
            </span>
            <span className="text-xs text-slate-400 font-medium">Tahun Ajaran 2026/2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Dashboard Pengelolaan Calon Siswa Baru
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Pantau statistik penerimaan, verifikasi berkas dokumen, dan unduh laporan Excel resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            Buat Pengumuman Baru
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Ekspor Data ke Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Total Pendaftar
          </p>
          <p className="text-2xl font-black text-white mt-1">{total}</p>
          <span className="text-[10px] text-slate-500">Pendaftar Online</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30">
          <p className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
          </p>
          <p className="text-2xl font-black text-amber-400 mt-1">{pending}</p>
          <span className="text-[10px] text-slate-500">Perlu Diperiksa</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30">
          <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Terverifikasi
          </p>
          <p className="text-2xl font-black text-blue-400 mt-1">{verified}</p>
          <span className="text-[10px] text-slate-500">Siap Ujian CBT</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30">
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Diterima
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{accepted}</p>
          <span className="text-[10px] text-slate-500">Lulus Seleksi</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30">
          <p className="text-xs text-purple-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Cadangan
          </p>
          <p className="text-2xl font-black text-purple-400 mt-1">{waitlist}</p>
          <span className="text-[10px] text-slate-500">Waiting List</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30">
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Ditolak
          </p>
          <p className="text-2xl font-black text-rose-400 mt-1">{rejected}</p>
          <span className="text-[10px] text-slate-500">Tidak Lolos</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NISN, atau sekolah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="diterima">Diterima</option>
            <option value="cadangan">Cadangan</option>
            <option value="ditolak">Ditolak</option>
          </select>

          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Jalur</option>
            <option value="Tahfidz Prestasi">Tahfidz Prestasi</option>
            <option value="Akademik Rapor">Akademik Rapor</option>
            <option value="Reguler CBT">Reguler CBT</option>
            <option value="Afirmasi / KIP">Afirmasi / KIP</option>
          </select>

          <span className="text-xs text-slate-400 font-semibold ml-2">
            Hasil: {filteredApps.length} pendaftar
          </span>
        </div>
      </div>

      {/* Candidate Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">No. Reg / Calon Siswa</th>
                <th className="px-4 py-3.5">NISN / Asal Sekolah</th>
                <th className="px-4 py-3.5">Jalur & Peminatan</th>
                <th className="px-4 py-3.5">Hafalan / Rapor</th>
                <th className="px-4 py-3.5">Status Seleksi</th>
                <th className="px-4 py-3.5 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Tidak ditemukan calon pendaftar yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                          {app.documents.fotoUrl ? (
                            <img src={app.documents.fotoUrl} alt={app.candidateName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-400">
                              {app.candidateName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{app.candidateName}</p>
                          <p className="text-[11px] text-emerald-400 font-mono">{app.registrationNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-white font-medium">{app.nisn}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{app.previousSchool}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700 mb-0.5">
                        {app.admissionTrack}
                      </span>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{app.programMajor}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs text-white">
                        Hafalan: <span className="font-bold text-emerald-400">{app.tahfidzJuz ? `${app.tahfidzJuz} Juz` : '-'}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Rapor: <span className="font-semibold text-slate-300">{app.averageReportScore || '-'}</span>
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          app.status === 'diterima'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'terverifikasi' || app.status === 'jadwal_tes'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : app.status === 'menunggu_verifikasi'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : app.status === 'cadangan'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetailModal(app)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Verifikasi</span>
                        </button>

                        {onSelectCandidateForCard && (
                          <button
                            onClick={() => onSelectCandidateForCard(app)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Lihat Kartu Ujian"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VERIFICATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 rounded-md">
                  {selectedApp.registrationNo}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Verifikasi Pendaftaran: {selectedApp.candidateName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedApp.previousSchool} • {selectedApp.admissionTrack}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Candidate Quick Biodata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs">
                <div>
                  <p className="text-slate-400">NISN / NIK</p>
                  <p className="text-white font-bold">{selectedApp.nisn} / {selectedApp.nik}</p>
                </div>
                <div>
                  <p className="text-slate-400">Tempat, Tanggal Lahir</p>
                  <p className="text-white font-bold">{selectedApp.birthPlace}, {selectedApp.birthDate} ({selectedApp.gender})</p>
                </div>
                <div>
                  <p className="text-slate-400">Orang Tua / Wali</p>
                  <p className="text-white font-bold">{selectedApp.parentName} ({selectedApp.parentJob})</p>
                </div>
                <div>
                  <p className="text-slate-400">Kontak WhatsApp</p>
                  <a
                    href={`https://wa.me/${selectedApp.parentPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedApp.parentPhone}
                  </a>
                </div>
                <div className="col-span-full">
                  <p className="text-slate-400">Alamat Domisili</p>
                  <p className="text-slate-200">{selectedApp.address}</p>
                </div>
              </div>

              {/* Uploaded Documents Inspection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Berkas Dokumen yang Diunggah
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Kartu Keluarga (KK)', url: selectedApp.documents.kkUrl, name: selectedApp.documents.kkName },
                    { label: 'Akta Kelahiran', url: selectedApp.documents.aktaUrl, name: selectedApp.documents.aktaName },
                    { label: 'Buku Rapor / SKL', url: selectedApp.documents.raporUrl, name: selectedApp.documents.raporName },
                    { label: 'Pas Foto Resmi', url: selectedApp.documents.fotoUrl, name: selectedApp.documents.fotoName },
                    { label: 'Piagam / Prestasi', url: selectedApp.documents.piagamUrl, name: selectedApp.documents.piagamName },
                  ].map((doc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{doc.label}</p>
                        <p className="text-slate-400 truncate max-w-[180px] text-[11px]">{doc.name || 'Tidak dilampirkan'}</p>
                      </div>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold hover:bg-emerald-500/30 transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Status Selection & Verifier Notes */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-800/40 border border-emerald-500/30 space-y-4">
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                  Perbarui Status & Terbitkan Keputusan Seleksi
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pilih Status Baru:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { status: 'terverifikasi' as ApplicationStatus, label: 'Terverifikasi' },
                      { status: 'jadwal_tes' as ApplicationStatus, label: 'Jadwal Tes' },
                      { status: 'diterima' as ApplicationStatus, label: 'Diterima' },
                      { status: 'ditolak' as ApplicationStatus, label: 'Ditolak' },
                    ].map((item) => (
                      <button
                        key={item.status}
                        type="button"
                        onClick={() => setNewStatus(item.status)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase border transition ${
                          newStatus === item.status
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catatan Verifikator untuk Calon Siswa:
                  </label>
                  <textarea
                    rows={2}
                    value={verifierNotes}
                    onChange={(e) => setVerifierNotes(e.target.value)}
                    placeholder="Contoh: Berkas lengkap dan sah. Harap hadir tepat waktu untuk ujian seleksi CBT."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {(newStatus === 'terverifikasi' || newStatus === 'jadwal_tes') && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Konfigurasi Jadwal Tes CBT & Wawancara:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Tanggal Tes</label>
                        <input
                          type="text"
                          value={testDate}
                          onChange={(e) => setTestDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Jam Pelaksanaan</label>
                        <input
                          type="text"
                          value={testTime}
                          onChange={(e) => setTestTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Ruangan Ujian</label>
                        <input
                          type="text"
                          value={testRoom}
                          onChange={(e) => setTestRoom(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Penguji / PIC</label>
                        <input
                          type="text"
                          value={examiner}
                          onChange={(e) => setExaminer(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveStatusUpdate}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan & Kirim Notifikasi Real-time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST ANNOUNCEMENT MODAL */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Buat Pengumuman Baru untuk Calon Siswa
              </h3>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Daftar Ulang Siswa Baru"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Pengumuman">Pengumuman Umum</option>
                  <option value="Jadwal Tes">Jadwal Tes & Ujian</option>
                  <option value="Kelulusan">Kelulusan & Hasil Seleksi</option>
                  <option value="Daftar Ulang">Daftar Ulang</option>
                  <option value="Kegiatan">Kegiatan & Matsama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Isi Pesan Pengumuman *
                </label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Tuliskan detail pengumuman yang akan disiarkan kepada calon siswa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Siarkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
