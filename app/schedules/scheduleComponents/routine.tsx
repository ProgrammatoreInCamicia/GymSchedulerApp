import { Text, View } from "react-native";
import { Routine } from "../../../store/store.models";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";

export default function RoutineComponent({ routine }: { routine: Routine }) {
    return (
        <View style={[CommonComponentsStyle.container, {}]}>
            <Text>Routine page {routine.name}</Text>
        </View>
    )
};
