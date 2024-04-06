import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle"
import Colors from "../../../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { HistorycalData, RoutineExercise, SetConfig } from "../../../store/store.models";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import InternalButton from "../../../components/button";
import Timer from "../../../components/timer";
import AnimatedPagerView from "../../../components/animatedPagerView";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AlarmComponent } from "../../../components/alarmComponent";
// import { usePushNotification } from "../../../components/usePushNotifications";
import { addWorkoutStatistics } from "../../../store/schedules.reducer";
import Input from "../../../components/Input";

export default function RoutinePlayer() {
    // const { expoPushToken, schedulePushNotification } = usePushNotification();
    const dispatch = useAppDispatch();
    const { playSound, stopSound } = AlarmComponent();

    const { routineId } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const routine = useAppSelector((state) => state.schedules.currentSchedule.routines.find(r => r.guid == routineId));
    const [startTimer, setStartTimer] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [isCountdown, setIsCountdown] = useState(false);
    const [startTimerFrom, setStartTimerFrom] = useState(0);

    const [currentConfigSet, setCurrentConfigSet] = useState(0);

    const [currentSet, setCurrentSet] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentRoutineExercise, setCurrentRoutineExercise] = useState<RoutineExercise>(null);

    const [coutdownFinished, setCoutdownFinished] = useState(false);

    const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);

    // start timer on open
    useEffect(() => {
        setCurrentRoutineExercise(routine.exercises[0]);
        setStartTimer(true);
        setRoutineExercises(routine.exercises.map(exercise => exercise));
        console.log('routineExercises', routineExercises)
    }, [routineId]);

    const [totalRoutineTime, setTotalRoutineTime] = useState(0);
    const timerChildRef = useRef<any>();
    const getTimerChildState = () => {
        const timer = timerChildRef.current.getChildTimer();
        return timer;
    }

    const goNext = () => {
        // skip coutdown
        if (isCountdown) {
            setTotalRoutineTime(total => total + (currentRoutineExercise.rest - getTimerChildState()));

            if ((currentRoutineExercise.setsConfig[currentConfigSet].sets - 1) > currentSet) {
                goToNextSet()
            } else {
                if (currentRoutineExercise.setsConfig.length > currentConfigSet + 1) {
                    // go to next setConfig
                    goToNextSetConfig();
                } else {
                    goToNextExercise();
                }
            }

            // if ((currentRoutineExercise.sets - 1) > currentSet) {
            //     goToNextSet()
            // } else {
            //     goToNextExercise()
            // }
            return;
        }
        setTotalRoutineTime(total => total + getTimerChildState());
        setStopTimer(stopTimer => !stopTimer);

        // // Check if current set is not the last inside current exercise
        if ((currentRoutineExercise.setsConfig[currentConfigSet].sets - 1) > currentSet) {
            if (currentRoutineExercise.rest) {
                // start rest timer
                setIsCountdown(true);
                setStartTimerFrom(currentRoutineExercise.rest);
                setTimeout(() => {
                    setStartTimer(startTimer => !startTimer);
                }, 0);
            }
            else {
                // go to next set
                goToNextSet()
            }
        } else {
            if (currentRoutineExercise.setsConfig.length > currentConfigSet + 1) {
                if (currentRoutineExercise.rest) {
                    // start rest timer
                    setIsCountdown(true);
                    setStartTimerFrom(currentRoutineExercise.rest);
                    setTimeout(() => {
                        setStartTimer(startTimer => !startTimer);
                    }, 0);
                }
                else {
                    // go to next setConfig
                    goToNextSetConfig();
                }
            } else {
                goToNextExercise();
            }
        }

        // if ((currentRoutineExercise.sets - 1) > currentSet) {
        //     if (currentRoutineExercise.rest) {
        //         // start rest timer
        //         setIsCountdown(true);
        //         setStartTimerFrom(currentRoutineExercise.rest);
        //         setTimeout(() => {
        //             setStartTimer(startTimer => !startTimer);
        //         }, 0);
        //     }
        //     else {
        //         // go to next set
        //         goToNextSet()
        //     }
        // } else {
        //     goToNextExercise()
        // }

    }

    const goToNextSet = () => {
        setStartTimerFrom(0);
        setCurrentSet(set => set + 1);
        setStopTimer(stopTimer => !stopTimer);
        setIsCountdown(false);
        setTimeout(() => {
            setStartTimer(startTimer => !startTimer);
        }, 0);
    }

    const goToNextSetConfig = () => {
        setStartTimerFrom(0);
        setCurrentConfigSet(configSet => configSet + 1);
        setCurrentSet(0);
        setStopTimer(stopTimer => !stopTimer);
        setIsCountdown(false);
        setTimeout(() => {
            setStartTimer(startTimer => !startTimer);
        }, 0);
    }

    const goToNextExercise = () => {
        if (routine.exercises.length - 1 === currentPage) {
            dispatch(addWorkoutStatistics({
                routine: routine,
                totalTime: totalRoutineTime
            }))
            console.log('added historical data:', routineExercises[0].setsConfig[0].historicalData);
            router.push('statistics');
        } else {
            onPageSelected(currentPage + 1);
            setCurrentConfigSet(0);
            setCurrentSet(0);
            setStartTimerFrom(0);
            setStartTimer(startTimer => !startTimer);
            setIsCountdown(false);
        }
        // setStartTimer(startTimer => !startTimer);
    }

    const countdownIsFinished = () => {
        setTotalRoutineTime(total => total + currentRoutineExercise.rest);
        setCoutdownFinished(true);
        playSound();
    }

    const stopSoundAndGoNext = () => {
        stopSound();
        setCoutdownFinished(false);
        if ((currentRoutineExercise.setsConfig[currentConfigSet].sets - 1) > currentSet) {
            goToNextSet()
        } else {
            if (currentRoutineExercise.setsConfig.length > currentConfigSet + 1) {
                // go to next setConfig
                goToNextSetConfig();
            } else {
                goToNextExercise();
            }
        }
        // if ((currentRoutineExercise.sets - 1) > currentSet) {
        //     goToNextSet();
        // } else {
        //     goToNextExercise();
        // }
    }

    const onPageSelected = (page: number) => {
        setCurrentPage(page);
        setCurrentRoutineExercise(routine.exercises[page]);
    }

    const setWeight = (routineExercise: RoutineExercise, setConfigIndex: number, weight: number) => {
        setRoutineExercises(prevRoutineExercises => {
            const updatedExercises = [...prevRoutineExercises];
            const indexOfExercise = updatedExercises.findIndex(ex => ex.guid === routineExercise.guid);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!updatedExercises[indexOfExercise].setsConfig[setConfigIndex].historicalData) {
                updatedExercises[indexOfExercise] = {
                    ...updatedExercises[indexOfExercise],
                    setsConfig: updatedExercises[indexOfExercise].setsConfig.map((setConfig, index) => {
                        if (index === setConfigIndex) {
                            return {
                                ...setConfig,
                                historicalData: []
                            }
                        }
                        return setConfig
                    })
                }
            }

            const indexOfHistoricalDataToChange = updatedExercises[indexOfExercise].setsConfig[setConfigIndex].historicalData.findIndex(historicalData => historicalData.data.getTime() === today.getTime());

            if (indexOfHistoricalDataToChange >= 0) {
                updatedExercises[indexOfExercise] = {
                    ...updatedExercises[indexOfExercise],
                    setsConfig: updatedExercises[indexOfExercise].setsConfig.map((setConfig, index) => {
                        if (index === setConfigIndex) {
                            return {
                                ...setConfig,
                                historicalData: setConfig.historicalData.map((historicalData, i) => {
                                    if (i === indexOfHistoricalDataToChange) {
                                        return {
                                            ...historicalData,
                                            setConfig: {
                                                reps: historicalData.setConfig.reps,
                                                weight
                                            }
                                        }
                                    }
                                    return historicalData
                                })
                            }
                        }
                        return setConfig
                    })
                }
            } else {
                // add a new element

                updatedExercises[indexOfExercise] = {
                    ...updatedExercises[indexOfExercise],
                    setsConfig: updatedExercises[indexOfExercise].setsConfig.map((setConfig, index) => {
                        if (index === setConfigIndex) {
                            return {
                                ...setConfig,
                                historicalData: [
                                    ...setConfig.historicalData,
                                    {
                                        data: today,
                                        setConfig: {
                                            weight,
                                            reps: 0
                                        }
                                    }
                                ]
                            }
                        }
                        return setConfig
                    })
                }
            }

            return updatedExercises
        })
    }

    const setReps = (routineExercise: RoutineExercise, setConfigIndex: number, reps: number) => {
        const updatedExercises = [...routineExercises];
        const indexOfExercise = updatedExercises.findIndex(ex => ex.guid === routineExercise.guid);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const indexOfHistoricalDataToChange = updatedExercises[indexOfExercise].setsConfig[setConfigIndex].historicalData.findIndex(historicalData => historicalData.data.getTime() === today.getTime());
        if (indexOfHistoricalDataToChange >= 0) {
            // change the current historical data
            updatedExercises[indexOfExercise].setsConfig[setConfigIndex].historicalData[indexOfHistoricalDataToChange].setConfig.reps = reps;
        } else {
            // add a new element
            updatedExercises[indexOfExercise].setsConfig[setConfigIndex].historicalData.push({
                data: today,
                setConfig: {
                    reps,
                    weight: updatedExercises[indexOfExercise].setsConfig[setConfigIndex].weight
                }
            });
        }
        setRoutineExercises(updatedExercises);
    }

    const getWeightValue = (currentExercise: RoutineExercise, currentSetConfigIndex: number, currentSetConfig: SetConfig): string => {
        if (routineExercises.length > 0) {

            let value = currentExercise.setsConfig[currentSetConfigIndex].weight + '';

            const historicalData = routineExercises.find(re => re.guid == currentExercise.guid)
                .setsConfig.find(sc => sc.guid == currentSetConfig.guid)
                .historicalData;
            if (historicalData.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const findedHistoricalData = historicalData.find(hd => hd.data.getTime() == today.getTime())
                if (findedHistoricalData) {
                    value = findedHistoricalData.setConfig.weight + '';
                } else {
                    value = historicalData[historicalData.length - 1].setConfig.weight + '';
                }
            }
            return value;
        } else {
            return '0';
        }
    }

    const pagerContent = (exercise: RoutineExercise) => {
        let generalIndexCount = 0;

        return (
            <View style={{ flex: 1 }}>
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>{exercise.exercise.name}</Text>
                <ScrollView>
                    {exercise.setsConfig.map((setConfig, setConfigIndex) => {
                        let array = Array.from(Array(setConfig.sets).keys());
                        return array.map((el, i) => {
                            generalIndexCount++;
                            return (
                                <View key={i} style={[styles.setContainer, {
                                    backgroundColor: currentRoutineExercise?.guid === exercise.guid &&
                                        currentConfigSet === setConfigIndex
                                        && currentSet == i
                                        ? themeColor.success : themeColor.black + 60
                                }]}>
                                    <View style={[styles.setCounter, { backgroundColor: themeColor.white }]}>
                                        <Text>{generalIndexCount}</Text>
                                    </View>
                                    <View style={[styles.setValueContainer]}>
                                        <View style={[
                                            styles.setCounter,
                                            styles.setValue,
                                            { backgroundColor: themeColor.background }
                                        ]}>
                                            <Text style={{ color: themeColor.text, fontWeight: '500' }}>{setConfig.reps}</Text>
                                        </View>
                                        <Text style={{ color: themeColor.text }}>Reps</Text>
                                    </View>
                                    <View style={[styles.setValueContainer]}>
                                        <View style={[
                                            { flex: 1 }
                                        ]}>
                                            <Input
                                                inputMode="decimal"
                                                value={getWeightValue(exercise, setConfigIndex, setConfig)}
                                                onValueChange={(value) => setWeight(exercise, setConfigIndex, +value)}
                                                backgroundColor={themeColor.background}
                                                inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }} />
                                        </View>
                                        <Text style={{ color: themeColor.text }}>Kg</Text>
                                    </View>
                                </View>
                            );

                        })
                    })}
                </ScrollView>
            </View>
        )
    }

    const paginationContent = (scrollOffsetAnimatedValue: Animated.Value, positionAnimatedValue: Animated.Value) => {
        return <View style={{ flexDirection: 'row' }}>
            {routine.exercises.map((item, index) => {
                const backgroundColor = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate(
                    {
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [themeColor.black, themeColor.success, themeColor.success]
                    },
                );

                return (
                    <View key={index} style={{
                        flex: index > 0 ? 1 : undefined
                    }}>
                        <TouchableWithoutFeedback onPress={() => { onPageSelected(index) }}>
                            <Animated.View style={[
                                styles.setCounter,
                                {
                                    alignSelf: 'flex-end',
                                    backgroundColor,
                                }
                            ]}>
                                <Text style={{ color: themeColor.text }}>
                                    {index + 1}
                                </Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                        {index > 0 && (
                            <Animated.View style={[styles.paginatorConnector, {
                                borderColor: backgroundColor,
                            }]}></Animated.View>
                        )}
                    </View>
                )
            })}
        </View>
    }

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: themeColor.background }]}>
            <View style={[CommonComponentsStyle.container, { flex: 1 }]}>
                <View style={[styles.headerContainer, {}]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', zIndex: 1 }}>
                        <Ionicons name="chevron-back" size={24} color={themeColor.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Timer
                            ref={timerChildRef}
                            start={startTimer}
                            stop={stopTimer}
                            startFrom={startTimerFrom}
                            isCountdown={isCountdown}
                            countdownIsFinished={countdownIsFinished}
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <AnimatedPagerView
                        data={routine.exercises}
                        page={currentPage}
                        content={pagerContent}
                        paginationContent={paginationContent}
                        onPageSelected={onPageSelected}
                    />
                </View>
            </View>
            <View style={[{ backgroundColor: themeColor.black + 40, padding: 20 }]}>
                <InternalButton label={isCountdown && !coutdownFinished ? "Skip" : "Fatto"} onPress={() => {
                    if (!coutdownFinished)
                        goNext();
                    else
                        stopSoundAndGoNext()
                }} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10
    },
    setContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 20
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
    setValue: {
        borderRadius: 4
    },
    paginatorConnector: {
        width: '100%',
        position: 'absolute',
        borderBottomWidth: 6,
        top: '45%',
        zIndex: -1,
        left: 0
    },
})