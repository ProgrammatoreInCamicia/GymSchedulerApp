import React, { LegacyRef, Ref } from "react";
import { Animated, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View, useColorScheme } from "react-native"
import PagerView from "react-native-pager-view";
import Colors from "../constants/Colors";



export default function AnimatedPagerView(
    { data, content, titleField, addElement = Function, paginationContent, onPageSelected = (page) => { }, page = 0 }:
        {
            data: any[], content: (item: any) => React.JSX.Element, titleField?: string,
            addElement?: () => void,
            paginationContent?: (scrollOffsetAnimatedValue: Animated.Value, positionAnimatedValue: Animated.Value) => React.JSX.Element,
            onPageSelected?: (page: number) => void,
            page?: number,
        }
) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    // Make PagerView an animated component
    const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

    // default definition of animation to pass as style property
    const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

    let internalAnimatedPagerView = React.useRef<any>();
    const internalOnPageSelected = (e: any) => {
        const currentPage = e.nativeEvent.position;
        // onPageSelected(currentPage);
    }

    const Pagination = (scrollOffsetAnimatedValue: Animated.Value, positionAnimatedValue: Animated.Value) => {
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
                            <TouchableOpacity onPress={() => internalAnimatedPagerView.current.setPage(index)}>
                                <Text style={{
                                    color: themeColor.text,
                                    fontSize: 16
                                }}>{item[titleField]}</Text>

                            </TouchableOpacity>
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
            {titleField && (
                Pagination(scrollOffsetAnimatedValue, positionAnimatedValue)
            )}
            {paginationContent && (
                paginationContent(scrollOffsetAnimatedValue, positionAnimatedValue)
            )}
            <AnimatedPagerView
                style={styles.pagerView}
                ref={internalAnimatedPagerView}
                initialPage={page}
                onPageScroll={(e) => {
                    // Set animation variables based on PagerView parameters
                    scrollOffsetAnimatedValue.setValue(e.nativeEvent.offset);
                    positionAnimatedValue.setValue(e.nativeEvent.position);
                }}
                onPageSelected={internalOnPageSelected}
            >
                {data.map((item, index) => (
                    <View key={index}>
                        {/* <Pressable> */}
                        {content(item)}

                        {/* </Pressable> */}
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
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 7 },
        shadowRadius: 5,
        elevation: 10,
    }
})