import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    piece1: 0,
    piece2: {
        a: 0,
        b: [],
    },
};

const otherReducer = createSlice({
    name: 'other',
    initialState,
    reducers: {
        reset: (state) => {
            return {
                ...state,
                piece1: 10
            }
        }
    },
});

export const { reset } = otherReducer.actions;
export default otherReducer.reducer;