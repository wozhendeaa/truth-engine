import { create } from "zustand";

const faqTabs = ["平台相关", "大觉醒", "自然疗法"] as const;
export type Tab = (typeof faqTabs)[number];
export interface SelectedCategoryState {
  currentlySelected: Tab;
  tabs: typeof faqTabs;
  changeTab: (tab: Tab) => void;
}

export const useFaqStore = create<SelectedCategoryState>()((set) => ({
  currentlySelected: "平台相关",
  tabs: faqTabs,
  changeTab: (tab: Tab) =>
    set((state) => ({
      currentlySelected: tab,
    })),
}));
