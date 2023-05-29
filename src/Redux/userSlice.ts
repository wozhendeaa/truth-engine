import { User } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./ReduxStore";

interface UserState {
    user: User | null;
  }
  

const initialState : UserState = {
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    }
})

export const {setUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;