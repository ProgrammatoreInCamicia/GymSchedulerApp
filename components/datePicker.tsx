import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, InputModeOptions, useColorScheme, Platform, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Input from './Input';
import { formatDate } from '../shared/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

const InternalDatepicker = ({
    value, label, onValueChange = (value: Date) => { }
}: {
    value: Date, label: string, onValueChange?: (value: Date) => void
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
                    mode={'date'}
                    display="spinner"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    style={[styles.datePicker]}
                    textColor={themeColor.text}
                />
            )}

            {show && Platform.OS === 'ios' && (
                <View style={styles.iosView}>
                    <TouchableOpacity style={[
                        styles.button,
                        styles.pickerButton,
                        { backgroundColor: themeColor.grey }
                    ]}
                        onPress={() => toggleDatepicker()}
                    >
                        <Text style={[styles.buttonText, { color: themeColor.text }]}>Annulla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.button,
                        styles.pickerButton,
                        {
                            backgroundColor: themeColor.secondary + 20,
                        }
                    ]}
                        onPress={() => confirmIOSData()}
                    >
                        <Text style={[styles.buttonText, { color: themeColor.text }]}>Conferma</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!show && (
                <Pressable onPress={() => toggleDatepicker()}>
                    <Input
                        value={formatDate(value)}
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
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
    },
    pickerButton: {
        paddingHorizontal: 20
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500'
    },
});

export default InternalDatepicker;