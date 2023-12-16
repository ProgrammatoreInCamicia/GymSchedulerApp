import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Exercise } from '../store/store.models';
import Colors from '../constants/Colors';

const ExercisesComponent = ({ exercises, exercisePressed }: { exercises: Exercise[], exercisePressed: (id: string) => void }) => {
    const colorScheme = useColorScheme();
    return (
        <FlatList
            data={exercises}
            keyExtractor={(exercise) => exercise._id}
            initialNumToRender={25}
            style={{ marginBottom: 100 }}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity style={styles.exerciseContainer} onPress={() => exercisePressed(item._id)}>
                        <Image
                            source={{ uri: item.images[0] }}
                            style={{ width: 100, height: 100 }} />
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <FontAwesome name="minus" size={24} style={{
                                    color: item.difficulty == 'beginner' ?
                                        Colors[colorScheme ?? 'light'].success : item.difficulty == 'intermediate' || 'default' ?
                                            Colors[colorScheme ?? 'light'].secondary : Colors[colorScheme ?? 'light'].error
                                }} />
                                <FontAwesome name="minus" size={24} style={{
                                    color: item.difficulty == 'beginner' ?
                                        Colors[colorScheme ?? 'light'].text : item.difficulty == 'intermediate' || 'default' ?
                                            Colors[colorScheme ?? 'light'].secondary : Colors[colorScheme ?? 'light'].error
                                }} />
                                <FontAwesome name="minus" size={24} style={{
                                    color: item.difficulty == 'beginner' ?
                                        Colors[colorScheme ?? 'light'].text : item.difficulty == 'intermediate' || 'default' ?
                                            Colors[colorScheme ?? 'light'].text : Colors[colorScheme ?? 'light'].error
                                }} />
                            </View>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.text}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Feather name="target" size={24} style={{ color: Colors[colorScheme ?? 'light'].text }} />
                            </View>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.text, { fontSize: 18, fontWeight: '300' }]}>{item.target}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    exerciseContainer: {
        borderColor: Colors.light.secondary + 40,
        backgroundColor: Colors.light.secondary + 20,
        borderWidth: 3,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
        gap: 20
    },
    text: {
        fontSize: 20,
        color: Colors.light.text,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
});

export default ExercisesComponent;