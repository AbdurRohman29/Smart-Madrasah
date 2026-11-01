import React, { useState } from 'react';
import { MADRASAH_INFO } from '../data/mockData';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageCircle, 
  ExternalLink, CheckCircle2, ChevronDown, ChevronUp, Navigation, 
  Car, Train, Bus
} from 'lucide-react';

export const LocationAndContact: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      q: 'Bagaimana alur pendaftaran santri baru jalur online?',
      a: 'Alur pendaftaran terdiri dari 4 langkah mudah: (1) Buat akun di aplikasi ini, (2) Isi formulir biodata dan pilih jurusan/peminatan, (3) Unggah scan berkas pendukung (KK, Akta, Rapor, Foto), (4) Cetak Kartu Peserta Ujian dan tunggu pengumuman jadwal tes seleksi.',
    },
    {
      q: 'Apakah santri wajib tinggal di asrama (boarding)?',
      a: 'Untuk program unggulan Tahfidz Al-Qur\'an dan Kelas Riset Bilingual, santri diwajibkan mukim di asrama (boarding) agar bimbingan ibadah, tahfidz, dan bahasa dapat berjalan 24 jam. Namun, tersedia kuota santri non-boarding (fullday) bagi siswa yang berdomisili dalam radius < 5 km dari madrasah.',
    },
    {
      q: 'Bagaimana seleksi untuk Jalur Beasiswa Tahfidz?',
      a: 'Calon santri yang memiliki hafalan minimal 3 Juz berhak mendaftar Jalur Tahfidz. Pada saat tes seleksi, pendaftar akan diuji tasmi\' hafalan oleh dewan masyaikh tahfidz madrasah (tajwid, makhraj, dan kelancaran). Pendaftar dengan hafalan 5+ Juz mutqin berpeluang meraih beasiswa SPP penuh 100%.',
    },
    {
      q: 'Kapan hasil seleksi diumumkan?',
      a: 'Hasil seleksi berkas administrasi diumumkan maksimal 2x24 jam setelah pengajuan. Sedangkan hasil akhir tes seleksi akademik CBT dan wawancara diumumkan 3 hari kerja setelah pelaksanaan tes secara real-time di akun masing-masing.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMessage) return;
    setIsSent(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
      setTimeout(() => setIsSent(false), 4000);
    }, 600);
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${MADRASAH_INFO.lat},${MADRASAH_INFO.lng}`, '_blank');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Assalamu\'alaikum Panitia SPMB Madrasah Al-Ikhlas, saya ingin menanyakan seputar pendaftaran santri baru 2026.');
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5 mb-1">
          <MapPin className="w-4 h-4" /> Lokasi Kampus & Pelayanan Informasi
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Peta Lokasi, Rute & Kontak Panitia SPMB
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Kunjungi kampus terpadu kami atau hubungi panitia melalui kanal konsultasi resmi. Layanan PTSP siap melayani calon wali santri.
        </p>
      </div>

      {/* Grid: Map & Route Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulated Map */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white">
                Koordinat GPS: {MADRASAH_INFO.lat}, {MADRASAH_INFO.lng}
              </span>
            </div>
            <button
              onClick={openGoogleMaps}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              Buka di Google Maps
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden flex items-center justify-center group">
            {/* Styled Map Background Representation */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            
            {/* Road lines */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-800" fill="none">
              <path d="M 0 150 Q 250 180 500 120 T 1000 200" strokeWidth="18" stroke="rgba(30, 41, 59, 0.7)" />
              <path d="M 0 150 Q 250 180 500 120 T 1000 200" strokeWidth="2" strokeDasharray="8 6" stroke="#f59e0b" />
              <path d="M 300 0 Q 340 200 400 450" strokeWidth="14" stroke="rgba(30, 41, 59, 0.7)" />
              <path d="M 400 240 L 750 400" strokeWidth="10" stroke="rgba(30, 41, 59, 0.5)" />
            </svg>

            {/* Campus Outline Zone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 rounded-3xl bg-emerald-950/40 border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-3 text-center shadow-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2">
                <MapPin className="w-7 h-7" />
              </div>
              <p className="text-xs font-black text-white">{MADRASAH_INFO.name}</p>
              <p className="text-[10px] text-emerald-300">Kampus Terpadu 3,8 Hektar</p>
              <span className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pintu Masuk Utama (Gerbang Marhaban)
              </span>
            </div>

            {/* Nearby Points */}
            <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-300 space-y-1">
              <p className="font-bold text-white">Patokan Lokasi:</p>
              <p>• 500m dari Bundaran Cibiru</p>
              <p>• 10 Menit dari Stasiun Cimekar</p>
              <p>• 15 Menit dari Gerbang Tol Cileunyi</p>
            </div>
          </div>

          {/* Transit Guide */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40">
              <Car className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Kendaraan Pribadi</p>
                <p className="text-[11px] text-slate-400">Exit Tol Cileunyi arah Cibiru (3,5 km)</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40">
              <Train className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Kereta Api (KRL/Whoosh)</p>
                <p className="text-[11px] text-slate-400">Stasiun KCIC Tegalluar / KRD Cimekar</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40">
              <Bus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold">Angkutan Umum</p>
                <p className="text-[11px] text-slate-400">Halte Trans Metro Bandung (TMB) Cibiru</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card & Fast WhatsApp */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Kontak Layanan Informasi
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Alamat Kampus
                </span>
                <p className="text-white font-medium leading-relaxed">
                  {MADRASAH_INFO.address}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telepon Kantor PTSP
                </span>
                <p className="text-white font-bold text-sm">
                  {MADRASAH_INFO.phone}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Panitia
                </span>
                <p className="text-white font-medium">
                  {MADRASAH_INFO.spmbEmail}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Jam Layanan Konsultasi
                </span>
                <p className="text-white font-medium">
                  Senin - Sabtu: 07.30 - 15.30 WIB
                </p>
                <p className="text-[10px] text-slate-500">Ahad & Libur Nasional: Melalui WhatsApp</p>
              </div>
            </div>
          </div>

          <button
            onClick={openWhatsApp}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            Chat WhatsApp Panitia SPMB
          </button>
        </div>
      </div>

      {/* Grid: Message Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Inquiry Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            Kirim Pertanyaan / Pesan ke Panitia
          </h3>
          <p className="text-xs text-slate-400">
            Tim panitia SPMB akan merespons melalui email atau nomor WhatsApp yang Anda cantumkan.
          </p>

          {isSent ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Jazakallahu khair! Pesan Anda telah terkirim ke panitia SPMB Al-Ikhlas. Kami akan segera menghubungi Anda.</span>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama calon santri / wali"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email / No. WhatsApp *</label>
                  <input
                    type="text"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@gmail.com / 0812xxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Subjek Pertanyaan</label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Contoh: Pertanyaan seputar beasiswa tahfidz"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Isi Pesan *</label>
                <textarea
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan secara jelas..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Kirim Pesan Sekarang
              </button>
            </form>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">
            Tanya Jawab Populer (FAQ SPMB)
          </h3>
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-800/40 border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
