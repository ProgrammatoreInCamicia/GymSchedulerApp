import React from 'react';
import { StyleSheet, TextInput, View, Text, InputModeOptions, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

const Input = ({
    value, label,
    disabled = false, inputMode = "text", multiline = false, height = 40,
    placeholder, onValueChange = Function, onValueSubmit = () => { }, onInputPressed = () => { }
}: {
    value: any, label?: string, disabled?: boolean, inputMode?: InputModeOptions, multiline?: boolean,
    height?: number, placeholder?: string, onValueChange?: (value: string) => void,
    onValueSubmit?: () => void, onInputPressed?: () => void
}) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    return (
        <View style={[styles.inputContainer, {}]}>
            {label && (
                <Text style={[styles.label, { color: themeColor.text }]}>{label}</Text>
            )}
            <View style={[styles.inputBackgroundStyle, { height: height }]}>
                <TextInput
                    value={value}
                    editable={!disabled}
                    selectTextOnFocus={!disabled}
                    placeholder={placeholder}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={onValueChange}
                    onEndEditing={onValueSubmit}
                    onPressIn={onInputPressed}
                    inputMode={inputMode}
                    multiline={multiline}
                    numberOfLines={4}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputBackgroundStyle: {
        marginTop: 5,
        height: 40,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f0EEEE',
        paddingHorizontal: 15
    },
    label: {
        fontSize: 18,
    },
    inputStyle: {
        flex: 1,
        fontSize: 18,
    },
});

export default Input;