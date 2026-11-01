import React, { useState } from 'react';
import { MADRASAH_INFO } from '../data/mockData';
import { 
  BookOpen, Award, Compass, History, Target, Users, 
  CheckCircle2, Sparkles, Building2, Globe, GraduationCap
} from 'lucide-react';

export const MadrasahProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sejarah' | 'visi_misi' | 'program' | 'asatidz' | 'prestasi'>('sejarah');

  return (
    <div className="space-y-6 text-slate-100">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-2">
            Mengenal Lebih Dekat
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Profil & Sejarah Madrasah Aliyah Al-Ikhlas
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {MADRASAH_INFO.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> {MADRASAH_INFO.accreditation}
            </span>
            <span className="text-slate-400">
              NPSN: {MADRASAH_INFO.npsn}
            </span>
            <span className="text-slate-400">
              Didirikan: Tahun {MADRASAH_INFO.foundationYear}
            </span>
            <span className="text-slate-400">
              Kepala Madrasah: {MADRASAH_INFO.headmaster}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'sejarah', label: 'Sejarah Singkat', icon: History },
          { id: 'visi_misi', label: 'Visi & Misi', icon: Target },
          { id: 'program', label: 'Program Unggulan', icon: Sparkles },
          { id: 'asatidz', label: 'Dewan Pimpinan & Guru', icon: Users },
          { id: 'prestasi', label: 'Prestasi & Alumni', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap border transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: SEJARAH */}
      {activeTab === 'sejarah' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <History className="w-5 h-5" /> Jejak Langkah Sejarah Berdirinya Madrasah
            </h2>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              {MADRASAH_INFO.historyText.trim().split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-300">{para}</p>
              ))}
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
              Tonggak Perkembangan (Milestones)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { year: '1994', title: 'Awal Pendirian', desc: 'Dimulai dengan 35 santri perdana dan kurikulum salafiyah terpadu.' },
                { year: '2008', title: 'Transformasi Riset', desc: 'Mendirikan laboratorium sains terpadu & integrasi kurikulum Kemenag.' },
                { year: '2018', title: 'Akreditasi A Unggul', desc: 'Meraih nilai akreditasi 98 dan pembukaan program Tahfidz 30 Juz Bersanad.' },
                { year: '2026', title: 'Digital Smart Madrasah', desc: 'Implementasi Smart Classroom 75", Robotika AI, dan Virtual Tour 360°.' },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-black text-lg">{m.year}</span>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: VISI & MISI */}
      {activeTab === 'visi_misi' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Visi Madrasah 2030
            </span>
            <p className="text-base sm:text-lg font-bold text-white mt-2 leading-relaxed">
              "{MADRASAH_INFO.vision}"
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Misi Pendidikan Madrasah
            </h3>
            <div className="space-y-3">
              {MADRASAH_INFO.missions.map((misi, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{misi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PROGRAM UNGGULAN */}
      {activeTab === 'program' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Tahfidzul Qur\'an 30 Juz Bersanad',
              desc: 'Bimbingan intensif halaqah Al-Qur\'an setiap bada Subuh dan Maghrib dengan sanad muttashil ke Rasulullah SAW. Dilengkapi program tasmi\' sekali duduk dan karantina tahfidz liburan.',
              icon: BookOpen,
              color: 'text-amber-400',
            },
            {
              title: 'Madrasah Riset & Sains Robotika',
              desc: 'Pengembangan budaya ilmiah remaja (KIR), coding Python/C++, mikrokontroler Arduino & IoT, serta laboratorium biologi molekuler untuk persiapan OSN dan lomba internasional.',
              icon: Sparkles,
              color: 'text-cyan-400',
            },
            {
              title: 'Bilingual Cambridge & Arabic Active',
              desc: 'Lingkungan berbahasa Arab dan Inggris (Language Immersion Zone) 24 jam di asrama, persiapan TOEFL/IELTS dan sertifikasi TOAFL Timur Tengah.',
              icon: Globe,
              color: 'text-emerald-400',
            },
            {
              title: 'Karakter Kepesantrenan & Adab',
              desc: 'Kajian kitab kuning (Fathul Qorib, Ta\'limul Muta\'allim, Riyadhus Shalihin), pembiasaan sholat tahajjud berjamaah, puasa sunnah, dan kepemimpinan santri.',
              icon: GraduationCap,
              color: 'text-purple-400',
            },
          ].map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${prog.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">{prog.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{prog.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT 4: DEWAN ASATIDZ */}
      {activeTab === 'asatidz' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Drs. H. M. Zainuddin Al-Hafidz, M.Ag.',
              role: 'Kepala Madrasah Aliyah Al-Ikhlas',
              edu: 'S2 Studi Islam UIN Sunan Gunung Djati • Hafidz 30 Juz',
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
            },
            {
              name: 'KH. Dr. Muhammad Syamsul Ma\'arif, Lc., M.A.',
              role: 'Pengasuh Pondok & Dewan Penguji Tahfidz',
              edu: 'Doktor Hadits Universitas Al-Azhar Kairo Mesir',
              photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
            },
            {
              name: 'Dr. Hj. Siti Khadijah, M.A.',
              role: 'Wakil Kepala Bidang Kurikulum & Riset',
              edu: 'Doktor Pendidikan Bahasa Arab UPI Bandung',
              photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
            },
            {
              name: 'Ust. Fahmi Reza, S.Si., M.Kom.',
              role: 'Kepala Lab Komputer & Instruktur Robotika',
              edu: 'Magister Ilmu Komputer Institut Teknologi Bandung (ITB)',
              photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
            },
            {
              name: 'Ust. Ridwan Kamil, Lc.',
              role: 'Mudir Asrama Santri & Pembina Disiplin',
              edu: 'Alumni Universitas Islam Madinah (KSA)',
              photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
            },
            {
              name: 'Ustadzah Nurul Hidayati, M.Pd.',
              role: 'Koordinator Riset Sains Madrasah',
              edu: 'Magister Pendidikan Fisika Universitas Negeri Malang',
              photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
            },
          ].map((guru, idx) => (
            <div key={idx} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <img
                src={guru.photo}
                alt={guru.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{guru.name}</h4>
                <p className="text-xs text-emerald-400 font-medium">{guru.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{guru.edu}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 5: PRESTASI */}
      {activeTab === 'prestasi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-2xl font-black text-emerald-400">{MADRASAH_INFO.stats.ptnAcceptanceRate}</p>
              <p className="text-xs text-slate-400 mt-1">Lulusan Tembus PTN & LN</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-2xl font-black text-amber-400">{MADRASAH_INFO.stats.hafizRatio}</p>
              <p className="text-xs text-slate-400 mt-1">Capaian Tahfidz Santri</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-2xl font-black text-cyan-400">{MADRASAH_INFO.stats.internationalAwards}</p>
              <p className="text-xs text-slate-400 mt-1">Medali Internasional</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-2xl font-black text-purple-400">{MADRASAH_INFO.stats.alumniSpread}</p>
              <p className="text-xs text-slate-400 mt-1">Alumni Bersebaran</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" /> Penghargaan Bergengsi Terkini
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Juara 1 Nasional Madrasah Robotics Competition (MRC) Kemenag RI 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Medali Perak Musabaqah Hifdzil Qur'an (MHQ) 30 Juz Tingkat Internasional di Dubai</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Penghargaan Madrasah Berkinerja Terbaik & Berkarakter Riset Kemenag Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Juara Umum Olimpiade Sains Nasional (OSN) Tingkat Kota Bandung Bidang Astronomi & Fisika</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
