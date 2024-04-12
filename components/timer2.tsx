import { StyleSheet, Text, View, useColorScheme } from "react-native"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useRef } from "react";
import { resetTimer, startTimer, stopTimer, tick } from "../store/timer.reducer";
import Colors from "../constants/Colors";

const Timer2 = () => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();
    const currentValue = useAppSelector(state => state.timer.currentValue);
    const isRunning = useAppSelector(state => state.timer.isRunning);
    const isCountdown = useAppSelector(state => state.timer.isCountdown);
    const intervalRef = useRef(null);

    // useEffect(() => {
    //     if (isRunning) {
    //         intervalRef.current = setInterval(() => {
    //             dispatch(tick());
    //         }, 1000);
    //     } else {
    //         clearInterval(intervalRef.current);
    //     }

    // }, [isRunning]);

    // useEffect(() => {
    //     handleStart();
    // }, [])

    const handleStart = () => {
        dispatch(startTimer());
    };

    const handleStop = () => {
        dispatch(stopTimer());
    };

    const handleReset = () => {
        dispatch(resetTimer());
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <View style={{ backgroundColor: themeColor.background }}>
            <View style={[styles.timerContainer, { backgroundColor: themeColor.black + 60 }]}>
                <Text style={[styles.timerText, { color: isCountdown ? themeColor.error : themeColor.text }]}>{formatTime(currentValue)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timerContainer: {
        width: 60,
        height: 60,
        borderRadius: 50,
        // borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timerText: {
        fontWeight: 'bold',
        fontSize: 16
    }
})

export default Timer2;