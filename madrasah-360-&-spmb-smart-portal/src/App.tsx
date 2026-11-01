/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthUser, ApplicationRecord, RoomProfile, Announcement } from './types';
import { 
  getStoredAuthUser, setStoredAuthUser, getStoredApplications, 
  getStoredAnnouncements, getStoredNotifications 
} from './utils/storage';
import { INITIAL_ROOMS } from './data/mockData';

// Components
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { DashboardUser } from './components/DashboardUser';
import { DashboardAdmin } from './components/DashboardAdmin';
import { VirtualTour360 } from './components/VirtualTour360';
import { RoomProfileModal } from './components/RoomProfileModal';
import { SpmbRegistration } from './components/SpmbRegistration';
import { SpmbCardModal } from './components/SpmbCardModal';
import { MadrasahProfile } from './components/MadrasahProfile';
import { GallerySection } from './components/GallerySection';
import { LocationAndContact } from './components/LocationAndContact';
import { ChatbotModal } from './components/ChatbotModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { Bot, Compass, Smartphone, Monitor, Shield, Sparkles } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredAuthUser());

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Data State
  const [applications, setApplications] = useState<ApplicationRecord[]>(getStoredApplications());
  const [announcements, setAnnouncements] = useState<Announcement[]>(getStoredAnnouncements());
  const [rooms] = useState<RoomProfile[]>(INITIAL_ROOMS);

  // Modals & Drawers
  const [selectedRoomForProfile, setSelectedRoomForProfile] = useState<RoomProfile | null>(null);
  const [selectedAppForCard, setSelectedAppForCard] = useState<ApplicationRecord | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(() => {
    return getStoredNotifications().filter((n) => !n.read).length;
  });

  // Target Tour Room ID if jumped from a link
  const [targetTourRoomId, setTargetTourRoomId] = useState<string>('gerbang_plaza');

  // APK Phone Frame Simulation mode
  const [isApkFrameMode, setIsApkFrameMode] = useState<boolean>(false);

  // Synchronize active tab when role changes
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('dashboard');
    }
  }, [currentUser?.role]);

  // Find candidate's personal application
  const myApplication = applications.find(
    (app) => app.userId === currentUser?.id || app.id === currentUser?.applicationId
  ) || null;

  // Refresh applications from storage
  const refreshApplications = () => {
    setApplications(getStoredApplications());
    setAnnouncements(getStoredAnnouncements());
  };

  const handleLogout = () => {
    setStoredAuthUser(null);
    setCurrentUser(null);
  };

  // If not logged in, display the Initial Login Screen (Fitur login di awal APK)
  if (!currentUser) {
    return (
      <AuthScreen
        onSuccessLogin={(user) => {
          setCurrentUser(user);
          setActiveTab(user.role === 'admin' ? 'admin_dashboard' : 'dashboard');
        }}
      />
    );
  }

  // Render Inner App Content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardUser
            currentUser={currentUser}
            application={myApplication}
            announcements={announcements}
            onOpenTour={() => setActiveTab('tour360')}
            onOpenSpmbForm={() => setActiveTab('spmb')}
            onOpenCardModal={() => {
              if (myApplication) setSelectedAppForCard(myApplication);
            }}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        );

      case 'admin_dashboard':
        return (
          <DashboardAdmin
            applications={applications}
            onRefreshApplications={refreshApplications}
            onSelectCandidateForCard={(app) => setSelectedAppForCard(app)}
          />
        );

      case 'spmb':
        return (
          <SpmbRegistration
            currentUser={currentUser}
            existingApplication={myApplication}
            onSuccessSubmit={(savedApp) => {
              refreshApplications();
              setSelectedAppForCard(savedApp);
              setActiveTab('dashboard');
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        );

      case 'tour360':
        return (
          <div className="space-y-4">
            <VirtualTour360
              rooms={rooms}
              initialRoomId={targetTourRoomId}
              onOpenRoomProfile={(room) => setSelectedRoomForProfile(room)}
            />
          </div>
        );

      case 'profil':
        return <MadrasahProfile />;

      case 'galeri':
        return <GallerySection />;

      case 'kontak':
        return <LocationAndContact />;

      default:
        return null;
    }
  };

  // Main App Layout
  const appContent = (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onLogout={handleLogout}
        isApkFrameMode={isApkFrameMode}
        onToggleApkFrameMode={() => setIsApkFrameMode(!isApkFrameMode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {renderTabContent()}
      </main>

      {/* Floating Action Button (FAB) for AI Chatbot Assistant */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <Bot className="w-5 h-5 text-slate-950" />
          <span>Tanya AI SPMB</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        </button>
      </div>

      {/* Modals & Overlays */}
      {selectedRoomForProfile && (
        <RoomProfileModal
          room={selectedRoomForProfile}
          onClose={() => setSelectedRoomForProfile(null)}
          onNavigateToTour={(roomId) => {
            setTargetTourRoomId(roomId);
            setActiveTab('tour360');
          }}
        />
      )}

      {selectedAppForCard && (
        <SpmbCardModal
          application={selectedAppForCard}
          onClose={() => setSelectedAppForCard(null)}
        />
      )}

      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onNotificationsChange={(cnt) => setUnreadNotifsCount(cnt)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Madrasah Aliyah Unggulan Al-Ikhlas. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Sistem SPMB Online</span>
            <span>•</span>
            <span>Virtual Tour 360°</span>
            <span>•</span>
            <span>Akreditasi A Unggul</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // If APK Mobile Frame Simulation is toggled on:
  if (isApkFrameMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
        <div className="mb-3 flex items-center justify-between w-full max-w-sm px-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Smartphone className="w-4 h-4" /> Simulasi Android APK Madrasah 360
          </span>
          <button
            onClick={() => setIsApkFrameMode(false)}
            className="text-xs text-slate-300 hover:text-white underline"
          >
            Layar Penuh &rarr;
          </button>
        </div>

        {/* Smartphone Shell */}
        <div className="relative w-full max-w-[414px] h-[860px] max-h-[94vh] bg-black rounded-[48px] p-3 shadow-2xl ring-4 ring-slate-800 border-4 border-slate-700 flex flex-col overflow-hidden">
          {/* Phone Dynamic Island / Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Screen Bezel Content */}
          <div className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden bg-slate-950 flex flex-col scrollbar-thin">
            {appContent}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5" />
        </div>
      </div>
    );
  }

  return appContent;
}
