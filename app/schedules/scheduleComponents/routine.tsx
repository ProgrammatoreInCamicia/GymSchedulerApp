import { Text, View } from "react-native";
import { Routine } from "../../../store/store.models";

export default function RoutineComponent({ routine }: { routine: Routine }) {
    return (
        <View>
            <Text>Routine page {routine.name}</Text>
        </View>
    )
};
