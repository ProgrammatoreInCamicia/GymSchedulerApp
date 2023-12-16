import React from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { usePathname, useRouter, useSegments } from 'expo-router';

const MainNavigationBar = () => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const router = useRouter();
    const path = usePathname();
    return (
        <View style={styles.backgroundStyle}>
            <TouchableOpacity style={[styles.iconContainer, path == '/' ? { ...styles.iconContainerActive, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/')}>
                <Feather
                    name="search"
                    style={[styles.iconStyle, { fontSize: path == '/' ? 30 : 25 }]}
                    color={path == '/' ? Colors[colorScheme ?? 'light'].white : Colors[colorScheme ?? 'light'].background}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, path == '/schedules' ? { ...styles.iconContainerActive, backgroundColor: themeColor.background } : null]} onPress={() => router.push('/schedules')}>
                <AntDesign
                    name="calendar"
                    style={[styles.iconStyle, { fontSize: path == '/schedules' ? 30 : 25 }]}
                    color={path == '/schedules' ? Colors[colorScheme ?? 'light'].white : Colors[colorScheme ?? 'light'].background}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => router.push('/schedules')}>
                <AntDesign
                    name="setting"
                    style={styles.iconStyle}
                // color={routeName == '' ? COLORS.accent : COLORS.black} 
                // onPress={() => console.log('icon press')}
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
        backgroundColor: Colors.light.background,
        bottom: 5,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    fakeContainer: {
        backgroundColor: 'white',
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
        borderColor: Colors.light.white,
    }
});

export default MainNavigationBar;