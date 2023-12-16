import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import Input from "./Input";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentScheduleEndDate, setCurrentScheduleStartDate, setCurrentScheduleTitle } from "../store/schedules.reducer";
import Colors from "../constants/Colors";
import InternalDatepicker from "./datePicker";
import InternalButton from "./button";

const ScheduleForm = (
    { onSubmit = () => { }, onCancel }: { onSubmit: () => void, onCancel: () => void }
) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const currentSchedule = useAppSelector((state) => state.schedules.currentSchedule);
    const dispatch = useAppDispatch();

    const onStartDateChange = (value: Date) => {
        dispatch(setCurrentScheduleStartDate(value));
    }

    const onEndDateChange = (value: Date) => {
        dispatch(setCurrentScheduleEndDate(value));
    }

    const onTitleChange = (value: string) => {
        dispatch(setCurrentScheduleTitle(value))
    }

    function onValueSubmit() {
        console.log('title submit : ')
    }

    return (
        <View style={styles.background}>
            <View style={{ flex: 1 }}>

                <Input
                    value={currentSchedule.title}
                    placeholder={'Inserisci nome scheda'}
                    onValueChange={onTitleChange}
                    onValueSubmit={onValueSubmit}
                    label="Nome scheda"
                />

                <View style={styles.datesContainer}>
                    <InternalDatepicker value={currentSchedule.startDate} label="Dal" onValueChange={onStartDateChange} />
                    <InternalDatepicker value={currentSchedule.endDate} label="Al" onValueChange={onEndDateChange} />
                </View>
            </View>


            <View style={styles.formFooter}>
                <View style={{ flex: 1 }}>
                    <InternalButton label='Annulla' cancelButton={true} onPress={() => onCancel()} />
                </View>
                <View style={{ flex: 1 }}>
                    <InternalButton label='Avanti' onPress={() => onSubmit()} />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        gap: 5
    },
    datesContainer: {
        display: 'flex',
    },
    formFooter: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
});

export default ScheduleForm;