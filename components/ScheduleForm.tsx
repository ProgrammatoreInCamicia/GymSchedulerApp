import React, { useEffect, useState } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import Input from "./Input";
import { useAppDispatch } from "../store/hooks";
import { setCurrentScheduleEndDate, setCurrentScheduleStartDate, setCurrentScheduleTitle } from "../store/schedules.reducer";
import Colors from "../constants/Colors";
import InternalDatepicker from "./datePicker";
import InternalButton from "./button";
import { Schedule } from "../store/store.models";

const ScheduleForm = (
    { onSubmit = () => { }, onCancel, schedule }: { onSubmit: () => void, onCancel: () => void, schedule: Schedule }
) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();

    const onStartDateChange = (value: Date) => {
        dispatch(setCurrentScheduleStartDate(value));
    }

    const onEndDateChange = (value: Date) => {
        dispatch(setCurrentScheduleEndDate(value));
    }

    const [title, setTitle] = useState(schedule.title);

    const onTitleChange = (value: string) => {
        setTitle(value);
        dispatch(setCurrentScheduleTitle(value));
    }

    function onValueSubmit() {
        dispatch(setCurrentScheduleTitle(title));
    }

    useEffect(() => {
        setTitle(schedule.title)
    }, [schedule])

    return (
        <View style={styles.background}>
            <View style={{ flex: 1 }}>

                <Input
                    value={title}
                    placeholder={'Type schedule name'}
                    onValueChange={onTitleChange}
                    onValueSubmit={onValueSubmit}
                    label="Schedule name"
                />

                <View style={styles.datesContainer}>
                    <InternalDatepicker value={schedule.startDate} label="From" onValueChange={onStartDateChange} />
                    <InternalDatepicker value={schedule.endDate} label="To" onValueChange={onEndDateChange} />
                </View>
            </View>


            <View style={styles.formFooter}>
                <View style={{ flex: 1 }}>
                    <InternalButton label='Cancel' cancelButton={true} onPress={() => onCancel()} />
                </View>
                <View style={{ flex: 1 }}>
                    <InternalButton label='Next' onPress={() => onSubmit()} />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        gap: 5,
        marginTop: 50
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