import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Routine, RoutineExercise } from "../../../store/store.models";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";
import Colors from "../../../constants/Colors";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import InternalModal from "../../../components/modal";
import { useState } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import SearchBar from "../../../components/searchBar";
import { ExercisesComponent, ExerciseItem } from "../../../components/exercisesComponents";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { searchExercises, searchTermChange } from "../../../store/exercises.reducer";
import { router } from "expo-router";
import ExerciseSettingsInSchedule from "./components/exerciseSettingsInSchedule";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { setExercisesInRoutine } from "../../../store/schedules.reducer";
import { getGroupedSetsConfig } from "../../../shared/utils";

export default function RoutineComponent({ routine }: { routine: Routine }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const [showModal, setShowModal] = useState(false);
    const term = useAppSelector((state) => state.exercises.filter.searchTerm);
    const dispatch = useAppDispatch();

    function onTermChange(term: string) {
        dispatch(searchTermChange(term))
    }

    async function onTermSubmit() {
        await dispatch(searchExercises(term));
    }

    const exercises = useAppSelector((state) => state.exercises.exercises);

    function exercisePressed(id: string) {
        setCurrentExerciseGuid(id);
        setShowExerciseModal(true);
    }

    function changeSelectedExercise(id: string, routineExerciseGuid: string) {
        setCurrentExerciseGuid(id);
        setRoutineExerciseGuid(routineExerciseGuid);
        setShowChangeExerciseModal(true);
    }

    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showChangeExerciseModal, setShowChangeExerciseModal] = useState(false);
    const [routineExerciseGuid, setRoutineExerciseGuid] = useState(null);

    const [currentExerciseGuid, setCurrentExerciseGuid] = useState('');

    const exercisesModalContent = () => {
        return (
            <Animated.View
                style={[
                    styles.addExercisesModalContainer,
                    { backgroundColor: themeColor.background },
                    CommonComponentsStyle.container
                ]}
                entering={FadeIn}
            >
                <View style={[styles.searchExerciseContainer]}>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                        <Ionicons name="chevron-back" size={24} color={themeColor.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <SearchBar term={term} onTermChange={onTermChange} onTermSubmit={onTermSubmit} />
                    </View>
                </View>
                <ExercisesComponent exercises={exercises} exercisePressed={exercisePressed} />
                {showExerciseModal && (
                    <ExerciseSettingsInSchedule
                        exerciseId={currentExerciseGuid}
                        routineId={routine.guid}
                        onSetShowExerciseModal={() => setShowExerciseModal(false)}
                    />
                )}
            </Animated.View>
        )
    }

    return (
        <View style={[{ flex: 1 }]}>
            {/* Start Routine Exercises */}
            {routine.exercises.length == 0 && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 200, height: 200 }} source={require('../../../assets/4.png')} />
                    <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Add some exercises</Text>
                </View>
            )}

            {routine.exercises.length > 0 && (
                <DraggableFlatList
                    data={routine.exercises}
                    onDragEnd={({ data }: { data: RoutineExercise[] }) =>
                        dispatch(setExercisesInRoutine({ routine: routine, routineExercises: data }))
                    }
                    keyExtractor={item => item.guid}
                    renderItem={({ item, drag, isActive }) => (
                        <ScaleDecorator>
                            <TouchableOpacity
                                onLongPress={drag}
                                disabled={isActive}>
                                <View style={[styles.previewContainer, { backgroundColor: themeColor.black + 40 }]}>
                                    <ExerciseItem
                                        item={item.exercise}
                                        exercisePressed={() => {
                                            // setShowModal(true);
                                            setTimeout(() => {
                                                changeSelectedExercise(item.exercise._id, item.guid);
                                                // setSets(routineExercise.sets.toString());
                                                // setreps(routineExercise.reps.toString());
                                                // settime(routineExercise.rest.toString());
                                                // setCurrentExerciseGuid(routineExercise.guid);

                                            });
                                        }}
                                        showDetailIcon={true}
                                        showDetailIconPressed={(id) => router.push({ pathname: '/exercise', params: { id } })}
                                        customDescription={'rest time: ' + item.rest + ' seconds'}
                                    />
                                    <View style={[{ flexDirection: 'row' }]}>
                                        <View style={[styles.setsContainerPreview]}>
                                            <Text style={[{ color: themeColor.text }]}>Sets: </Text>
                                            <Text style={[{ color: themeColor.text, fontWeight: "bold" }]}>
                                                {getGroupedSetsConfig(item.setsConfig).map(s => s.sets).join(' - ')}
                                            </Text>
                                        </View>
                                        <View style={[styles.setsContainerPreview]}>
                                            <Text style={[{ color: themeColor.text }]}>Reps: </Text>
                                            <Text style={[{ color: themeColor.text, fontWeight: "bold" }]}>
                                                {getGroupedSetsConfig(item.setsConfig).map(s => s.reps).join(' - ')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </ScaleDecorator>

                    )}
                />
            )}
            <View style={{ height: 60 }}></View>

            <InternalModal
                showModal={showModal}
                removeModal={() => setShowModal(false)}
                content={exercisesModalContent}
                preventRemove={true}
            />

            {showChangeExerciseModal && (
                <ExerciseSettingsInSchedule
                    exerciseId={currentExerciseGuid}
                    routineId={routine.guid}
                    routineExerciseGuid={routineExerciseGuid}
                    onSetShowExerciseModal={() => setShowChangeExerciseModal(false)}
                />
            )}

            {/* End Routine Exercises */}

            {/* Start Routine control menu */}
            <View style={[
                CommonComponentsStyle.button,
                styles.addButton,
                {
                    backgroundColor: themeColor.success,
                    shadowColor: themeColor.success,
                }
            ]}>
                <TouchableOpacity onPress={() => setShowModal(true)} style={[styles.iconButton]}>
                    <AntDesign name="pluscircle" size={18} color={themeColor.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push({ pathname: '/schedules/scheduleComponents/newRoutinePlayer', params: { routineId: routine.guid } })
                    }}
                    disabled={routine.exercises.length == 0}
                    style={[styles.iconButton, { opacity: routine.exercises.length > 0 ? 1 : .4 }]}>
                    <Entypo name="controller-play" size={24} color={themeColor.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('menu')} style={[styles.iconButton]}>
                    <Entypo name="dots-three-horizontal" size={24} color={themeColor.text} />
                </TouchableOpacity>
            </View>
            {/* End Routine control menu */}
        </View>
    )
};

const styles = StyleSheet.create({
    addButton: {
        flexDirection: 'row',
        gap: 10,
        position: 'absolute',
        bottom: 0,
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        shadowOpacity: 0.2, // Adjust the opacity as needed
        shadowOffset: { width: 0, height: 7 },
        shadowRadius: 5, // Adjust the radius as needed
        elevation: 10,
        alignSelf: 'center'
    },
    iconButton: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    addExercisesModalContainer: {
        width: '100%',
        height: '100%',
        marginTop: 25
    },
    searchExerciseContainer: {
        flexDirection: 'row',
        gap: 30,
        alignItems: 'center',
    },
    previewContainer: {
        borderRadius: 20,
        marginBottom: 10,
    },
    setsContainerPreview: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    }
});
