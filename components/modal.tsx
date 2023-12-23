import React from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

export default function InternalModal({ showModal, removeModal, content, preventRemove = false }: { showModal: boolean, removeModal: () => void, content: () => React.JSX.Element, preventRemove?: boolean }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const removeIsPrevented = () => {

    }

    return (
        <Modal animationType="none" transparent={true} visible={showModal}>
            <TouchableWithoutFeedback onPress={() => preventRemove ? removeIsPrevented() : removeModal()}>
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