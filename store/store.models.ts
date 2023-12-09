export interface State {
    counter: number;
    other: any;
    exercises: Exercise[];
    schedules: Schedule[];
}

enum MUSCLES_CATETGORIES {
    'trapezius',
    'deltoid',
    'pectoralis_major',
    'triceps',
    'biceps',
    'abdominal',
    'serratus_anterior',
    'latissimus_dorsi',
    'external_oblique',
    'brachioradialis',
    'finger_extensors',
    'finger_flexors',
    'quadriceps',
    'hamstrings',
    'sartorius',
    'abductors',
    'gastrocnemius',
    'tibialis_anterior',
    'soleus',
    'gluteus_medius',
    'gluteus_maximus',
    'spine',
    'cardiovascular_system',
    'upper_back',
    'levator_scapulae',
    'adductors'
}


export interface Exercise {
    name: string,
    instructions: string,
    force: 'push' | 'pull' | 'both',
    type: 'compound' | 'isolation',
    workoutType: 'cardio' | 'olympic_lifitng' | 'plyometric' | 'powerlifting' | 'strength' | 'stretch' | 'strongman' | 'default',
    videoUri: string,
    difficulty: 'beginner' | 'intermediate' | 'expert' | 'default',
    images: string[],
    bodyPart: string,
    target: string,
    equipment: string,
    bodyWeight: string,
    primaryMuscles: MUSCLES_CATETGORIES,
    secondaryMuscles: MUSCLES_CATETGORIES,
}

export interface Schedule {
    id: number;
}