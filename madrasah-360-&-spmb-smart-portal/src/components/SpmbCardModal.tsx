import React from 'react';
import { ApplicationRecord } from '../types';
import { MADRASAH_INFO } from '../data/mockData';
import { X, Printer, Download, CheckCircle, QrCode, Shield, Calendar, MapPin } from 'lucide-react';

interface SpmbCardModalProps {
  application: ApplicationRecord;
  onClose: () => void;
}

export const SpmbCardModal: React.FC<SpmbCardModalProps> = ({ application, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Kartu Tanda Peserta SPMB 2026/2027</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Kartu
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="p-6 overflow-y-auto print:p-0 print:m-0 print:bg-white print:text-black">
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-emerald-700 shadow-xl relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-8xl font-black text-emerald-950 rotate-[-25deg]">
                AL-IKHLAS
              </span>
            </div>

            {/* Official Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-800 gap-3">
              <div className="w-14 h-14 rounded-xl bg-emerald-800 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow">
                MI
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] sm:text-xs font-semibold text-emerald-800 uppercase tracking-widest">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                  {MADRASAH_INFO.name}
                </h2>
                <p className="text-[10px] text-slate-600">
                  {MADRASAH_INFO.address} • Telp: {MADRASAH_INFO.phone}
                </p>
                <p className="text-[10px] font-bold text-emerald-700">
                  NPSN: {MADRASAH_INFO.npsn} | NSM: {MADRASAH_INFO.nsm} | Akreditasi: {MADRASAH_INFO.accreditation}
                </p>
              </div>
              <div className="w-14 h-14 border border-slate-300 rounded-lg p-1 flex items-center justify-center flex-shrink-0 bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
            </div>

            {/* Title Ribbon */}
            <div className="text-center my-4 bg-emerald-800 text-white py-1.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider">
              KARTU BUKTI PENDAFTARAN & TANDA PESERTA SELEKSI SPMB
            </div>

            {/* Candidate Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
              {/* Photo Box */}
              <div className="sm:col-span-1 flex flex-col items-center">
                <div className="w-32 h-40 rounded-lg border-2 border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner relative">
                  {application.documents.fotoUrl ? (
                    <img
                      src={application.documents.fotoUrl}
                      alt={application.candidateName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Pas Foto 3x4</span>
                  )}
                  <div className="absolute bottom-1 right-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                    VALID
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                    {application.admissionTrack}
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="sm:col-span-3 text-xs space-y-2">
                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Nomor Registrasi</span>
                  <span className="col-span-2 font-bold text-emerald-900 text-sm">
                    {application.registrationNo}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Nama Calon Siswa</span>
                  <span className="col-span-2 font-bold text-slate-900">
                    {application.candidateName}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">NISN / NIK</span>
                  <span className="col-span-2 text-slate-800">
                    {application.nisn} / {application.nik}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Tempat, Tanggal Lahir</span>
                  <span className="col-span-2 text-slate-800">
                    {application.birthPlace}, {application.birthDate} ({application.gender})
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Asal Madrasah/Sekolah</span>
                  <span className="col-span-2 text-slate-800 font-medium">
                    {application.previousSchool}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Pilihan Peminatan/Jurusan</span>
                  <span className="col-span-2 font-bold text-slate-900">
                    {application.programMajor}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Nama Orang Tua / Wali</span>
                  <span className="col-span-2 text-slate-800">
                    {application.parentName} ({application.parentPhone})
                  </span>
                </div>

                <div className="grid grid-cols-3 py-1">
                  <span className="font-semibold text-slate-600">Status Seleksi</span>
                  <span className="col-span-2 font-bold text-emerald-700 uppercase flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {application.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Schedule if verified */}
            {application.testSchedule && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Jadwal Tes Seleksi CBT & Wawancara:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                  <p><span className="font-semibold">Waktu:</span> {application.testSchedule.date}, {application.testSchedule.time}</p>
                  <p><span className="font-semibold">Lokasi:</span> {application.testSchedule.room}</p>
                  <p className="col-span-full"><span className="font-semibold">Instruksi:</span> {application.testSchedule.instructions}</p>
                </div>
              </div>
            )}

            {/* Signatures & Barcode */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 flex items-end justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-500">Barcode Verifikasi Sistem:</p>
                <div className="font-mono text-sm tracking-widest text-slate-800 font-bold mt-0.5">
                  ||| | | |||| | ||| |||| | | |||
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">{application.registrationNo}</p>
              </div>

              <div className="text-center text-[11px]">
                <p className="text-slate-600">Bandung, {application.submissionDate}</p>
                <p className="text-slate-600 font-medium">Panitia Penerimaan Murid Baru</p>
                <div className="h-10 flex items-center justify-center font-serif text-emerald-800 font-bold italic">
                  [Tanda Tangan & Cap Digital]
                </div>
                <p className="font-bold text-slate-900 underline">Ust. H. Danial Arifin, M.Pd.</p>
                <p className="text-[9px] text-slate-500">Ketua Panitia SPMB 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
