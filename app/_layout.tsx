import { Slot } from "expo-router";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Colors from "../constants/Colors";
import { Provider } from "react-redux";
import store from "../store/store";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Provider store={store}>
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" backgroundColor={Colors[colorScheme ?? 'light'].background} />
                    <Slot />

                </SafeAreaView>
            </Provider>
        </ThemeProvider>
    )
}