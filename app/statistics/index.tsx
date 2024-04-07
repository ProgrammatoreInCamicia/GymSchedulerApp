import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import { useAppSelector } from '../../store/hooks';

export default function StatisticsComponent() {

    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    // const statistics = useAppSelector((state) => state.schedules.schedules.filter(s => !!s.statistics).map(s => s.statistics).flat());
    const statistics = useAppSelector((state) => state.schedules.schedules.map(schedule => schedule.statistics));
    let generalIndex = 0;
    return (
        <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>
            <Text>Schedule home</Text>
            {statistics.map((statistic) => {
                return statistic.map(s => {
                    generalIndex++;
                    return (
                        <View key={generalIndex}>
                            <Text>{s?.routine.name}</Text>
                            <Text>{s?.totalTime}</Text>
                        </View>
                    )

                })
            })}

            <StatusBar style="light" />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
})