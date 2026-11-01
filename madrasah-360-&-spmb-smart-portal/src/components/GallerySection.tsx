import React, { useState } from 'react';
import { INITIAL_GALLERY } from '../data/mockData';
import { ActivityGalleryItem } from '../types';
import { Sparkles, Heart, MapPin, Calendar, X, Eye, Image as ImageIcon } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<ActivityGalleryItem[]>(INITIAL_GALLERY);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityGalleryItem | null>(null);

  const categories = [
    'Semua',
    'Tahfidz & Ibadah',
    'Sains & Robotika',
    'Ekstrakurikuler',
    'Olahraga & Seni',
    'Prestasi & Wisuda',
  ];

  const filtered = activeCategory === 'Semua'
    ? items
    : items.filter((it) => it.category === activeCategory);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5 mb-1">
            <ImageIcon className="w-4 h-4" /> Galeri Dokumentasi Aktivitas
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Semarak Kegiatan Santri & Kehidupan Kampus
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Potret keseharian santri dalam menuntut ilmu, beribadah, bereksperimen, dan mengukir prestasi.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition duration-300 shadow-xl cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition" />
              
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-slate-700">
                {item.category}
              </span>

              <button
                onClick={(e) => toggleLike(item.id, e)}
                className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-rose-400 text-xs font-bold flex items-center gap-1 border border-slate-700/60 hover:bg-rose-950 transition"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{item.likes}</span>
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[140px]">{item.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
              <span className="text-xs font-semibold text-emerald-400">{selectedPhoto.category}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-video max-h-[60vh] bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 bg-slate-900 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white">{selectedPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedPhoto.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {selectedPhoto.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPhoto.date}</span>
                <span className="flex items-center gap-1 text-rose-400"><Heart className="w-3.5 h-3.5 fill-current" /> {selectedPhoto.likes} Suka</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
