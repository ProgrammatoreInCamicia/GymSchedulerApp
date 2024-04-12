import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

const Timer = forwardRef(({ start, stop, pause, startFrom = 0, isCountdown = false, countdownIsFinished = () => { } }:
    { start: boolean, stop: boolean, pause?: boolean, startFrom?: number, isCountdown?: boolean, countdownIsFinished?: () => void }, _ref) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    useImperativeHandle(_ref, () => ({
        getChildTimer: () => {
            return time;
        },
    }));

    const startTimer = () => {
        console.log('start timer');
        setStatus(1);
    }

    const stopTimer = () => {
        setStatus(-1);
    }

    const pauseTimer = () => {
        setStatus(status === 0 ? 1 : 0);
    }
    const [time, setTime] = useState(0);
    const [status, setStatus] = useState(-1);

    const reset = () => {
        setTime(startFrom);
    }

    useEffect(() => {
        startTimer()
    }, [start])

    useEffect(() => {
        stopTimer()
    }, [stop])

    useEffect(() => {
        pauseTimer()
    }, [pause])

    useEffect(() => {
        setTime(startFrom)
    }, [startFrom])

    useEffect(() => {
        let timerID: NodeJS.Timeout;
        if (status === 1) {
            timerID = setInterval(() => {
                if (isCountdown) {
                    setTime((time) => {
                        if (time == 0) {
                            stopTimer();
                            countdownIsFinished();
                            return time
                        }
                        return time - 1
                    });
                } else {
                    setTime((time) => time + 1);
                }
            }, 1000)
        } else {
            clearInterval(timerID)
            // if (status === -1)
            //     reset();
        }
        return () => { clearInterval(timerID) }
    }, [status])

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes.toFixed(0).padStart(2, '0')}:${remainingSeconds.toFixed(0).padStart(2, '0')}`;
        return formattedTime;
    }

    return (
        <View style={{ backgroundColor: themeColor.background }}>
            <View style={[styles.timerContainer, { backgroundColor: themeColor.black + 60 }]}>
                <Text style={[styles.timerText, { color: (isCountdown && status == -1) ? themeColor.error : themeColor.text }]}>{formatTimer(time)}</Text>
            </View>
        </View>
    )
});

export default React.memo(Timer);

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