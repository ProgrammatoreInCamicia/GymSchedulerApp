export interface ExerciseFilter {
    searchTerm: string;
}

export interface ExerciseStore {
    loading: boolean;
    exercises: Exercise[];
    exerciseDetail: Exercise;
    error: string;
    filter: ExerciseFilter
}

export enum MUSCLES_CATEGORIES {
    'traps' = 'traps',
    'triceps' = 'triceps',
    'biceps' = 'biceps',
    'abdominals' = 'abdominals',
    'hamstrings' = 'hamstrings',
    'calves' = 'calves',
    'shoulders' = 'shoulders',
    'adductors' = 'adductors',
    'glutes' = 'glutes',
    'quadriceps' = 'quadriceps',
    'forearms' = 'forearms',
    'abductors' = 'abductors',
    'chest' = 'chest',
    'lower back' = 'lower back',
    'middle back' = 'middle back',
    'lats' = 'lats',
    'neck' = 'neck',
}


export interface Exercise {
    _id: string,
    name: string,
    instructions?: string[],
    force?: 'push' | 'pull' | 'both',
    type?: 'compound' | 'isolation',
    workoutType?: 'cardio' | 'olympic_lifitng' | 'plyometric' | 'powerlifting' | 'strength' | 'stretch' | 'strongman' | 'default',
    videoUri?: string,
    difficulty?: 'beginner' | 'intermediate' | 'expert' | 'default',
    images: string[],
    // images: Image[],
    bodyPart?: string,
    target?: string,
    equipment?: string,
    bodyWeight?: string,
    primaryMuscles: MUSCLES_CATEGORIES[],
    secondaryMuscles: MUSCLES_CATEGORIES[],
}

export interface Image {
    name: string,
    desc: string;
    img: {
        data: Buffer,
        contentType: string
    };
    imgBase64: any;
}

export interface ImageDataStream {
    data: any,
    type: any;
}

export interface ScheduleStore {
    schedules: Schedule[],
    currentSchedule: Schedule
}

export interface Schedule {
    _id: string; // managed by backend
    guid: string; // frontend purpose
    title: string;
    startDate: Date,
    endDate: Date,
    routines: Routine[],
    statistics: Statistic[],
}

export interface Routine {
    name: string,
    scheduleId: string,
    _id: string; // managed by backend
    guid: string; // frontend purpose
    exercises: RoutineExercise[];
}

export interface RoutineExercise {
    guid?: string;
    setsConfig: SetConfig[],
    exercise: Exercise;
    rest: number;
}

export interface SetConfig extends Set {
    guid: string;
    historicalData?: HistorycalData[];
}

export interface HistorycalData {
    data: Date,
    sets: Set;
}

export interface Set {
    reps: number;
    weight: number;
}

export interface Statistic {
    date: Date;
    totalTime: number;
    routine: Routine;
}

export interface TimerState {
    totalValue: number;
    currentValue: number;
    isCountdown: boolean;
    isRunning: boolean;
    methodDispatch: Date;
}