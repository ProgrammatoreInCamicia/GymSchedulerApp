import { Slot, Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Colors from "../constants/Colors";
import { Provider } from "react-redux";
import store from "../store/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MainNavigationBar from "../components/mainNavigationBar";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Provider store={store}>
            <StatusBar style="light" />
            <SafeAreaProvider>
                <Slot />
                <MainNavigationBar />
                {/* <Tabs /> */}
            </SafeAreaProvider>
        </Provider>
        // </ThemeProvider>
    )
}