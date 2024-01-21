import React, { memo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Exercise } from '../store/store.models';
import Colors from '../constants/Colors';

const ExerciseItem = memo(({ item, exercisePressed, customDescription }: { item: Exercise, exercisePressed: (id: string) => void, customDescription?: string }) => {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    return (
        <View style={{ backgroundColor: themeColor.background, borderRadius: 20 }}>
            <TouchableOpacity style={[styles.exerciseContainer, {
                borderColor: themeColor.secondary + 40,
                backgroundColor: themeColor.secondary + 20,
            }]} onPress={() => exercisePressed(item._id)}>
                <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}/images/${item.images[0]}` }}
                    style={[styles.image, { backgroundColor: 'white' }]} />
                <View style={styles.exerciseMainDataContainer}>
                    <View style={styles.difficultyContainer}>
                        <FontAwesome name="minus" size={24} style={{
                            color: item.difficulty == 'beginner' ?
                                themeColor.success : (item.difficulty == 'intermediate' || item.difficulty == 'default') ?
                                    themeColor.secondary : themeColor.error,
                            marginTop: -10,
                        }} />
                        <FontAwesome name="minus" size={24} style={{
                            color: item.difficulty == 'beginner' ?
                                themeColor.text : (item.difficulty == 'intermediate' || item.difficulty == 'default') ?
                                    themeColor.secondary : themeColor.error, marginTop: -10,
                        }} />
                        <FontAwesome name="minus" size={24} style={{
                            color: item.difficulty == 'beginner' ?
                                themeColor.text : (item.difficulty == 'intermediate' || item.difficulty == 'default') ?
                                    themeColor.text : themeColor.error, marginTop: -10,
                        }} />
                    </View>
                    <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.textTitle, { color: themeColor.text }]}>{item.name}</Text>
                    {!customDescription && (
                        <View style={styles.targetContainer}>
                            <Feather name="target" size={14} style={{ color: themeColor.text }} />
                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.text, { color: themeColor.text + 90 }]}>{item?.primaryMuscles[0]}</Text>
                        </View>
                    )}
                    {customDescription && (
                        <View style={styles.targetContainer}>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.text, { color: themeColor.text + 90 }]}>{customDescription}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

        </View>
    )
})

const ExercisesComponent = ({ exercises, exercisePressed }: { exercises: Exercise[], exercisePressed: (id: string) => void }) => {

    return (
        <FlatList
            data={exercises}
            keyExtractor={(exercise) => exercise._id}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={20}
            windowSize={3}
            renderItem={({ item }) => {
                return (
                    <View style={{ marginVertical: 10 }}>
                        <ExerciseItem item={item} exercisePressed={exercisePressed} />
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    exerciseContainer: {
        backgroundColor: 'yellow',
        borderWidth: 3,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        // marginVertical: 10,
        gap: 20,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 10
    },
    exerciseMainDataContainer: {
        flex: 1,
        height: 75,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // backgroundColor: 'red'
    },
    difficultyContainer: {
        flexDirection: 'row',
        gap: 5,
        // height: 15
        // backgroundColor: 'yellow'
    },
    targetContainer: {
        marginTop: 5,
        flexDirection: 'row',
        gap: 5
    },
    textTitle: {
        fontSize: 16,
        textTransform: 'capitalize',
        fontWeight: 'bold'
    },
    text: {
        fontSize: 12,
        textTransform: 'capitalize',
        fontWeight: '400'
    }
});

export { ExercisesComponent, ExerciseItem };