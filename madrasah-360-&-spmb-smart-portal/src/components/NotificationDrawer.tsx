import React, { useEffect, useState } from 'react';
import { NotificationItem } from '../types';
import { 
  getStoredNotifications, markAllNotificationsRead, addNotification 
} from '../utils/storage';
import { 
  Bell, X, CheckCheck, Sparkles, AlertCircle, Calendar, 
  ArrowRight, ShieldCheck
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
  onNotificationsChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onNotificationsChange,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  // Listen to custom window events for real-time status push
  useEffect(() => {
    const handlePushEvent = (e: any) => {
      const newNotif = e.detail as NotificationItem;
      setActiveToast(newNotif);
      setNotifications(getStoredNotifications());
      onNotificationsChange?.(getStoredNotifications().filter((n) => !n.read).length);

      // Auto dismiss toast after 6 seconds
      const timer = setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 6000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('madrasah-notification', handlePushEvent);
    return () => window.removeEventListener('madrasah-notification', handlePushEvent);
  }, [onNotificationsChange]);

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
    onNotificationsChange?.(0);
  };

  const handleClickItem = (item: NotificationItem) => {
    if (item.linkTab && onSelectTab) {
      onSelectTab(item.linkTab);
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Real-time Push Toast (Slides down from top right) */}
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-[90%] bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Pemberitahuan Real-Time
              </span>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5">
            {activeToast.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
            {activeToast.message}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">{activeToast.timestamp}</span>
            {activeToast.linkTab && onSelectTab && (
              <button
                onClick={() => {
                  onSelectTab(activeToast.linkTab!);
                  setActiveToast(null);
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Lihat Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Pusat Notifikasi & Pengumuman</h3>
                  <p className="text-[11px] text-slate-400">
                    {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : 'Semua pesan telah dibaca'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title="Tandai semua telah dibaca"
                    className="p-1.5 rounded-lg text-xs text-emerald-400 hover:bg-slate-800 flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Belum ada notifikasi saat ini.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleClickItem(notif)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      notif.read
                        ? 'bg-slate-800/40 border-slate-800 opacity-75'
                        : 'bg-slate-800/90 border-emerald-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-600' : 'bg-emerald-400'}`} />
                        <h4 className="text-xs font-bold text-white line-clamp-1">{notif.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{notif.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.linkTab && (
                      <span className="inline-block mt-2 text-[10px] text-emerald-400 font-bold hover:underline">
                        Klik untuk membuka menu &rarr;
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
