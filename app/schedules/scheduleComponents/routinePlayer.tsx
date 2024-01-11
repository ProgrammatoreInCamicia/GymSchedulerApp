import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle"
import Colors from "../../../constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { RoutineExercise } from "../../../store/store.models";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import InternalButton from "../../../components/button";
import Timer from "../../../components/timer";
import AnimatedPagerView from "../../../components/animatedPagerView";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AlarmComponent } from "../../../components/alarmComponent";
import { usePushNotification } from "../../../components/usePushNotifications";
import { addWorkoutStatistics } from "../../../store/schedules.reducer";

export default function RoutinePlayer() {
    const { expoPushToken, schedulePushNotification } = usePushNotification();
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

    const [currentSet, setCurrentSet] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentRoutineExercise, setSurrentRoutineExercise] = useState<RoutineExercise>(null);

    const [coutdownFinished, setCoutdownFinished] = useState(false);
    // start timer on open
    useEffect(() => {
        setSurrentRoutineExercise(routine.exercises[0]);
        setStartTimer(true);
    }, []);

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
            if ((currentRoutineExercise.sets - 1) > currentSet) {
                goToNextSet()
            } else {
                goToNextExercise()
            }
            return;
        }
        setTotalRoutineTime(total => total + getTimerChildState());
        setStopTimer(stopTimer => !stopTimer);

        // // Check if current set is not the last inside current exercise
        if ((currentRoutineExercise.sets - 1) > currentSet) {
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
            goToNextExercise()
        }

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

    const goToNextExercise = () => {
        if (routine.exercises.length - 1 === currentPage) {
            dispatch(addWorkoutStatistics({
                routine: routine,
                totalTime: totalRoutineTime
            }))
            router.push('statistics');
        } else {
            onPageSelected(currentPage + 1);
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
        if ((currentRoutineExercise.sets - 1) > currentSet) {
            goToNextSet();
        } else {
            goToNextExercise();
        }
    }

    const onPageSelected = (page: number) => {
        setCurrentPage(page);
        setSurrentRoutineExercise(routine.exercises[page]);
    }

    const pagerContent = (exercise: RoutineExercise) => {
        let array = Array.from(Array(exercise.sets).keys());
        return (
            <View>
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>{exercise.exercise.name}</Text>
                <ScrollView>
                    {array.map((el, i) => {
                        return (
                            <View key={i} style={[styles.setContainer, {
                                backgroundColor: currentSet == i ? themeColor.success : themeColor.black + 60
                            }]}>
                                <View style={[styles.setCounter, { backgroundColor: themeColor.white }]}>
                                    <Text>{i + 1}</Text>
                                </View>
                                <View style={[styles.setValueContainer]}>
                                    <View style={[
                                        styles.setCounter,
                                        styles.setValue,
                                        { backgroundColor: themeColor.background }
                                    ]}>
                                        <Text style={{ color: themeColor.text, fontWeight: '500' }}>{exercise.reps}</Text>
                                    </View>
                                    <Text style={{ color: themeColor.text }}>Reps</Text>
                                </View>
                                <View style={[styles.setValueContainer]}>
                                    <View style={[
                                        styles.setCounter,
                                        styles.setValue,
                                        { backgroundColor: themeColor.background }
                                    ]}>
                                        <Text style={{ color: themeColor.text, fontWeight: '500' }}>{exercise.weight}</Text>
                                    </View>
                                    <Text style={{ color: themeColor.text }}>Kg</Text>
                                </View>
                            </View>
                        );
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
                <InternalButton label={isCountdown ? "Skip" : "Fatto"} onPress={() => {
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
    }
})