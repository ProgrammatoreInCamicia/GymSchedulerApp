import { StyleSheet } from "react-native";

export default StyleSheet.create({
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        paddingHorizontal: 20,
        // flex: 1
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500'
    },
    mainContainer: {
        flex: 1,
        paddingBottom: 100
    },
    container: {
        paddingHorizontal: 16,
        flex: 1
    },
    title: {
        fontSize: 20,
        // textTransform: 'uppercase',
        fontWeight: '500',
        padding: 15
    }
});