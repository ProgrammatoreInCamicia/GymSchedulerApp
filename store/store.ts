import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.reducer";
import schedulesReducer from "./schedules.reducer";
import exercisesReducer from "./exercises.reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer, persistStore } from 'redux-persist';
import hardSet from "redux-persist/lib/stateReconciler/hardSet";
import timerReducer from "./timer.reducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // stateReconciler: hardSet,
}

const reducers = combineReducers({
    counter: counterReducer,
    other: null,
    exercises: exercisesReducer,
    schedules: schedulesReducer,
    timer: timerReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    })
});

// export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;