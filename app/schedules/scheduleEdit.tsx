import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import ScheduleForm from '../../components/ScheduleForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store/hooks';
import { resetCurrentSchedule, updateSchedulesBasedOnCurrent } from '../../store/schedules.reducer';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';

export default function scheduleEdit() {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    const isPresented = router.canGoBack();

    const dispatch = useAppDispatch();

    const onSubmit = () => {
        dispatch(updateSchedulesBasedOnCurrent());
        router.push('/schedules');
    }

    const onCancel = () => {
        dispatch(resetCurrentSchedule());
        router.push('/schedules');
    }
    return (
        <SafeAreaView style={[CommonComponentsStyle.mainContainer, { backgroundColor: themeColor.background }]}>
            {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
            {!isPresented && <Link href="../">Dismiss</Link>}
            {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
            {Platform.OS === 'android' && (
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text, backgroundColor: themeColor.secondary + 40 }]}>Modifica scheda</Text>
            )}
            <View style={CommonComponentsStyle.container}>
                <ScheduleForm onSubmit={onSubmit} onCancel={onCancel} />
            </View>

            <StatusBar style="light" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
})