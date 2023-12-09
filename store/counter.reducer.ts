import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const counterReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            return state + 1
        },
        decrement: (state) => {
            return state - 1
        },
    },
});

export const { decrement, increment } = counterReducer.actions
export default counterReducer.reducer;