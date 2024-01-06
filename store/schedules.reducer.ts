import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Routine, RoutineExercise, Schedule, ScheduleStore } from "./store.models";

const initialCurrentScheduleState: Schedule = {
    _id: null,
    guid: null,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    title: '',
    routines: [],
    statistics: []
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
            if (state.currentSchedule.guid) {
                let scheduleToChange = state.schedules.find(s => s.guid == state.currentSchedule.guid);
                scheduleToChange = state.currentSchedule;
            } else {
                state.currentSchedule.guid = guidGenerator();
                state.schedules.push(state.currentSchedule);
            }
        },
        resetCurrentSchedule: (state) => {
            state.currentSchedule = initialCurrentScheduleState
        },
        addRoutineToSchedule: (state, action: PayloadAction<{ scheduleId: string, routineName: string }>) => {
            let scheduleToChange = state.schedules.find(s => s.guid == action.payload.scheduleId);
            scheduleToChange.routines.push({
                name: action.payload.routineName,
                _id: null,
                scheduleId: scheduleToChange.guid,
                guid: guidGenerator(),
                exercises: []
            });
            state.currentSchedule = scheduleToChange;
        },
        saveExerciseInRoutine: (state, action: PayloadAction<{ routineExercise: RoutineExercise, routine: Routine }>) => {
            let scheduleToChangeIndex = state.schedules
                .findIndex(s => s.guid == action.payload.routine.scheduleId)
            let routineToChangeIndex = state.schedules[scheduleToChangeIndex]
                .routines.findIndex(r => r.guid == action.payload.routine.guid);
            if (action.payload.routineExercise.guid != "") {
                console.log('inside modify exercise');
                let exerciseIndex = state.schedules[scheduleToChangeIndex]
                    .routines[routineToChangeIndex].exercises.findIndex(e => e.guid === action.payload.routineExercise.guid);
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].exercise = action.payload.routineExercise.exercise;
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].reps = action.payload.routineExercise.reps;
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].rest = action.payload.routineExercise.rest;
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].sets = action.payload.routineExercise.sets;
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].weight = action.payload.routineExercise.weight;
                // console.log('inside modify exercise', exercise);
                // exercise = { ...action.payload.routineExercise };
                // console.log('inside modify exercise', exercise);
            } else {
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises.push({
                    ...action.payload.routineExercise,
                    guid: guidGenerator()
                });

            }

            // console.log('schedule to change: ', scheduleToChange.routines[0].exercises[0].rest);
            // console.log('inside store schedule to change: ', state.schedules.find(s => s.guid == action.payload.routine.scheduleId).routines[0].exercises[0].rest);

            state.currentSchedule = state.schedules[scheduleToChangeIndex];
        },
        addWorkoutStatistics: (state, action: PayloadAction<{ routine: Routine, totalTime: number }>) => {
            let scheduleToChange = state.schedules.find(s => s.guid === action.payload.routine.scheduleId);
            if (!scheduleToChange.statistics) {
                scheduleToChange.statistics = [];
            }
            scheduleToChange.statistics.push({
                date: new Date(),
                routine: action.payload.routine,
                totalTime: action.payload.totalTime
            });

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
    addRoutineToSchedule,
    saveExerciseInRoutine,
    addWorkoutStatistics,
} = schedulesReducer.actions
export default schedulesReducer.reducer;