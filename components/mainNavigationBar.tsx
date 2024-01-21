import React from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Feather, AntDesign, Foundation } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { usePathname, useRouter, useSegments } from 'expo-router';

const MainNavigationBar = () => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const router = useRouter();
    const path = usePathname();
    return (
        <View style={[styles.backgroundStyle, { backgroundColor: themeColor.background }]}>
            <TouchableOpacity style={[styles.iconContainer, path == '/' ? { ...styles.iconContainerActive, borderColor: themeColor.white, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/')}>
                <Feather
                    name="search"
                    style={[styles.iconStyle, { fontSize: path == '/' ? 30 : 25 }]}
                    color={path == '/' ? themeColor.white : themeColor.background}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, path == '/schedules' ? { ...styles.iconContainerActive, borderColor: themeColor.white, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/schedules')}>
                <AntDesign
                    name="calendar"
                    style={[styles.iconStyle, { fontSize: path == '/schedules' ? 30 : 25 }]}
                    color={path == '/schedules' ? themeColor.white : themeColor.background}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, path == '/statistics' ? { ...styles.iconContainerActive, borderColor: themeColor.white, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/statistics')}>
                <Foundation
                    name="graph-bar"
                    style={[styles.iconStyle, { fontSize: path == '/statistics' ? 30 : 25 }]}
                    color={path == '/statistics' ? themeColor.white : themeColor.background}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, path == '/home' ? { ...styles.iconContainerActive, borderColor: themeColor.white, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/home')}>
                <AntDesign
                    name="setting"
                    style={[styles.iconStyle, { fontSize: path == '/home' ? 30 : 25 }]}
                    color={path == '/home' ? themeColor.white : themeColor.background}
                />
            </TouchableOpacity>
            <View style={[styles.backgroundStyle, styles.fakeContainer, { backgroundColor: themeColor.white }]}>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginHorizontal: 10,
        bottom: 5,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    fakeContainer: {
        height: 75,
        zIndex: -1,
        bottom: 10,
    },
    iconStyle: {
        fontSize: 25,
        alignSelf: 'center',
    },
    iconContainer: {
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 75,
        overflow: 'hidden',
    },
    iconContainerActive: {
        height: 75,
        width: 75,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 8,
    }
});

export default MainNavigationBar;