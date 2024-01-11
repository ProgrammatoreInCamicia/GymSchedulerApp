import { StyleSheet, Text, TouchableOpacity, View, useColorScheme, Animated as Animated2 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import { useAppSelector } from '../../store/hooks';

export default function StatisticsComponent() {

    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const statistics = useAppSelector((state) => state.schedules.schedules.filter(s => !!s.statistics).map(s => s.statistics).flat());
    console.log(statistics);
    return (
        <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>
            <Text>Schedule home</Text>
            <Text>{statistics[0]?.routine.name}</Text>
            <Text>{statistics[0]?.totalTime}</Text>

            <StatusBar style="light" />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
})