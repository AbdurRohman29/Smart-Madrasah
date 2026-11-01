import React from 'react';
import { AuthUser } from '../types';
import { 
  Compass, LayoutDashboard, FileText, Building2, Image, 
  MapPin, Bot, Bell, LogOut, Smartphone, Monitor, Shield, 
  User, CheckCircle
} from 'lucide-react';

interface NavbarProps {
  currentUser: AuthUser;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
  onOpenChatbot: () => void;
  onLogout: () => void;
  isApkFrameMode: boolean;
  onToggleApkFrameMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenNotifications,
  unreadNotifsCount,
  onOpenChatbot,
  onLogout,
  isApkFrameMode,
  onToggleApkFrameMode,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Navigation Items
  const navItems = isAdmin
    ? [
        { id: 'admin_dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
        { id: 'tour360', label: 'Virtual Tour 360°', icon: Compass },
        { id: 'profil', label: 'Profil & Sejarah', icon: Building2 },
        { id: 'galeri', label: 'Galeri Kegiatan', icon: Image },
        { id: 'kontak', label: 'Kontak & Peta', icon: MapPin },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard Siswa', icon: LayoutDashboard },
        { id: 'spmb', label: 'SPMB Online', icon: FileText },
        { id: 'tour360', label: 'Virtual Tour 360°', icon: Compass },
        { id: 'profil', label: 'Profil & Sejarah', icon: Building2 },
        { id: 'galeri', label: 'Galeri Kegiatan', icon: Image },
        { id: 'kontak', label: 'Kontak & Peta', icon: MapPin },
      ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & App Title */}
          <div 
            onClick={() => onSelectTab(isAdmin ? 'admin_dashboard' : 'dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Madrasah Al-Ikhlas
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  360°
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Virtual Tour & Portal SPMB Online
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: AI Assistant, Notifications, Role Badge & User Profile */}
          <div className="flex items-center gap-2">
            {/* AI SPMB Button */}
            <button
              onClick={onOpenChatbot}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-900/50 hover:bg-teal-900/80 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="Tanya Asisten AI SPMB"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">AI SPMB</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* APK Mobile Frame Simulator Toggle */}
            <button
              onClick={onToggleApkFrameMode}
              className={`p-2 rounded-xl transition text-xs font-medium hidden lg:flex items-center gap-1 border ${
                isApkFrameMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isApkFrameMode ? 'Kembali ke Layar Penuh Desktop' : 'Simulasi Tampilan APK Ponsel'}
            >
              {isApkFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              <span className="text-[11px]">{isApkFrameMode ? 'Desktop' : 'Mode APK'}</span>
            </button>

            {/* Authenticated User Identity & Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </p>
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                  isAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isAdmin ? 'Panitia SPMB' : 'Calon Siswa'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                title="Keluar dari Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto scrollbar-thin border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
