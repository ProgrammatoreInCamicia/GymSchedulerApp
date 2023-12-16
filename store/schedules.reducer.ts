import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Schedule, ScheduleStore } from "./store.models";

const initialCurrentScheduleState: Schedule = {
    _id: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    title: ''
}

const initialState: ScheduleStore = {
    currentSchedule: initialCurrentScheduleState,
    schedules: []
};

const schedulesReducer = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        init: (state, action) => state,
        setCurrentSchedule: (state, action: PayloadAction<Schedule>) => {
            state.currentSchedule = action.payload
        },
        setCurrentScheduleTitle: (state, action: PayloadAction<string>) => {
            state.currentSchedule.title = action.payload
        },
        setCurrentScheduleStartDate: (state, action: PayloadAction<Date>) => {
            state.currentSchedule.startDate = action.payload
        },
        setCurrentScheduleEndDate: (state, action: PayloadAction<Date>) => {
            state.currentSchedule.endDate = action.payload
        },
        updateSchedulesBasedOnCurrent: (state) => {
            if (state.currentSchedule._id) {
                let scheduleToChange = state.schedules.find(s => s._id == state.currentSchedule._id);
                scheduleToChange.title = state.currentSchedule.title;
                scheduleToChange.startDate = state.currentSchedule.startDate;
                scheduleToChange.endDate = state.currentSchedule.endDate;
            } else {
                state.schedules.push(state.currentSchedule);
            }
        },
        resetCurrentSchedule: (state) => {
            state.currentSchedule = initialCurrentScheduleState
        }
    },
});

export const {
    setCurrentSchedule,
    setCurrentScheduleEndDate,
    setCurrentScheduleStartDate,
    setCurrentScheduleTitle,
    updateSchedulesBasedOnCurrent,
    resetCurrentSchedule
} = schedulesReducer.actions
export default schedulesReducer.reducer;