import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";
import { router, useLocalSearchParams } from "expo-router";
import InternalButton from "../../../components/button";
import { useEffect, useRef, useState } from "react";
import Input from "../../../components/Input";
import { HistorycalData, RoutineExercise } from "../../../store/store.models";
import Timer from "../../../components/timer";
import { addHistoricalData, addWorkoutStatistics } from "../../../store/schedules.reducer";
import { AlarmComponent } from "../../../components/alarmComponent";

const RoutinePlayer = () => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();

    // Routine definition
    const { routineId } = useLocalSearchParams();
    const routine = useAppSelector((state) => state.schedules.currentSchedule.routines.find(r => r.guid == routineId));

    // Start Historical data definition
    useEffect(() => {
        setCurrentExercise(0);
    }, [routine]);

    const setCurrentExercise = (index: number) => {
        if (index > routine.exercises.length - 1) {
            dispatch(addWorkoutStatistics({
                routine: routine,
                totalTime: totalRoutineTime
            }));

            // Save history data
            // routine.exercises.forEach((exercise, exerciseIndex) => {
            //     let changedExercise = { ...exercise };
            //     if (exerciseIndex < routine.exercises.length - 1) {
            //         changedExercise.setsConfig.forEach((setConfig, setConfigIndex) => {
            //             setConfig.historicalData.push(localHistoricalData[exerciseIndex][setConfigIndex]);
            //         });
            //     } else {
            //         changedExercise.setsConfig.forEach((setConfig, setConfigIndex) => {
            //             setConfig.historicalData.push(historicalData[setConfigIndex]);
            //         });
            //     }
            // });
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
            resetTimer();

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

    const goNext = () => {
        let currentExerciseSetCount = historicalData.length;
        let exerciseRest = routine.exercises[currentExerciseIndex].rest;
        // skip coutdown
        if (isCountdown) {
            setTotalRoutineTime(total => total + (exerciseRest - getTimerChildState()));

            if (currentSetIndex < currentExerciseSetCount - 1) {
                goToNextSet();
            } else {
                // go to next exercise
                setCurrentExercise(currentExerciseIndex + 1);
                goToNextSet()
            }

            return;
        }
        setTotalRoutineTime(total => total + getTimerChildState());
        setStopTimer(stopTimer => !stopTimer);

        // Check if current set is not the last inside current exercise
        if (currentSetIndex < currentExerciseSetCount - 1) {
            if (exerciseRest > 0) {
                // start rest timer
                setIsCountdown(true);
                setStartTimerFrom(exerciseRest);
                setTimeout(() => {
                    setStartTimer(startTimer => !startTimer);
                }, 0);
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
        resetTimer();
        setCurrentSetIndex(currentSet => currentSet + 1);
    }

    const stopSoundAndGoNext = () => {
        stopSound();
        setCoutdownFinished(false);

        goNext();
    }

    // Start timer
    const timerChildRef = useRef<any>();
    const [startTimer, setStartTimer] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [isCountdown, setIsCountdown] = useState(false);
    const [startTimerFrom, setStartTimerFrom] = useState(0);
    const [coutdownFinished, setCoutdownFinished] = useState(false);
    const [totalRoutineTime, setTotalRoutineTime] = useState(0);

    const getTimerChildState = () => {
        const timer = timerChildRef.current.getChildTimer();
        return timer;
    }

    const countdownIsFinished = () => {
        let exerciseRest = routine.exercises[currentExerciseIndex].rest;
        setTotalRoutineTime(total => total + exerciseRest);
        setCoutdownFinished(true);
        playSound();
    }

    const resetTimer = () => {
        setStartTimerFrom(0);
        setStopTimer(stopTimer => !stopTimer);
        setIsCountdown(false);
        setTimeout(() => {
            setStartTimer(startTimer => !startTimer);
        }, 0);
    }
    // End timer

    // Start alarm
    const { playSound, stopSound } = AlarmComponent();
    // End alarm

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: themeColor.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Timer
                    ref={timerChildRef}
                    start={startTimer}
                    stop={stopTimer}
                    startFrom={startTimerFrom}
                    isCountdown={isCountdown}
                    countdownIsFinished={countdownIsFinished}
                />
            </View>
            <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>{routine.name}</Text>

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

            {/* Start Exercises sets executions */}
            <View style={{ flex: 1 }}>
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
                    label={isCountdown && !coutdownFinished ? "Skip" : "Done"}
                    onPress={() => {
                        if (!coutdownFinished)
                            goNext();
                        else
                            stopSoundAndGoNext()
                    }}
                />
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