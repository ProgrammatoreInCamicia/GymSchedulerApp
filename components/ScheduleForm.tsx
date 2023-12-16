import React from "react";
import { Button, View, StyleSheet, useColorScheme } from "react-native";
import Input from "./Input";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentScheduleEndDate, setCurrentScheduleStartDate, setCurrentScheduleTitle } from "../store/schedules.reducer";
import Colors from "../constants/Colors";
import InternalDatepicker from "./datePicker";

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
            <Input
                value={currentSchedule.title}
                placeholder={'Inserisci nome scheda'}
                onValueChange={onTitleChange}
                onValueSubmit={onValueSubmit}
                label="Nome scheda"
            />
            {/* <Text style={styles.label}>Inserisci validità: </Text> */}

            <View style={styles.datesContainer}>
                <InternalDatepicker value={currentSchedule.startDate} label="Dal" onValueChange={onStartDateChange} />
                <InternalDatepicker value={currentSchedule.endDate} label="Al" onValueChange={onEndDateChange} />
            </View>




            <Button title="Avanti" onPress={() => {
                onSubmit();
            }} />
            <Button title="Annulla" onPress={() => {
                onCancel();
            }} />

        </View>
    );
}

ScheduleForm.defaultProps = {
    initialValues: {
        title: '',
        dateStart: null,
        dateEnd: null,
        frequency: 2
    }
};

const styles = StyleSheet.create({
    background: {
        padding: 10,
        gap: 5
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        fontSize: 18,
        marginBottom: 10
    },
    datesContainer: {
        display: 'flex',
        // flexDirection: "row",
        gap: 20
    },
    dateContainer: {
        display: 'flex',
        flexDirection: "row",
    },
    label: {
        fontSize: 20,
    },

});

export default ScheduleForm;