import { create } from 'zustand';

interface AppState {
  isDark: boolean;
  notificationsEnabled: boolean;
  toggleDark: () => void;
  setDark: (value: boolean) => void;
  toggleNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDark: false,
  notificationsEnabled: true,
  toggleDark: () =>
    set((s) => {
      const next = !s.isDark;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { isDark: next };
    }),
  setDark: (value) =>
    set(() => {
      if (value) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { isDark: value };
    }),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
}));
