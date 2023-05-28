import { create } from "zustand";

const tabs = ["COMMENTS_LIKES", "ENGINE_UPDATES"] as const;
export type Tab = (typeof tabs)[number];
export interface TabState {
  currentlySelected: Tab;
  tabs: typeof tabs;
  changeTab: (tab: Tab) => void;
}

export const useNotifTabsStore = create<TabState>()((set) => ({
  currentlySelected: "COMMENTS_LIKES",
  tabs: tabs,
  changeTab: (tab: Tab) =>
    set((state) => ({
      currentlySelected: tab,
    })),
}));
