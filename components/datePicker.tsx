import React, { useState } from 'react';
import { StyleSheet, View, useColorScheme, Platform, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Input from './Input';
import { formatDate } from '../shared/utils';
import InternalButton from './button';

const InternalDatepicker = ({
    value, label, onValueChange = (value: Date) => { }, mode = 'date'
}: {
    value: Date, label: string, onValueChange?: (value: Date) => void, mode?: 'date' | 'time'
}) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const [show, setShow] = useState(false);
    const [date, setdate] = useState(new Date);

    const toggleDatepicker = () => {
        setShow(!show);
    };

    const onDateChange = (value: DateTimePickerEvent) => {

        if (value.type == 'set') {
            setdate(new Date(value.nativeEvent.timestamp));
            if (Platform.OS === 'android') {
                toggleDatepicker();
                onValueChange(new Date(value.nativeEvent.timestamp));
            }
        } else {
            toggleDatepicker();
        }
    }
    const confirmIOSData = () => {
        onValueChange(date);
        toggleDatepicker();
    }

    return (
        <>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    mode={mode}
                    display="spinner"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    style={[styles.datePicker]}
                    textColor={themeColor.text}
                />
            )}

            {show && Platform.OS === 'ios' && (
                <View style={styles.iosView}>
                    <InternalButton label='Annulla' cancelButton={true} onPress={() => toggleDatepicker()} />
                    <InternalButton label='Conferma' onPress={() => confirmIOSData()} />
                </View>
            )}

            {!show && (
                <Pressable onPress={() => toggleDatepicker()}>
                    <Input
                        value={formatDate(value, mode)}
                        label={label}
                        disabled={true}
                        onInputPressed={toggleDatepicker}
                    />
                </Pressable>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    datePicker: {
        height: 120,
        marginTop: -10
    },
    iosView: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
});

export default InternalDatepicker;