import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./ReduxStore";


interface EditorState {
    errors:string
  }
  

const initialState : EditorState = {
    errors: "",
} 

const truthEditorSlice = createSlice({
    name: 'truthEditor',
    initialState,
    reducers: {
        setErrors(state, action) {
            state.errors = action.payload;
        },
    }
})


export const {setErrors} = truthEditorSlice.actions;
export const selectTruthEditor = (state: RootState) => state.truthEditor.errors;
export default truthEditorSlice.reducer;