import React, { useState } from 'react';
import { RoomProfile } from '../types';
import { 
  X, Users, Maximize2, Wifi, Tv, Wind, Volume2, ShieldCheck, 
  Clock, Sparkles, Navigation, Layers, ChevronRight
} from 'lucide-react';

interface RoomProfileModalProps {
  room: RoomProfile | null;
  onClose: () => void;
  onNavigateToTour?: (roomId: string) => void;
}

export const RoomProfileModal: React.FC<RoomProfileModalProps> = ({
  room,
  onClose,
  onNavigateToTour,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {room.code}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {room.name}
              </h2>
              <p className="text-xs text-slate-400">{room.building} • {room.floor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Photo & Mini Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              <img
                src={room.galleryImages[selectedPhotoIndex] || room.galleryImages[0]}
                alt={room.name}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                    {room.category}
                  </span>
                  <p className="text-sm font-medium text-white drop-shadow-md">
                    {room.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {room.galleryImages.length > 1 && (
              <div className="flex gap-2">
                {room.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                      selectedPhotoIndex === idx
                        ? 'border-emerald-500 shadow-md scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Deskripsi Profil Ruangan
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Quick Specifications Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Spesifikasi & Fasilitas Ruang
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400">Kapasitas</p>
                  <p className="text-sm font-bold text-white">{room.capacity} Orang</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400">Luas Ruang</p>
                  <p className="text-sm font-bold text-white">{room.specs.areaSize}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400">Kecepatan Wi-Fi</p>
                  <p className="text-sm font-bold text-white">{room.specs.wifiSpeed}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
                <Wind className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400">Pendingin (AC)</p>
                  <p className="text-sm font-bold text-white">{room.specs.ac ? 'Tersedia (AC)' : 'Ventilasi Alami'}</p>
                </div>
              </div>
            </div>

            {/* Checklist Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 ${room.specs.smartboard ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                <Tv className="w-3.5 h-3.5" /> Interactive Smartboard: {room.specs.smartboard ? 'Ya' : 'Standar'}
              </span>
              <span className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 ${room.specs.soundSystem ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                <Volume2 className="w-3.5 h-3.5" /> Sound System Akustik: {room.specs.soundSystem ? 'Ya' : 'Tidak'}
              </span>
              <span className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 ${room.specs.cctv ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                <ShieldCheck className="w-3.5 h-3.5" /> Keamanan CCTV 24 Jam: {room.specs.cctv ? 'Aktif' : 'N/A'}
              </span>
            </div>
          </div>

          {/* Key Features & Equipment List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Keunggulan Ruangan
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                {room.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Jadwal & Perlengkapan
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Jadwal Akses:</p>
                  <p className="text-slate-200 font-medium">{room.schedule}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Inventaris Utama:</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {room.equipmentList.map((eq, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 text-xs">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wali Kelas / Penanggung Jawab Ruangan */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-800/40 border border-emerald-900/40 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={room.pic.photo}
                alt={room.pic.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/60 shadow-md"
              />
              <div>
                <p className="text-xs text-emerald-400 font-medium">Penanggung Jawab / Wali Ruang</p>
                <h5 className="text-sm font-bold text-white">{room.pic.name}</h5>
                <p className="text-xs text-slate-400">{room.pic.role} • {room.pic.email}</p>
              </div>
            </div>

            {onNavigateToTour && (
              <button
                onClick={() => {
                  onNavigateToTour(room.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                Jelajahi 360° Ruang Ini
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
