import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.reducer";
import otherReducer from "./other.reducer";

export interface State {
    counter: number;
    other: any;
}
const initialState: State = {
    counter: 0,
    other: {
        piece1: 0,
        piece2: {
            a: 0,
            b: [],
        },
    }
}

const store = configureStore({
    reducer: {
        counter: counterReducer,
        other: otherReducer,
    },
    preloadedState: initialState
});

export default store;