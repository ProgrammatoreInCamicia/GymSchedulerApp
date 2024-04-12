import { PayloadAction, ThunkAction, UnknownAction, createSlice } from "@reduxjs/toolkit";
import { TimerState } from "./store.models";
import { useAppDispatch } from "./hooks";
import { RootState } from "./store";

const initialState: TimerState = {
    totalValue: 0,
    currentValue: 0,
    isCountdown: false,
    isRunning: false,
    methodDispatch: null
};

let interval: NodeJS.Timeout;

export const startTimer = (): ThunkAction<void, RootState, unknown, UnknownAction> =>
    dispatch => {
        console.log('start timer');
        clearInterval(interval);
        dispatch(
            startTimerInternal()
        )
        interval = setInterval(() => {
            console.log(new Date());
            dispatch(tick());
        }, 1000)

    }

export const stopTimer = (): ThunkAction<void, RootState, unknown, UnknownAction> =>
    dispatch => {
        clearInterval(interval);
        dispatch(stopTimerInternal());
    }

const timerReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        startTimerInternal: state => {
            state.isRunning = true;
        },
        stopTimerInternal: state => {
            state.isRunning = false;
        },
        tick: state => {
            console.log('tick', state.isCountdown)
            if (!state.isCountdown) {
                state.currentValue += 1;
            } else if (state.currentValue > 0) {
                state.currentValue -= 1;
            }
            state.totalValue += 1;
        },
        // resetTimer: state => {
        //     state.currentValue = 0;
        //     state.isRunning = false;
        // },
        setTimerValue: (state, action: PayloadAction<{ value: number }>) => {
            console.log('setTimerValue', action.payload.value);
            state.currentValue = action.payload.value;
        },
        // setTimerInitialValue: (state, action: PayloadAction<{ value: number }>) => {
        //     console.log('set timer initial value: ', action.payload.value)
        //     state.initialValue = action.payload.value;
        // },
        setTimerAsCoundown: (state, action: PayloadAction<{ isCountdown: boolean, dispatchMethod?: boolean }>) => {
            state.isCountdown = action.payload.isCountdown;
            if (!action.payload.isCountdown) {
                state.currentValue = state.totalValue;
            }
            if (action.payload.dispatchMethod) {
                state.methodDispatch = new Date();
            }
        },
        resetTimer: (state) => {
            // console.log('reset timer')
            state.currentValue = initialState.currentValue;
            state.totalValue = initialState.totalValue;
            state.isCountdown = initialState.isCountdown;
            state.isRunning = initialState.isRunning;
            // console.log('coundown state is changed: ', initialState.isCountdown);
        }
    },
});

export const { tick, setTimerValue, startTimerInternal, stopTimerInternal, resetTimer, setTimerAsCoundown } = timerReducer.actions
export default timerReducer.reducer;