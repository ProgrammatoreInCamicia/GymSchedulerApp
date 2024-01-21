import { Slot, Stack, Tabs, usePathname } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
// import store from "../store/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MainNavigationBar from "../components/mainNavigationBar";
import { Platform, useColorScheme } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import Colors from "../constants/Colors";

export default function RootLayout() {
    const path = usePathname();
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    return (
        <>
            <StatusBar style="light" />
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <SafeAreaProvider>
                        {/* <Slot /> */}
                        {/* <Tabs tabBar={MainNavigationBar} /> */}
                        <Stack screenOptions={{
                            headerStyle: {
                                // backgroundColor: themeColor.secondary,
                            },
                            headerTintColor: themeColor.text,
                            headerTransparent: true
                        }}>
                            <Stack.Screen
                                name="home"
                                options={{
                                    headerShown: false
                                }}
                            />
                            <Stack.Screen
                                name="index"
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="exercise/index"
                                options={{
                                    presentation: 'transparentModal',
                                    title: '',
                                    // headerShown: Platform.OS == 'android' ? false : true
                                }}
                            />
                            <Stack.Screen
                                name="schedules/index"
                                options={{
                                    headerShown: false,
                                }}
                            />

                            <Stack.Screen
                                name="schedules/scheduleEdit"
                                options={{
                                    presentation: 'transparentModal',
                                    title: 'Modifica scheda',
                                    // headerShown: Platform.OS == 'android' ? false : true
                                }}
                            />
                            <Stack.Screen
                                name="schedules/scheduleComponents/routinePlayer"
                                options={{
                                    presentation: 'transparentModal',
                                    headerShown: false,
                                }}
                            />

                            <Stack.Screen
                                name="statistics/index"
                                options={{
                                    headerShown: false,
                                }}
                            />

                        </Stack>

                    </SafeAreaProvider>

                </PersistGate>

                {path != '/schedules/scheduleEdit' && path != '/schedules/scheduleComponents/routinePlayer' && path != '/exercise' &&
                    <MainNavigationBar />
                }
            </Provider>
        </>
    )
}