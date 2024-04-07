import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme } from "react-native"
import Colors from "../../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect, useRef, useState } from "react";
import { RoutineExercise } from "../../../store/store.models";
import Input from "../../../components/Input";
import InternalButton from "../../../components/button";
import Timer from "../../../components/timer";
import { AlarmComponent } from "../../../components/alarmComponent";
import { addWorkoutStatistics } from "../../../store/schedules.reducer";

const RoutinePlayer2 = () => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();

    // Routine definition
    const { routineId } = useLocalSearchParams();
    const routine = useAppSelector((state) => state.schedules.currentSchedule.routines.find(r => r.guid == routineId));

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
        // setTotalRoutineTime(total => total + currentRoutineExercise.rest);
        // setCoutdownFinished(true);
        // playSound();
    }
    // End timer

    // Start Historical data definition
    useEffect(() => {
        setCurrentExercise(0);
        setStartTimer(true);
    }, [routine]);

    const [archivedHistoricalData, setArchivedHistoricalData] = useState<{
        weight: number;
        reps: number;
    }[][][]>([]);

    const [historicalData, setHistoricalData] = useState<{
        weight: number;
        reps: number;
    }[][]>([])

    const setHistoricalDataOfCurrentRoutineExercise = (index: number) => {
        let historicalData;
        if (archivedHistoricalData[index]) {
            historicalData = archivedHistoricalData[index];
        } else {
            const routineExercise: RoutineExercise = routine.exercises[index];
            historicalData = routineExercise.setsConfig.map(setConfig => {
                let data: { weight: number, reps: number }[] = [];
                let arrayOfSets = Array.from(Array(setConfig.sets).keys());
                if (setConfig.historicalData.length > 0) {
                    // uso l'ultimo historical data disponibile
                    var validHistoricalData = setConfig.historicalData.reduce((a, b) => {
                        return new Date(a.data) > new Date(b.data) ? a : b
                    })
                    arrayOfSets.map(set => {
                        data.push({
                            weight: validHistoricalData.setConfig.weight,
                            reps: validHistoricalData.setConfig.reps
                        })
                    })
                } else {
                    arrayOfSets.map(set => {
                        data.push({
                            weight: setConfig.weight,
                            reps: setConfig.reps
                        })
                    })
                }

                return data;
            });

        }
        setHistoricalData(historicalData);
    }

    const setHistoricalDataWeight = (value: string, setConfigIndex: number, setIndex: number) => {
        setHistoricalData(historicalData => {
            const updatedArray = [...historicalData];
            updatedArray[setConfigIndex][setIndex].weight = +value;

            return [...updatedArray];
        })
    }

    const setHistoricalDataReps = (value: string, setConfigIndex: number, setIndex: number) => {
        setHistoricalData(historicalData => {
            const updatedArray = [...historicalData];
            updatedArray[setConfigIndex][setIndex].reps = +value;

            return [...updatedArray];
        })
    }
    // End Historical data definition

    // Start alarm
    const { playSound, stopSound } = AlarmComponent();
    // End alarm

    // Exercise definition

    const setCurrentExercise = (index: number) => {
        if (index > routine.exercises.length - 1) {
            // finish
            dispatch(addWorkoutStatistics({
                routine: routine,
                totalTime: totalRoutineTime
            }))

            let routineExercises: RoutineExercise[] = [];
            console.log('historical data :', JSON.stringify(archivedHistoricalData[0]), JSON.stringify(historicalData));
            console.log('current exercise info: ', JSON.stringify(routine.exercises[0].setsConfig));
            // routine.exercises.forEach((exercise, exerciseIndex) => {
            //     let changedExercise = { ...exercise };
            //     if (exerciseIndex < routine.exercises.length - 1) {
            //         // use archived
            //         archivedHistoricalData[exerciseIndex].map(setsConfig => {
            //             let setConfigRepsArray: number[] = [];
            //             setConfigRepsArray = setsConfig.map(setConfig => setConfig.reps);
            //             let allRepsAreEqual = setConfigRepsArray.every(element => element === setConfigRepsArray[0]);
            //             let setConfigWeigthArray: number[] = [];
            //             setConfigWeigthArray = setsConfig.map(setConfig => setConfig.weight);
            //             let allWeightsAreEqual = setConfigWeigthArray.every(element => element === setConfigWeigthArray[0]);
            //             if (allRepsAreEqual && allWeightsAreEqual) {
            //                 changedExercise.setsConfig.forEach(sc => {
            //                     sc.historicalData.push({
            //                         data: new Date(),
            //                         setConfig: setsConfig[0]
            //                     })
            //                 })
            //                 routineExercises.push(changedExercise);
            //             } else {

            //             }
            //         })
            //     } else {
            //         // use historical
            //     }
            // });
            // console.log('added historical data:', routineExercises[0].setsConfig[0].historicalData);
            router.push('statistics');
        } else {
            if (historicalData.length) {
                setArchivedHistoricalData(archivedHistoricalData => {
                    const changed = [...archivedHistoricalData]
                    if (changed[currentExerciseIndex]) {
                        // change historical data
                        changed[currentExerciseIndex] = historicalData;
                    } else {
                        // add historical data to archive
                        changed.push(historicalData);
                    }
                    return [...changed];
                })
                // save historical data on store
                routine.exercises[index].setsConfig = [{
                    guid: '',
                    reps: 0,
                    sets: 0,
                    weight: 0,
                    historicalData: [{
                        setConfig: {
                            reps: 0,
                            weight: 0,
                        },
                        data: new Date()
                    }]
                }]
                console.log(routine.exercises[index].setsConfig);
            }
            setCurrentExerciseIndex(index);
            setCurrentSetIndex(0);
            setHistoricalDataOfCurrentRoutineExercise(index);
        }
    }

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);

    const goToNextSet = () => {
        setStartTimerFrom(0);
        setCurrentSetIndex(currentSet => currentSet + 1);
        setStopTimer(stopTimer => !stopTimer);
        setIsCountdown(false);
        setTimeout(() => {
            setStartTimer(startTimer => !startTimer);
        }, 0);
    }

    const getCurrentExerciseSetCount = () => {
        let currentExerciseSetCount = 0;
        historicalData.forEach(singleData => {
            singleData.forEach(data => {
                currentExerciseSetCount++;
            })
        });

        return currentExerciseSetCount;
    }

    const getCurrentSetIndex = (historicalDataIndex: number) => {
        let currentIndexCount = 0;
        for (let i = historicalDataIndex - 1; i >= 0; i--) {

            currentIndexCount += historicalData[i].length;
        }
        return currentIndexCount;
    }

    const goNext = () => {
        let currentExerciseSetCount = getCurrentExerciseSetCount();
        let exerciseRest = routine.exercises[currentExerciseIndex].rest;
        // skip coutdown
        if (isCountdown) {
            setTotalRoutineTime(total => total + (exerciseRest - getTimerChildState()));

            if (currentSetIndex < currentExerciseSetCount - 1) {
                goToNextSet()
            } else {
                // go to next exercise
                setCurrentExercise(currentExerciseIndex + 1);
            }

            return;
        }
        setTotalRoutineTime(total => total + getTimerChildState());
        setStopTimer(stopTimer => !stopTimer);

        // Check if current set is not the last inside current exercise
        if (currentSetIndex < currentExerciseSetCount - 1) {
            console.log('it is not the last set - go to next set')
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
            console.log('it is the last set');
            // go to next exercise
            setCurrentExercise(currentExerciseIndex + 1);
        }

    }

    const stopSoundAndGoNext = () => {
        console.log(currentExerciseIndex, currentSetIndex, historicalData);
    }

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

            <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>Testo player</Text>

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
                            // backgroundColor: index == 0 ? 'yellow' : index == 1 ? 'red' : 'blue', 
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

            <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>{routine.exercises[currentExerciseIndex].exercise.name}</Text>

            {/* Start Exercises sets executions */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={historicalData}
                    keyExtractor={(singleHistoricalData, i) => i + ''}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index}>
                                {item.map((set, setIndex) => {
                                    return (
                                        <View key={setIndex} style={[styles.setContainer, {
                                            backgroundColor:
                                                // currentRoutineExercise?.guid === exercise.guid &&
                                                (getCurrentSetIndex(index) + (setIndex)) === currentSetIndex ?
                                                    //     && currentSet == i
                                                    themeColor.success :
                                                    themeColor.black + 60
                                        }]}>
                                            <View style={[styles.setCounter, { backgroundColor: themeColor.white }]}>
                                                <Text>{getCurrentSetIndex(index) + (setIndex + 1)}</Text>
                                            </View>
                                            <View style={[styles.setValueContainer]}>
                                                <Input
                                                    inputMode="decimal"
                                                    value={historicalData[index][setIndex]?.reps + ''}
                                                    onValueChange={(value) => setHistoricalDataReps(value, index, setIndex)}
                                                    backgroundColor={themeColor.background}
                                                    inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }}
                                                />
                                                <Text style={{ color: themeColor.text }}>Reps</Text>
                                            </View>
                                            <View style={[styles.setValueContainer]}>
                                                <Input
                                                    inputMode="decimal"
                                                    value={historicalData[index][setIndex]?.weight + ''}
                                                    onValueChange={(value) => setHistoricalDataWeight(value, index, setIndex)}
                                                    backgroundColor={themeColor.background}
                                                    inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }}
                                                />
                                                <Text style={{ color: themeColor.text }}>Kg</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>

                        )
                    }}
                />
            </View>
            {/* End Exercises sets executions */}

            <View style={[{ backgroundColor: themeColor.black + 40, paddingHorizontal: 20 }]}>
                <InternalButton
                    label={"Fatto"}
                    // label={isCountdown && !coutdownFinished ? "Skip" : "Fatto"} 
                    onPress={() => {
                        if (!coutdownFinished)
                            goNext();
                        else
                            stopSoundAndGoNext()
                    }}
                />
            </View>
        </SafeAreaView>
    )
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
    // setValue: {
    //     borderRadius: 4
    // },
})

export default RoutinePlayer2;
