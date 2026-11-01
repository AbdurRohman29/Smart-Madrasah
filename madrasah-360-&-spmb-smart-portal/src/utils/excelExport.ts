import * as XLSX from 'xlsx';
import { ApplicationRecord } from '../types';

export const exportApplicationsToExcel = (applications: ApplicationRecord[], filenamePrefix = 'Data_Pendaftar_SPMB') => {
  // Map application records to friendly table columns
  const rows = applications.map((app, index) => ({
    'No': index + 1,
    'No Pendaftaran': app.registrationNo,
    'Nama Lengkap Calon Siswa': app.candidateName,
    'NISN': app.nisn,
    'NIK': app.nik,
    'Jenis Kelamin': app.gender,
    'Tempat, Tanggal Lahir': `${app.birthPlace}, ${app.birthDate}`,
    'Asal Sekolah': app.previousSchool,
    'Pilihan Jurusan': app.programMajor,
    'Jalur Pendaftaran': app.admissionTrack,
    'Hafalan (Juz)': app.tahfidzJuz || 0,
    'Rata-rata Rapor': app.averageReportScore || '-',
    'Status Seleksi': app.status.toUpperCase(),
    'Nilai CBT': app.scores?.cbt ?? '-',
    'Nilai Wawancara': app.scores?.wawancara ?? '-',
    'Nilai Tahfidz': app.scores?.tahfidz ?? '-',
    'Nama Orang Tua / Wali': app.parentName,
    'No WhatsApp': app.parentPhone,
    'Pekerjaan Wali': app.parentJob,
    'Alamat Domisili': app.address,
    'Tanggal Pengajuan': app.submissionDate,
    'Update Terakhir': app.lastUpdated,
    'Catatan Verifikator': app.verificationNotes || '-',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const columnKeys = Object.keys(rows[0] || {});
  const colWidths = columnKeys.map((key) => {
    let maxLength = key.length;
    rows.forEach((r) => {
      const val = String((r as any)[key] ?? '');
      if (val.length > maxLength) maxLength = Math.min(val.length, 40);
    });
    return { wch: Math.max(maxLength + 3, 10) };
  });

  worksheet['!cols'] = colWidths;

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar_SPMB_2026');

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${dateStr}.xlsx`;

  // Write and trigger download
  XLSX.writeFile(workbook, filename);
};
