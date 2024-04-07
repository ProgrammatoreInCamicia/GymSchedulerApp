import { useState } from "react";
import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';

import Animated, { FadeInDown } from 'react-native-reanimated';
import InternalModal from "./modal";
import CommonComponentsStyle from "../constants/CommonComponentsStyle";

export default function ModalDropdown({ value, keyField, labelField, label, data, onSelect, onAddElement }: { value: any, keyField: string, labelField: string, label: string, data: any[], onSelect: (item: any) => void, onAddElement: () => void }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const [showModal, setShowModal] = useState(false);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[CommonComponentsStyle.modalContentContainerItem, { backgroundColor: themeColor.background }]} onPress={() => {
            onSelect(item);
            setShowModal(false);
        }}>
            <Text style={[styles.itemText]}>{item[labelField]}</Text>
            {value && value[keyField] == item[keyField] && (
                <AntDesign name="checkcircle" size={18} color="white" />
            )}
        </TouchableOpacity>
    );

    const modalContent = () => {
        return (
            <Animated.View style={[CommonComponentsStyle.modalContentContainer,
            { backgroundColor: themeColor.background }]} entering={FadeInDown}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatListStyle}
                />
                <TouchableOpacity style={[CommonComponentsStyle.modalContentContainerItem, { backgroundColor: themeColor.success }]} onPress={() => {
                    addElement()

                }}>
                    <AntDesign name="pluscircle" size={18} color="white" />
                    <Text style={styles.itemText}>Add</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    const addElement = () => {
        setShowModal(false);
        setTimeout(() => {
            // necessary to add different modals in IOS
            onAddElement();
        }, 1);
    }

    return (
        <TouchableOpacity
            style={[styles.button]}
            onPress={() => setShowModal(true)}
        >
            <Text style={styles.buttonText} >
                {(!!value && value[labelField]) || label}
            </Text>
            <Ionicons name="chevron-down" size={25} style={styles.icon} />
            <InternalModal
                showModal={showModal}
                removeModal={() => setShowModal(false)}
                content={modalContent}
            />
        </TouchableOpacity>
    )
}
const side = I18nManager.getConstants().isRTL ? 'right' : 'left';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0EEEE',
        height: 40,
        borderRadius: 5,
        zIndex: 1,
        paddingHorizontal: 10,
        marginTop: 15,
    },
    buttonText: {
        flex: 1,
        fontSize: 18
    },
    icon: {
    },
    flatListStyle: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        maxHeight: 300
    },
    itemText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        textTransform: 'capitalize',
        flex: 1
    }
})
