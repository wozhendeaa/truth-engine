import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./ReduxStore";

const displayPage = ["FEED", "NOTIFICATION", "SINGLE_PAGE"] as const;

interface HomeState {
  displayingComponent: (typeof displayPage)[number];
}

const initialState: HomeState = {
  displayingComponent: "FEED",
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setDisplayingComponent(state, action) {
      state.displayingComponent = action.payload;
    },
  },
});

export const { setDisplayingComponent } = homePageSlice.actions;
export const selectHomePageState = (state: RootState) =>
  state.home.displayingComponent;
export default homePageSlice.reducer;
