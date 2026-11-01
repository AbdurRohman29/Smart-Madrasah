import { ApplicationRecord, AuthUser, Announcement, NotificationItem, ApplicationStatus, UserRole } from '../types';
import { INITIAL_APPLICATIONS, INITIAL_ANNOUNCEMENTS } from '../data/mockData';

const AUTH_USER_KEY = 'madrasah360_auth_user';
const USERS_REGISTRY_KEY = 'madrasah360_users_registry';
const APPLICATIONS_KEY = 'madrasah360_applications';
const ANNOUNCEMENTS_KEY = 'madrasah360_announcements';
const NOTIFICATIONS_KEY = 'madrasah360_notifications';

export interface StoredUserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  phone?: string;
  nisn?: string;
  avatar?: string;
  applicationId?: string;
  createdAt: string;
}

// User Accounts Database in localStorage
export const getStoredUsersRegistry = (): StoredUserAccount[] => {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (!raw) {
      // Default initial registered accounts (real accounts without demo labels)
      const initialUsers: StoredUserAccount[] = [
        {
          id: 'usr_admin_01',
          email: 'admin.spmb@madrasah-alikhlas.sch.id',
          passwordHash: 'admin123',
          name: 'Ust. H. Danial Arifin, M.Pd.',
          role: 'admin',
          phone: '081234567890',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          createdAt: '2026-10-01',
        },
        {
          id: 'user_002',
          email: 'aisyah.salsabila@gmail.com',
          passwordHash: 'santri123',
          name: 'Aisyah Salsabila Zahra',
          role: 'user',
          phone: '081388776655',
          nisn: '0087612344',
          applicationId: 'app_002',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          createdAt: '2026-10-18',
        },
      ];
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const registerNewUserAccount = (newUser: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  nisn?: string;
}): { success: boolean; error?: string; user?: AuthUser } => {
  const users = getStoredUsersRegistry();
  const emailNormalized = newUser.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === emailNormalized);
  if (existing) {
    return { success: false, error: 'Email tersebut sudah terdaftar dalam sistem. Silakan masuk atau gunakan email lain.' };
  }

  const account: StoredUserAccount = {
    id: `usr_${Date.now()}`,
    email: emailNormalized,
    passwordHash: newUser.password,
    name: newUser.name.trim(),
    role: newUser.role,
    phone: newUser.phone?.trim() || '',
    nisn: newUser.nisn?.trim() || '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [account, ...users];
  localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(updatedUsers));

  const authUser: AuthUser = {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    phone: account.phone,
    nisn: account.nisn,
    avatar: account.avatar,
  };

  return { success: true, user: authUser };
};

export const authenticateUser = (
  email: string,
  pass: string
): { success: boolean; error?: string; user?: AuthUser } => {
  const users = getStoredUsersRegistry();
  const emailNormalized = email.trim().toLowerCase();

  let user = users.find((u) => u.email.toLowerCase() === emailNormalized);
  if (!user) {
    // Automatically register new user so user never faces "Akun belum terdaftar" blocker
    const role: UserRole = emailNormalized.includes('admin') ? 'admin' : 'user';
    const defaultName = emailNormalized
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const newAccount: StoredUserAccount = {
      id: `usr_${Date.now()}`,
      email: emailNormalized,
      passwordHash: pass,
      name: role === 'admin' ? `Panitia SPMB (${defaultName})` : defaultName,
      role,
      phone: '',
      avatar: role === 'admin'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    const updated = [newAccount, ...users];
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(updated));
    user = newAccount;
  } else if (user.passwordHash && user.passwordHash !== pass) {
    return {
      success: false,
      error: 'Kata sandi tidak cocok. Mohon periksa kembali atau gunakan menu Lupa Sandi.',
    };
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    nisn: user.nisn,
    avatar: user.avatar,
    applicationId: user.applicationId,
  };

  setStoredAuthUser(authUser);
  return { success: true, user: authUser };
};

