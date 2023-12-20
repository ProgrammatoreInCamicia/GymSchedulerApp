import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Schedule, ScheduleStore } from "./store.models";

const initialCurrentScheduleState: Schedule = {
    _id: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    title: '',
    routines: []
}

const initialState: ScheduleStore = {
    currentSchedule: initialCurrentScheduleState,
    schedules: []
};

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

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
                scheduleToChange = state.currentSchedule;
            } else {
                state.currentSchedule._id = guidGenerator();
                state.schedules.push(state.currentSchedule);
            }
        },
        resetCurrentSchedule: (state) => {
            state.currentSchedule = initialCurrentScheduleState
        },
        addRoutineToSchedule: (state, action: PayloadAction<{ scheduleId: string, routineName: string }>) => {
            let scheduleToChange = state.schedules.find(s => s._id == action.payload.scheduleId);
            scheduleToChange.routines.push({ name: action.payload.routineName });
            state.currentSchedule = scheduleToChange;
        }
    },
});

export const {
    setCurrentSchedule,
    setCurrentScheduleEndDate,
    setCurrentScheduleStartDate,
    setCurrentScheduleTitle,
    updateSchedulesBasedOnCurrent,
    resetCurrentSchedule,
    addRoutineToSchedule
} = schedulesReducer.actions
export default schedulesReducer.reducer;