import React from 'react';
import { StyleSheet, Text, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonComponentsStyle from '../constants/CommonComponentsStyle';

const InternalButton = ({
    cancelButton = false, label, onPress = () => { }
}: {
    cancelButton?: boolean, label: string, onPress?: () => void
}) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    return (
        <>
            <TouchableOpacity style={[
                CommonComponentsStyle.button,
                {
                    backgroundColor: cancelButton ? themeColor.grey : themeColor.secondary + 20,
                }
            ]}
                onPress={() => onPress()}
            >
                <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>{label}</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
});

export default InternalButton;