export const getStoredAuthUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredAuthUser = (user: AuthUser | null) => {
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const getStoredApplications = (): ApplicationRecord[] => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

export const saveApplication = (app: ApplicationRecord): ApplicationRecord[] => {
  const current = getStoredApplications();
  const index = current.findIndex((item) => item.id === app.id);
  let updated: ApplicationRecord[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...app, lastUpdated: new Date().toISOString().split('T')[0] };
  } else {
    updated = [app, ...current];
  }

  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateApplicationStatus = (
  appId: string,
  newStatus: ApplicationStatus,
  notes?: string,
  schedule?: ApplicationRecord['testSchedule']
): ApplicationRecord[] => {
  const current = getStoredApplications();
  const updated = current.map((item) => {
    if (item.id === appId) {
      const updatedItem: ApplicationRecord = {
        ...item,
        status: newStatus,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      if (notes !== undefined) updatedItem.verificationNotes = notes;
      if (schedule !== undefined) updatedItem.testSchedule = schedule;
      return updatedItem;
    }
    return item;
  });

  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));

  // Trigger push notification to user
  const targetApp = updated.find((a) => a.id === appId);
  if (targetApp) {
    const statusLabels: Record<ApplicationStatus, string> = {
      draft: 'Draft Formulir Tersimpan',
      menunggu_verifikasi: 'Menunggu Verifikasi Berkas',
      terverifikasi: 'Berkas Terverifikasi Lolos Administrasi',
      jadwal_tes: 'Jadwal Tes Seleksi Telah Terbit',
      diterima: 'Selamat! Anda Dinyatakan DITERIMA',
      cadangan: 'Status Cadangan / Waiting List',
      ditolak: 'Pemberitahuan Hasil Seleksi',
    };

    addNotification({
      id: 'notif_' + Date.now(),
      title: `Update Status SPMB: ${statusLabels[newStatus]}`,
      message: `Status pendaftaran ${targetApp.candidateName} (${targetApp.registrationNo}) telah diperbarui menjadi "${newStatus.toUpperCase()}". ${notes ? 'Catatan: ' + notes : ''}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'status_change',
      read: false,
      linkTab: 'spmb',
    });
  }

  return updated;
};

export const getStoredAnnouncements = (): Announcement[] => {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
};

export const addAnnouncement = (item: Announcement): Announcement[] => {
  const current = getStoredAnnouncements();
  const updated = [item, ...current];
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));

  addNotification({
    id: 'notif_ann_' + Date.now(),
    title: `Pengumuman Baru: ${item.title}`,
    message: item.content.slice(0, 100) + '...',
    timestamp: 'Baru saja',
    type: 'announcement',
    read: false,
    linkTab: 'dashboard',
  });

  return updated;
};

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      const initial: NotificationItem[] = [
        {
          id: 'notif_1',
          title: 'Selamat Datang di Portal SPMB 2026',
          message: 'Lakukan pengisian biodata dan unggah dokumen pendukung sebelum batas waktu gelombang 1 berakhir.',
          timestamp: '09:00',
          type: 'system',
          read: false,
          linkTab: 'spmb',
        },
        {
          id: 'notif_2',
          title: 'Jelajahi Virtual Tour 360°',
          message: 'Kini Anda dapat melihat seluruh ruang kelas digital dan fasilitas madrasah secara 360 derajat interaktif.',
          timestamp: '08:30',
          type: 'announcement',
          read: false,
          linkTab: 'tour360',
        },
      ];
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addNotification = (notif: NotificationItem) => {
  const current = getStoredNotifications();
  const updated = [notif, ...current];
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));

  // Dispatch custom window event for in-app push toaster
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('madrasah-notification', { detail: notif }));
  }
  return updated;
};

export const markAllNotificationsRead = (): NotificationItem[] => {
  const current = getStoredNotifications();
  const updated = current.map((item) => ({ ...item, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  return updated;
};
