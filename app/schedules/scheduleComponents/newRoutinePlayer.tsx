import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";
import { router, useLocalSearchParams } from "expo-router";
import InternalButton from "../../../components/button";
import { useEffect, useRef, useState } from "react";
import Input from "../../../components/Input";
import { HistorycalData, RoutineExercise } from "../../../store/store.models";
// import Timer from "../../../components/timer";
import { addHistoricalData, addWorkoutStatistics } from "../../../store/schedules.reducer";
import { AlarmComponent } from "../../../components/alarmComponent";
import { ExerciseImages, ExerciseInstructions } from "../../exercise";
import { useKeepAwake } from 'expo-keep-awake';
import { Ionicons } from '@expo/vector-icons';
import { resetTimer, setTimerAsCoundown, setTimerValue, startTimer, stopTimer, tick } from "../../../store/timer.reducer";
import Timer2 from "../../../components/timer2";
// import Timer2 from "../../../components/timer2";
// import { resetTimer, setTimerAsCoundown, setTimerValue, startTimer } from "../../../store/timer.reducer";

const RoutinePlayer = () => {
    useKeepAwake();

    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();

    // Routine definition
    const { routineId } = useLocalSearchParams();
    const routine = useAppSelector((state) => state.schedules.currentSchedule.routines.find(r => r.guid == routineId));

    const intervalRef = useRef(null);
    // Start Historical data definition
    useEffect(() => {
        clearInterval(intervalRef.current);
        dispatch(resetTimer());
        setCurrentExercise(0);
        dispatch(startTimer());
        // intervalRef.current = setInterval(() => {
        //     dispatch(tick());
        // }, 1000)
    }, [routine]);

    const setCurrentExercise = (index: number) => {
        if (index > routine.exercises.length - 1) {
            // dispatch(addWorkoutStatistics({
            //     routine: routine,
            //     totalTime: timerInitialValue
            // }));

            dispatch(stopTimer());

            localHistoricalData.forEach((historicalData, exerciseIndex) => {
                historicalData.forEach((historycalData, setIndex) => {
                    dispatch(addHistoricalData({
                        exerciseIndex,
                        setIndex,
                        historycalData,
                        routine
                    }));
                })
            });

            historicalData.forEach((hd, setIndex) => {
                dispatch(addHistoricalData({
                    exerciseIndex: routine.exercises.length - 1,
                    setIndex,
                    historycalData: hd,
                    routine
                }));
            });

            router.push('schedules');
        } else {
            // historicalData changes to local historical data
            if (historicalData.length) {
                setLocalHistoricalData(archivedHistoricalData => {
                    const changed = [...archivedHistoricalData]
                    if (changed[currentExerciseIndex]) {
                        // change historical data
                        changed[currentExerciseIndex] = historicalData;
                    } else {
                        // add historical data to archive
                        changed.push(historicalData);
                    }
                    return [...changed];
                });
            }

            setCurrentExerciseIndex(index);
            setCurrentSetIndex(0);
            setHistoricalDataOfCurrentRoutineExercise(index);
            // resetTimer();

        }
    }

    const setHistoricalDataOfCurrentRoutineExercise = (index: number) => {
        let historicalData: HistorycalData[];

        if (localHistoricalData[index]) {
            historicalData = localHistoricalData[index];
        } else {
            const routineExercise: RoutineExercise = routine.exercises[index];

            historicalData = routineExercise.setsConfig.map(sc => {
                let historyData: HistorycalData;
                if (sc.historicalData.length > 0) {
                    historyData = sc.historicalData.reduce((a, b) => {
                        return new Date(a.data) > new Date(b.data) ? a : b
                    });
                } else {
                    historyData = {
                        data: new Date(),
                        sets: {
                            reps: sc.reps,
                            weight: sc.weight
                        }
                    }
                }

                return historyData;
            });
        }

        setHistoricalData(historicalData);
    }

    const setHistoricalDataWeight = (value: string, setIndex: number) => {
        setHistoricalData(historicalData => {
            const updatedArray = [...historicalData];
            updatedArray[setIndex].sets.weight = +value;

            return [...updatedArray];
        })
    }

    const setHistoricalDataReps = (value: string, setIndex: number) => {
        setHistoricalData(historicalData => {
            const updatedArray = [...historicalData];
            updatedArray[setIndex].sets.reps = +value;

            return [...updatedArray];
        })
    }

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [historicalData, setHistoricalData] = useState<HistorycalData[]>([]);
    const [localHistoricalData, setLocalHistoricalData] = useState<HistorycalData[][]>([]);

    // const goNext2 = () => {
    //     // const isCountDownInternal = useAppSelector(state => state.timer.isCountdown);
    //     console.log('go next', timerIsCountdown);
    //     let currentExerciseSetCount = historicalData.length;
    //     let exerciseRest = routine.exercises[currentExerciseIndex].rest;
    //     // skip coutdown
    //     if (timerIsCountdown) {
    //         const newTotal = timerInitialValue + (exerciseRest - timerCurrentValue);
    //         // dispatch(setTimerInitialValue({ value: newTotal }));
    //         console.log('setTotalRoutineTime : timerIsCountdown', newTotal);
    //         // setTotalRoutineTime(newTotal);
    //         // setTotalRoutineTime(total => total + (exerciseRest - getTimerChildState()));
    //         // console.log('totalRoutineTime', totalRoutineTime);
    //         // setTimeout(() => {
    //         //     console.log('totalRoutineTime', totalRoutineTime);

    //         // }, 0);
    //         // setTimeout(() => {
    //         if (currentSetIndex < currentExerciseSetCount - 1) {
    //             goToNextSet();
    //         } else {
    //             // go to next exercise
    //             setCurrentExercise(currentExerciseIndex + 1);
    //             goToNextSet()
    //         }

    //         // }, 1);

    //         return;
    //     }
    //     // setTotalRoutineTime(total => total + getTimerChildState());
    //     console.log('setTotalRoutineTime go next', timerCurrentValue);
    //     // dispatch(setTimerInitialValue({ value: timerCurrentValue }));
    //     // setTotalRoutineTime(timerCurrentValue);
    //     // setStopTimer(stopTimer => !stopTimer);

    //     // Check if current set is not the last inside current exercise
    //     console.log('go next', exerciseRest, currentExerciseSetCount, currentSetIndex);
    //     if (currentSetIndex < currentExerciseSetCount - 1) {
    //         if (exerciseRest > 0) {
    //             // start rest timer
    //             setTotalRoutineTime(timerCurrentValue);
    //             dispatch(setTimerAsCoundown({ isCountdown: true }));
    //             dispatch(setTimerValue({ value: exerciseRest }));
    //         } else {
    //             // go to next set
    //             goToNextSet();
    //         }
    //     } else {
    //         // go to next exercise
    //         setCurrentExercise(currentExerciseIndex + 1);
    //     }

    // }

    function goNext(coundownFinished: boolean) {
        // console.log('function go next', timerIsCountdown);

        let currentExerciseSetCount = historicalData.length;
        let exerciseRest = routine.exercises[currentExerciseIndex].rest;

        // countdown finished
        if (coundownFinished) {
            // const newTotal = timerInitialValue + (exerciseRest - timerCurrentValue);
            // dispatch(setTimerInitialValue({ value: newTotal }));
            // dispatch(setTimerValue({ value: newTotal }));
            // console.log('setTotalRoutineTime : timerIsCountdown', newTotal);
            // setTotalRoutineTime(newTotal);
            // setTotalRoutineTime(total => total + (exerciseRest - getTimerChildState()));
            // console.log('totalRoutineTime', totalRoutineTime);
            // setTimeout(() => {
            //     console.log('totalRoutineTime', totalRoutineTime);

            // }, 0);
            // setTimeout(() => {
            if (currentSetIndex < currentExerciseSetCount - 1) {
                goToNextSet();
            } else {
                // go to next exercise
                setCurrentExercise(currentExerciseIndex + 1);
                goToNextSet()
            }

            // }, 1);

            return;
        }

        if (currentSetIndex < currentExerciseSetCount - 1) {
            if (exerciseRest > 0) {
                // start rest timer
                dispatch(setTimerAsCoundown({ isCountdown: true }));
                dispatch(setTimerValue({ value: exerciseRest }));
            } else {
                // go to next set
                goToNextSet();
            }
        } else {
            // go to next exercise
            setCurrentExercise(currentExerciseIndex + 1);
        }
    }

    const goToNextSet = () => {
        setCurrentSetIndex(currentSet => currentSet + 1);
    }

    const stopSoundAndGoNext = () => {
        stopSound();
        removeCountdown();
    }

    const removeCountdown = () => {
        dispatch(setTimerAsCoundown({ isCountdown: false, dispatchMethod: true }));
    }

    // Start timer
    const timerCurrentValue = useAppSelector(state => state.timer.currentValue);
    // const timerInitialValue = useAppSelector(state => state.timer.totalValue);
    const timerIsCountdown = useAppSelector(state => state.timer.isCountdown);
    const dispatchMethod = useAppSelector(state => state.timer.methodDispatch);

    const [dispatchMethodCounter, setDispatchMethodCounter] = useState(0);

    useEffect(() => {
        if (dispatchMethodCounter > 0) {
            goNext(true)
        }

        setDispatchMethodCounter(counter => counter + 1);
    }, [dispatchMethod]);

    // useEffect(() => {
    //     if (timerCurrentValue == 0 && timerIsCountdown) {
    //         playSound();
    //     }
    // }, [timerIsCountdown, timerCurrentValue])
    // End timer

    // Start Usabilities
    const [detailOpened, setDetailOpened] = useState<boolean>(false);
    // End Usabilities

    // Start alarm
    const { playSound, stopSound } = AlarmComponent();
    // End alarm

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: themeColor.background }]}>
            <View style={{ alignItems: 'center' }}>
                {/* <Text>{timerCurrentValue}</Text> */}
                <Timer2></Timer2>
                {/* <Timer
                    ref={timerChildRef}
                    start={startTimer}
                    stop={stopTimer}
                    startFrom={startTimerFrom}
                    isCountdown={isCountdown}
                    countdownIsFinished={countdownIsFinished}
                /> */}
            </View>
            {/* <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>{routine.name}</Text> */}

            {/* Start Exercises navigator */}
            <FlatList
                data={routine.exercises}
                keyExtractor={(exercise) => exercise.guid}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                numColumns={routine.exercises.length}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{
                            flex: index == 0 ? 0 : 1,
                            alignItems: routine.exercises.length == 1 ? 'center' : 'flex-end'
                        }}>
                            <TouchableWithoutFeedback onPress={() => setCurrentExercise(index)}>
                                <View style={[styles.pageContainer, {
                                    backgroundColor: currentExerciseIndex > index ? themeColor.success : themeColor.black,
                                    borderColor: currentExerciseIndex >= index ? themeColor.success : themeColor.black
                                }]}>
                                    <Text style={{ color: themeColor.text }}>{index + 1}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            {index > 0 && (
                                <View style={[styles.paginatorConnector, {
                                    borderColor: currentExerciseIndex >= index ? themeColor.success : themeColor.black
                                }]}></View>
                            )}
                        </View>
                    )
                }} />
            {/* End Exercises navigator */}

            <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text, flex: 1 }]}>{routine.exercises[currentExerciseIndex].exercise.name}</Text>
                {!detailOpened && (
                    <TouchableOpacity onPress={() => setDetailOpened(true)}>
                        <Ionicons name="chevron-forward" size={24} color="white" />

                    </TouchableOpacity>
                )}
                {detailOpened && (
                    <TouchableOpacity onPress={() => setDetailOpened(false)}>
                        <Ionicons name="chevron-down-sharp" size={24} color="white" />

                    </TouchableOpacity>
                )}
            </View>
            <View style={{ paddingHorizontal: 15 }}>
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text, paddingTop: 0, fontSize: 14 }]}>{routine.exercises[currentExerciseIndex].notes}</Text>
            </View>
            {detailOpened && (
                <ScrollView style={{ paddingHorizontal: 15, flex: 1 }}>
                    <View style={{ height: 250 }}>
                        <ExerciseImages id={routine.exercises[currentExerciseIndex].exercise._id}>
                        </ExerciseImages>
                    </View>


                    <ExerciseInstructions id={routine.exercises[currentExerciseIndex].exercise._id}></ExerciseInstructions>

                </ScrollView>
            )}

            {/* Start Exercises sets executions */}
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <FlatList
                    data={historicalData}
                    keyExtractor={(singleHistoricalData, i) => i + ''}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index}>
                                <View style={[styles.setContainer, {
                                    backgroundColor: index === currentSetIndex
                                        ? themeColor.success
                                        : themeColor.black + 60
                                }]}>
                                    <View style={[styles.setCounter, { backgroundColor: themeColor.white }]}>
                                        <Text>{index + 1}</Text>
                                    </View>
                                    <View style={[styles.setValueContainer]}>
                                        <Input
                                            inputMode="decimal"
                                            value={historicalData[index]?.sets.reps + ''}
                                            onValueChange={(value) => setHistoricalDataReps(value, index)}
                                            backgroundColor={themeColor.background}
                                            inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }}
                                        />
                                        <Text style={{ color: themeColor.text }}>Reps</Text>
                                    </View>
                                    <View style={[styles.setValueContainer]}>
                                        <Input
                                            inputMode="decimal"
                                            value={historicalData[index].sets?.weight + ''}
                                            onValueChange={(value) => setHistoricalDataWeight(value, index)}
                                            backgroundColor={themeColor.background}
                                            inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }}
                                        />
                                        <Text style={{ color: themeColor.text }}>Kg</Text>
                                    </View>
                                </View>
                            </View>

                        )
                    }}
                />
            </View>
            {/* End Exercises sets executions */}

            <View style={[{ backgroundColor: themeColor.black + 40, paddingHorizontal: 20 }]}>
                <InternalButton
                    label={(timerIsCountdown && timerCurrentValue > 0) ? "Skip" : "Done"}
                    onPress={() => {
                        if (timerIsCountdown && timerCurrentValue > 0)
                            removeCountdown();
                        else if (!timerIsCountdown)
                            goNext(false);
                        else
                            stopSoundAndGoNext()
                    }}
                />
                {/* <InternalButton
                    label={"Done"}
                    onPress={() => {
                        goNext(false);
                    }}
                /> */}
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'solid'
    },
    paginatorConnector: {
        width: '100%',
        position: 'absolute',
        borderBottomWidth: 6,
        top: '45%',
        zIndex: -999,
    },
    setContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'
    },
    setCounter: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    setValueContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
})

export default RoutinePlayer;