import { create } from "zustand";

interface DeleteModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const deleteModalStore = create<DeleteModalState>()((set) => ({
  isOpen: false,
  open: () =>
    set((state) => ({
      isOpen: true,
    })),
  close: () =>
    set((state) => ({
      isOpen: false,
    })),
}));
