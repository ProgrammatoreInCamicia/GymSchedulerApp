import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Routine, RoutineExercise, Schedule, ScheduleStore } from "./store.models";

const initialCurrentScheduleState: Schedule = {
    _id: null,
    guid: guidGenerator(),
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    title: 'First Schedule',
    routines: [],
    statistics: []
}

const initialState: ScheduleStore = {
    currentSchedule: { ...initialCurrentScheduleState },
    schedules: [{ ...initialCurrentScheduleState }]
};

export function guidGenerator() {
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
        deleteCurrentSchedule: (state) => {
            let scheduleIndexToDelete = state.schedules.findIndex(s => s.guid === state.currentSchedule.guid);
            state.schedules.splice(scheduleIndexToDelete, 1);
            state.currentSchedule = state.schedules[state.schedules.length - 1];
        },
        updateSchedulesBasedOnCurrent: (state) => {
            let scheduleToChangeIndex = state.schedules.findIndex(s => s.guid == state.currentSchedule.guid);
            if (scheduleToChangeIndex >= 0) {
                state.schedules[scheduleToChangeIndex] = state.currentSchedule;
            } else {
                state.schedules.push(state.currentSchedule);
            }
        },
        resetCurrentSchedule: (state) => {
            state.currentSchedule = {
                _id: null,
                guid: guidGenerator(),
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                title: '',
                routines: [],
                statistics: [],
            }
        },
        addRoutineToSchedule: (state, action: PayloadAction<{ scheduleId: string, routineName: string }>) => {
            let scheduleToChangeIndex = state.schedules.findIndex(s => s.guid == action.payload.scheduleId);
            state.schedules[scheduleToChangeIndex].routines.push({
                name: action.payload.routineName,
                _id: null,
                scheduleId: state.schedules[scheduleToChangeIndex].guid,
                guid: guidGenerator(),
                exercises: []
            });
            state.currentSchedule = state.schedules[scheduleToChangeIndex];
        },
        setExercisesInRoutine: (state, action: PayloadAction<{ routineExercises: RoutineExercise[], routine: Routine }>) => {
            let scheduleToChangeIndex = state.schedules
                .findIndex(s => s.guid == action.payload.routine.scheduleId)
            let routineToChangeIndex = state.schedules[scheduleToChangeIndex]
                .routines.findIndex(r => r.guid == action.payload.routine.guid);
            state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises = action.payload.routineExercises;
            console.log('setExercisesInRoutine');
            state.currentSchedule = state.schedules[scheduleToChangeIndex];
        },
        saveExerciseInRoutine: (state, action: PayloadAction<{ routineExercise: RoutineExercise, routine: Routine }>) => {
            let scheduleToChangeIndex = state.schedules
                .findIndex(s => s.guid == action.payload.routine.scheduleId)
            let routineToChangeIndex = state.schedules[scheduleToChangeIndex]
                .routines.findIndex(r => r.guid == action.payload.routine.guid);
            console.log(action.payload.routineExercise.guid)
            if (action.payload.routineExercise.guid && action.payload.routineExercise.guid != "") {
                let exerciseIndex = state.schedules[scheduleToChangeIndex]
                    .routines[routineToChangeIndex].exercises.findIndex(e => e.guid === action.payload.routineExercise.guid);
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].exercise = action.payload.routineExercise.exercise;
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].setsConfig = action.payload.routineExercise.setsConfig;
                // state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].reps = action.payload.routineExercise.reps;
                // state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].rest = action.payload.routineExercise.rest;
                // state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].sets = action.payload.routineExercise.sets;
                // state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises[exerciseIndex].weight = action.payload.routineExercise.weight;

            } else {
                state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises.push({
                    ...action.payload.routineExercise,
                    guid: guidGenerator()
                });

            }

            state.currentSchedule = state.schedules[scheduleToChangeIndex];
        },
        deleteExerciseInRoutine: (state, action: PayloadAction<{ routineExerciseGuid: string, routine: Routine }>) => {
            let scheduleToChangeIndex = state.schedules
                .findIndex(s => s.guid == action.payload.routine.scheduleId)
            let routineToChangeIndex = state.schedules[scheduleToChangeIndex]
                .routines.findIndex(r => r.guid == action.payload.routine.guid);
            let exerciseIndex = state.schedules[scheduleToChangeIndex]
                .routines[routineToChangeIndex].exercises.findIndex(e => e.guid === action.payload.routineExerciseGuid);
            state.schedules[scheduleToChangeIndex].routines[routineToChangeIndex].exercises.splice(exerciseIndex, 1);
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
        },
        deleteSchedule: (state) => {
            state.schedules = initialState.schedules;
            state.currentSchedule = initialState.currentSchedule;
            // state.schedules.splice(0, 1);
            // state.currentSchedule = state.schedules[0];
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
    deleteCurrentSchedule,
    deleteExerciseInRoutine,
    deleteSchedule,
    setExercisesInRoutine,
} = schedulesReducer.actions
export default schedulesReducer.reducer;