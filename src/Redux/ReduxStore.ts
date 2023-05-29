import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import userReducer from "./userSlice";
import truthEditorReducer from "./truthEditorSlice";
import homePageSlice from "./homePageSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    user: userReducer,
    truthEditor: truthEditorReducer,
    home: homePageSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
