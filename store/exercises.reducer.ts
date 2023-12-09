import { createSlice } from "@reduxjs/toolkit";
import { Exercise } from "./store.models";

const initialState: Exercise[] = [];

const exercisesReducer = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        init: (state, action) => state
    },
});

export const { } = exercisesReducer.actions
export default exercisesReducer.reducer;