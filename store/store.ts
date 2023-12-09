import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.reducer";
import otherReducer from "./other.reducer";
import { State } from "./store.models";
import exercisesReducer from "./exercises.reducer";
import schedulesReducer from "./schedules.reducer";

const initialState: State = {
    counter: 0,
    other: {
        piece1: 0,
        piece2: {
            a: 0,
            b: [],
        },
    },
    exercises: [],
    schedules: [],
}

const store = configureStore({
    reducer: {
        counter: counterReducer,
        other: otherReducer,
        exercises: exercisesReducer,
        schedules: schedulesReducer
    },
    preloadedState: initialState
});

export default store;