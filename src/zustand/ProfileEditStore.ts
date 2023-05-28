import { User } from "@prisma/client";
import { create } from "zustand";

interface ProfileUserState {
  user: User;
  setUser: (user: User) => void;
}

export const useProfileStore = create<ProfileUserState>()((set) => ({
  user: {} as User,
  setUser: (u: User) =>
    set((state) => ({
      user: u,
    })),
}));
