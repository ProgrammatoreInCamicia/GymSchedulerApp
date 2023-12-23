import { Slot, Stack, Tabs, usePathname } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
// import store from "../store/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MainNavigationBar from "../components/mainNavigationBar";
import { Platform } from "react-native";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
    const path = usePathname();
    return (
        <>
            <StatusBar style="light" />
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <SafeAreaProvider>
                        {/* <Slot /> */}
                        {/* <Tabs tabBar={MainNavigationBar} /> */}
                        <Stack>
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
                                name="schedules/index"
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name="schedules/scheduleEdit"

                                options={{
                                    presentation: 'modal',
                                    title: 'Modifica scheda',
                                    headerShown: Platform.OS == 'android' ? false : true
                                }}
                            />

                        </Stack>

                    </SafeAreaProvider>

                </PersistGate>

                {path != '/schedules/scheduleEdit' &&
                    <MainNavigationBar />
                }
            </Provider>
        </>
    )
}