import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export interface AlarmState {
    playSound?: () => any,
    stopSound?: () => any,
}

export const AlarmComponent = (): AlarmState => {
    const [sound, setSound] = useState<Audio.Sound>();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/ring.mp3')
        );
        setSound(sound);

        sound.setIsLoopingAsync(true);
        await sound.playAsync();
    }

    async function stopSound() {
        sound.stopAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return {
        playSound, stopSound
    };
}

