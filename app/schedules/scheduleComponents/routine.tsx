import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Routine, RoutineExercise } from "../../../store/store.models";
import CommonComponentsStyle from "../../../constants/CommonComponentsStyle";
import Colors from "../../../constants/Colors";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import InternalModal from "../../../components/modal";
import { useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
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

    const [showRoutineMenuShowModal, setShowRoutineMenuShowModal] = useState(false);

    const deleteCurrentRoutine = () => {
        // dispatch(deleteCurrentRoutine())
    };

    const routineMenuModalContent = () => {
        return (
            <Animated.View style={[CommonComponentsStyle.modalContentContainer,
            { backgroundColor: themeColor.background }]} entering={FadeInDown}>
                <View style={[{ padding: 10 }]}>
                    <Text style={[{ color: themeColor.text, fontSize: 20, textTransform: 'capitalize' }]}>{routine.name}</Text>
                </View>
                {/* <TouchableOpacity style={[CommonComponentsStyle.modalContentContainerItem]} onPress={() => {
            //   router.push({ pathname: '/schedules/scheduleEdit', params: { insertMode: false } });
              setShowRoutineMenuShowModal(false);
            }}>
              <Entypo name="edit" size={18} color="white" />
              <Text style={[styles.itemText, { color: themeColor.text }]}>Modify</Text>
            </TouchableOpacity> */}
                <TouchableOpacity
                    style={[
                        CommonComponentsStyle.modalContentContainerItem, {}]}
                    onPress={() => {
                        deleteCurrentRoutine();
                        setShowRoutineMenuShowModal(false);
                    }}>
                    {/* <Entypo name="edit" size={18} color="white" /> */}
                    <AntDesign name="delete" size={18} color="white" />
                    <Text style={[styles.itemText, { color: themeColor.text }]}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
        );
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

            {/* <View style={{ flex: 1 }}> */}

            {routine.exercises.length > 0 && (
                <DraggableFlatList
                    data={routine.exercises}
                    onDragEnd={({ data }: { data: RoutineExercise[] }) =>
                        dispatch(setExercisesInRoutine({ routine: routine, routineExercises: data }))
                    }
                    keyExtractor={item => item.guid}
                    renderItem={({ item, drag, isActive, getIndex }) => (
                        <ScaleDecorator>
                            <TouchableOpacity
                                onLongPress={drag}
                                disabled={isActive}>
                                <View style={[styles.previewContainer, {
                                    backgroundColor: themeColor.black + 40,
                                    marginBottom: getIndex() == routine.exercises.length - 1 ? 80 : 10
                                }]}>
                                    <ExerciseItem
                                        item={item.exercise}
                                        exercisePressed={() => {
                                            // setShowModal(true);
                                            setTimeout(() => {
                                                // console.log(item.exercise)
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
            {/* </View> */}

            <View style={{ height: 80, width: 200, backgroundColor: 'red' }}></View>

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
                <TouchableOpacity onPress={() => setShowRoutineMenuShowModal(true)} style={[styles.iconButton]}>
                    <Entypo name="dots-three-horizontal" size={24} color={themeColor.text} />
                </TouchableOpacity>
            </View>
            {/* End Routine control menu */}

            <InternalModal
                showModal={showRoutineMenuShowModal}
                removeModal={() => setShowRoutineMenuShowModal(false)}
                content={routineMenuModalContent}
            />
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
    },
    itemText: {
        fontWeight: '500',
        fontSize: 16,
        textTransform: 'capitalize',
        flex: 1
    }
});
