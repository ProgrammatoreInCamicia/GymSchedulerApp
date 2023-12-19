import React from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

export default function InternalModal({ showModal, removeModal, content }: { showModal: boolean, removeModal: () => void, content: () => React.JSX.Element }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    return (
        <Modal animationType="none" transparent={true} visible={showModal}>
            <TouchableWithoutFeedback onPress={() => removeModal()}>
                <View style={[
                    styles.modalContainer,
                    { backgroundColor: themeColor.black + 90 }
                ]}>
                    {content()}
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
const styles = StyleSheet.create({
    modalContainer: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
})