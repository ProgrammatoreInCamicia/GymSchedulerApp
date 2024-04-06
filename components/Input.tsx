import React from 'react';
import { StyleSheet, TextInput, View, Text, InputModeOptions, useColorScheme, StyleProp, TextStyle } from 'react-native';
import Colors from '../constants/Colors';

const Input = ({
    value, label,
    disabled = false, inputMode = "text", multiline = false, height = 40,
    placeholder, onValueChange = Function, onValueSubmit = () => { }, onInputPressed = () => { },
    backgroundColor = '#f0EEEE', inputStyle = { color: '#000', fontSize: 18 },
}: {
    value: any, label?: string, disabled?: boolean, inputMode?: InputModeOptions, multiline?: boolean,
    height?: number, placeholder?: string, onValueChange?: (value: string) => void,
    onValueSubmit?: (value?: string) => void, onInputPressed?: () => void, backgroundColor?: string, inputStyle?: StyleProp<TextStyle>
}) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    return (
        <View style={[styles.inputContainer, {}]}>
            {label && (
                <Text style={[styles.label, { color: themeColor.text }]}>{label}</Text>
            )}
            <View style={[styles.inputBackgroundStyle, { height: height, backgroundColor: backgroundColor }]}>
                <TextInput
                    value={value}
                    editable={!disabled}
                    selectTextOnFocus={!disabled}
                    placeholder={placeholder}
                    style={[styles.inputStyle, inputStyle]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={onValueChange}
                    onEndEditing={() => onValueSubmit(value)}
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