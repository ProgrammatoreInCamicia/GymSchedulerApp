import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.reducer";
import otherReducer from "./other.reducer";
import schedulesReducer from "./schedules.reducer";
import exercisesReducer from "./exercises.reducer";


const store = configureStore({
    reducer: {
        counter: counterReducer,
        other: otherReducer,
        exercises: exercisesReducer,
        schedules: schedulesReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;