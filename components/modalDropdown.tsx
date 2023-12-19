import { useState } from "react";
import { FlatList, I18nManager, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';

import Animated, { Easing, useAnimatedStyle, withTiming, useSharedValue, FadeInUp, FadeInDown } from 'react-native-reanimated';
import InternalModal from "./modal";

export default function ModalDropdown({ value, keyField, labelField, label, data, onSelect, onAddElement }: { value: any, keyField: string, labelField: string, label: string, data: any[], onSelect: (item: any) => void, onAddElement: () => void }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const [showModal, setShowModal] = useState(false);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={[styles.item, { backgroundColor: themeColor.background }]} onPress={() => {
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
            <Animated.View style={[styles.modalContentContainer,
            { backgroundColor: themeColor.background }]} entering={FadeInDown}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatListStyle}
                />
                <TouchableOpacity style={[styles.item, { backgroundColor: themeColor.success }]} onPress={() => {
                    addElement()

                }}>
                    <AntDesign name="pluscircle" size={18} color="white" />
                    <Text style={styles.itemText}>Aggiungi</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    const addElement = () => {
        setShowModal(false);
        setTimeout(() => {
            // necessario per far comparire diverse modali su IOS
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
            {/* <Modal animationType="none" transparent={true} visible={showModal}>
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={[
                        styles.modalContainer,
                        { backgroundColor: themeColor.black + 90 }
                    ]}>
                        <Animated.View style={[styles.modalContentContainer,
                        { backgroundColor: themeColor.background }]} entering={FadeInDown}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                style={styles.flatListStyle}
                            />
                            <TouchableOpacity style={[styles.item, { backgroundColor: themeColor.success }]} onPress={() => {
                                addElement()

                            }}>
                                <AntDesign name="pluscircle" size={18} color="white" />
                                <Text style={styles.itemText}>Aggiungi</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal> */}
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
    modalContentContainer: {
        // backgroundColor: 'red',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    flatListStyle: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        maxHeight: 300
    },
    item: {
        padding: 14,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    itemText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        textTransform: 'capitalize',
        flex: 1
    }
})
