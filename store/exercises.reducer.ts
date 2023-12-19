import { PayloadAction, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Exercise, ExerciseStore } from "./store.models";
import expressService from "../app/api/expressService";

// type InitialState = {
//     exercises: Exercise[],
//     loading: boolean,
// }

const initialState: ExerciseStore = {
    exercises: [],
    loading: false,
    error: '',
    filter: {
        searchTerm: ''
    }
}

export const fetchExercises = createAsyncThunk('exercises/fetchExercises', async () => {
    const response = await expressService.get('/exercises');
    console.log('fetch execises!');
    return response.data.response;
});

export const searchExercises = createAsyncThunk('exercises/searchExercises', async (term: string) => {
    let params = `name=${term}`;
    const response = await expressService.get(`/exercises?${params}`);
    console.log('search execises response: ', response.data.response[0]);
    return response.data.response;
});


const exercisesReducer = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        init: (state, action) => state,
        searchTermChange: (state, action: PayloadAction<string>) => {
            state.filter.searchTerm = action.payload
        },
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

// export const {
//     selectAll: selectExercises,
//     selectById: selectExerciseById,
// } = exercisesAdapter.getSelectors((state) => state)



export const { init, searchTermChange } = exercisesReducer.actions
export default exercisesReducer.reducer;