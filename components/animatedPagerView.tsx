import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native"
import PagerView from "react-native-pager-view";
import Colors from "../constants/Colors";



export default function AnimatedPagerView(
    { data, content, titleField, addElement = Function }:
        { data: any[], content: (item: any) => React.JSX.Element, titleField: string, addElement?: () => void }
) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    // Make PagerView an animated component
    const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

    // default definition of animation to pass as style property
    const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

    const Pagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {data.map((item, index) => {
                    const opacity = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View key={index} style={{ opacity: opacity }}>
                            <Text style={{
                                color: themeColor.text,
                                fontSize: 16
                            }}>{item[titleField]}</Text>
                        </Animated.View>
                    );
                })}
                <TouchableOpacity style={[styles.addPageButton, {
                    backgroundColor: themeColor.success,
                    shadowColor: themeColor.success,
                }]} onPress={() => addElement()}>
                    <Text style={{ color: themeColor.text }}>New Routine</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {Pagination()}
            <AnimatedPagerView
                style={styles.pagerView}
                initialPage={0}
                onPageScroll={(e) => {
                    // Imposto le due variabili di animazione in base ai parametri del PagerView
                    scrollOffsetAnimatedValue.setValue(e.nativeEvent.offset);
                    positionAnimatedValue.setValue(e.nativeEvent.position);
                }}
            >
                {data.map((item, index) => (
                    <View key={index}>
                        {content(item)}
                    </View>
                ))}
            </AnimatedPagerView>
        </View>
    )
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1
    },
    paginationContainer: {
        flexDirection: 'row',
        gap: 5,
        paddingVertical: 10,
        // backgroundColor: 'red'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 30,
    },
    addPageButton: {
        position: 'absolute',
        right: -15,
        padding: 10,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.2, // Adjust the opacity as needed
        shadowRadius: 5, // Adjust the radius as needed
        elevation: 5,
    }
})