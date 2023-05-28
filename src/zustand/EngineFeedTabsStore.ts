import { create } from "zustand";

const tabs = ["VERIFIED_ENGINE", "COMMUNITY", "NEWS"] as const;
export type Tab = (typeof tabs)[number];
export interface SelectedCategoryState {
  currentlySelected: Tab;
  tabs: typeof tabs;
  changeTab: (tab: Tab) => void;
}

export const useEngineFeedTabsStore = create<SelectedCategoryState>()(
  (set) => ({
    currentlySelected: "VERIFIED_ENGINE",
    tabs: tabs,
    changeTab: (tab: Tab) =>
      set((state) => ({
        currentlySelected: tab,
      })),
  })
);
