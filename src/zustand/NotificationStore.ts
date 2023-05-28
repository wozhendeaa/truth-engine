import { create } from "zustand";

export interface NotifState {
  unread: number;
  setUnread: (unreadNumber: number) => void;
}
export const useNotifStore = create<NotifState>()((set) => ({
  unread: 0,
  setUnread: (unreadNumber: number) =>
    set((state) => ({
      unread: unreadNumber,
    })),
}));
