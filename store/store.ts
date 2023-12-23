import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter.reducer";
import otherReducer from "./other.reducer";
import schedulesReducer from "./schedules.reducer";
import exercisesReducer from "./exercises.reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer, persistStore } from 'redux-persist';
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // stateReconciler: hardSet,
}

const reducers = combineReducers({
    counter: counterReducer,
    other: otherReducer,
    exercises: exercisesReducer,
    schedules: schedulesReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

// const store = configureStore({
//     reducer: {
//         counter: counterReducer,
//         other: otherReducer,
//         exercises: exercisesReducer,
//         schedules: schedulesReducer
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//         serializableCheck: false
//     })
// });
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

// export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;