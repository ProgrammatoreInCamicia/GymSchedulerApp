import { createSlice } from "@reduxjs/toolkit";
import { Schedule } from "./store.models";

const initialState: Schedule[] = [];

const schedulesReducer = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        init: (state, action) => state
    },
});

export const { } = schedulesReducer.actions
export default schedulesReducer.reducer;