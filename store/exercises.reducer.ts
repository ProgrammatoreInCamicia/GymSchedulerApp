import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Exercise, ExerciseStore } from "./store.models";
import expressService from "../app/api/expressService";

const initialState: ExerciseStore = {
    exercises: [],
    loading: false,
    error: '',
    filter: {
        searchTerm: ''
    },
    exerciseDetail: {
        _id: null,
        name: '',
        images: [],
        primaryMuscles: [],
        secondaryMuscles: []
    },
}

export const fetchExercises = createAsyncThunk('exercises/fetchExercises', async () => {
    const response = await expressService.get('/exercises');
    return response.data.response;
});

export const searchExercises = createAsyncThunk('exercises/searchExercises', async (term: string) => {
    let params = `name=${term}`;
    const response = await expressService.get(`/exercises?${params}`);
    let exercises: Exercise[] = response.data.response;

    return exercises;
});

export const getExercise = createAsyncThunk('exercises/getExercise', async (id: string) => {
    // let params = `id=${id}`;
    const response = await expressService.get(`/${id}`);
    let exercise: Exercise = response.data.response;
    console.log('get exercise: ', exercise);
    return exercise;
});


const exercisesReducer = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        init: (state, action) => state,
        searchTermChange: (state, action: PayloadAction<string>) => {
            state.filter.searchTerm = action.payload
        },
        deleteCurrentExercise: (state) => {
            state.exerciseDetail = {
                _id: null,
                name: '',
                images: [],
                primaryMuscles: [],
                secondaryMuscles: []
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchExercises.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
                state.exercises = action.payload
                state.loading = false
            })
            .addCase(fetchExercises.rejected, (state, action) => {
                state.exercises = []
                state.loading = false,
                    state.error = action.error.message || 'Something went wrong'
            })
            .addCase(getExercise.pending, (state) => {
                state.loading = true
            })
            .addCase(getExercise.fulfilled, (state, action: PayloadAction<Exercise>) => {
                state.exerciseDetail = action.payload
                state.loading = false
            })
            .addCase(getExercise.rejected, (state, action) => {
                state.exercises = []
                state.loading = false,
                    state.error = action.error.message || 'Something went wrong'
            })
            .addCase(searchExercises.pending, (state) => {
                state.loading = true
            })
            .addCase(searchExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
                state.exercises = action.payload
                state.loading = false
            })
            .addCase(searchExercises.rejected, (state, action) => {
                state.exercises = []
                state.loading = false,
                    state.error = action.error.message || 'Something went wrong'
            })

    }
});

export const { init, searchTermChange, deleteCurrentExercise } = exercisesReducer.actions
export default exercisesReducer.reducer;