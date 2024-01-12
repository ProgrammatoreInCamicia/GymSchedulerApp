import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Routine } from "../../../store/store.models";
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
import Input from "../../../components/Input";
import InternalButton from "../../../components/button";
import { deleteExerciseInRoutine, saveExerciseInRoutine } from "../../../store/schedules.reducer";
import { router } from "expo-router";

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
        setCurrentExercise(exercises.find(ex => ex._id == id));
        setShowExerciseModal(true);
    }

    const [showExerciseModal, setShowExerciseModal] = useState(false);

    const [currentExercise, setCurrentExercise] = useState(null);
    const [note, setNote] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setreps] = useState('');
    const [currentExerciseGuid, setCurrentExerciseGuid] = useState('');
    const [weight, setweight] = useState('');
    const [time, settime] = useState('');

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
                <InternalModal
                    showModal={showExerciseModal}
                    removeModal={() => setShowExerciseModal(false)}
                    content={exercisesSettingsModalContent}
                    preventRemove={true}
                />
            </Animated.View>
        )
    }

    const exercisesSettingsModalContent = () => {
        return (
            <Animated.View
                style={[
                    styles.addExercisesModalContainer,
                    { backgroundColor: themeColor.background },
                    CommonComponentsStyle.container
                ]}
                entering={FadeIn}
            >
                <View style={[styles.searchExerciseContainer, { marginTop: 15, marginBottom: 10 }]}>
                    <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                        <Ionicons name="chevron-back" size={24} color={themeColor.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={[{ color: themeColor.text }]}>Exercise settings</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                        {currentExerciseGuid && (
                            <TouchableOpacity style={[{
                                backgroundColor: themeColor.error,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 5
                            }]} onPress={() =>
                                deleteExercise()
                            }>
                                <Text style={[{ color: themeColor.text }]}>Elimina</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[{
                            backgroundColor: themeColor.success,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 5
                        }]} onPress={() => saveExercise()}>
                            <Text style={[{ color: themeColor.text }]}>Fatto</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <InternalButton label="Fatto" onPress={() => saveExercise()} /> */}
                </View>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>
                            {currentExercise?.name}
                        </Text>
                        <View style={[styles.setsContainer, { backgroundColor: themeColor.secondary + 20 }]}>
                            <View style={styles.setContainer}>
                                <View style={styles.setPiece}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            inputMode="decimal"
                                            value={sets}
                                            onValueChange={(sets) => {
                                                setSets(sets);
                                            }}
                                        />
                                    </View>
                                    <View style={[styles.setPieceLabel, { borderRightColor: themeColor.accent }]}>
                                        <Text style={[{ color: themeColor.text }]}>Sets</Text>
                                    </View>
                                </View>
                                <View style={styles.setPiece}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            inputMode="decimal"
                                            value={reps}
                                            onValueChange={(reps) => {
                                                setreps(reps);
                                            }}
                                        />
                                    </View>
                                    <View style={[styles.setPieceLabel, { borderRightWidth: 0 }]}>
                                        <Text style={[{ color: themeColor.text }]}>Reps</Text>
                                    </View>
                                </View>
                                <View style={styles.setPiece}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            inputMode="decimal"
                                            value={weight}
                                            onValueChange={(weight) => {
                                                setweight(weight);
                                            }}
                                        />
                                    </View>
                                    <View style={[styles.setPieceLabel, { borderRightWidth: 0 }]}>
                                        <Text style={[{ color: themeColor.text }]}>Kg</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.separator, { borderBottomColor: themeColor.accent }]}></View>
                            <View>
                                <Input
                                    inputMode="decimal"
                                    label="Rest (in seconds)"
                                    value={time}
                                    onValueChange={(rest) => {
                                        settime(rest);;
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={[{ marginTop: 15, color: themeColor.text }]}>Note</Text>
                        <Input
                            multiline={true}
                            height={200}
                            value={note}
                            onValueChange={(note) => {
                                setNote(note);
                            }}
                        />
                    </View>
                </View>
            </Animated.View>
        )
    }

    const saveExercise = () => {
        dispatch(saveExerciseInRoutine({
            routine,
            routineExercise: {
                exercise: currentExercise,
                reps: +reps,
                rest: +time,
                sets: +sets,
                weight: +weight,
                guid: currentExerciseGuid
            }
        }));
        setShowModal(false);
        setShowExerciseModal(false);
        resetExerciseData();
    }

    const deleteExercise = () => {
        dispatch(deleteExerciseInRoutine({ routine, routineExerciseGuid: currentExerciseGuid }));
        setShowModal(false);
        setShowExerciseModal(false);
        resetExerciseData();
    }

    const resetExerciseData = () => {
        setSets('');
        setreps('');
        setweight('');
        setNote('');
        setCurrentExercise(null);
    }

    return (
        <View style={[{ flex: 1 }]}>
            {/* Start Routine Exercises */}
            <ScrollView style={[{ flex: 1 }]}>
                {routine.exercises.length == 0 && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 200, height: 200 }} source={require('../../../assets/4.png')} />
                        <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Add some exercises</Text>
                    </View>
                )}

                {routine.exercises.length > 0 && (
                    routine.exercises.map((routineExercise) => (
                        <View key={routineExercise.guid} style={[styles.previewContainer, { backgroundColor: themeColor.black + 40 }]}>
                            <ExerciseItem
                                item={routineExercise.exercise}
                                key={routineExercise.guid}
                                exercisePressed={() => {
                                    setShowModal(true);
                                    setTimeout(() => {
                                        exercisePressed(routineExercise.exercise._id);
                                        setSets(routineExercise.sets.toString());
                                        setreps(routineExercise.reps.toString());
                                        settime(routineExercise.rest.toString());
                                        setCurrentExerciseGuid(routineExercise.guid);

                                    });
                                }}
                                customDescription={'rest time: ' + routineExercise.rest + ' seconds'}
                            />
                            <View style={[{ flexDirection: 'row' }]}>
                                <View style={[styles.setsContainerPreview]}>
                                    <Text style={[{ color: themeColor.text }]}>Sets: </Text>
                                    <Text style={[{ color: themeColor.text, fontWeight: "bold" }]}>{routineExercise.sets}</Text>
                                </View>
                                <View style={[styles.setsContainerPreview]}>
                                    <Text style={[{ color: themeColor.text }]}>Reps: </Text>
                                    <Text style={[{ color: themeColor.text, fontWeight: "bold" }]}>{routineExercise.reps}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 60 }}></View>

                <InternalModal
                    showModal={showModal}
                    removeModal={() => setShowModal(false)}
                    content={exercisesModalContent}
                    preventRemove={true}
                />

            </ScrollView>
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
                        router.push({ pathname: '/schedules/scheduleComponents/routinePlayer', params: { routineId: routine.guid } })
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
    centeredView: {
        flex: 1,
    },
    modalView: {
        // alignItems: 'center'
    },
    setsContainer: {
        width: '100%',
        borderRadius: 5,
        padding: 10
    },
    setContainer: {
        flexDirection: 'row',
        gap: 10
    },
    setPiece: {
        flex: 1,
        flexDirection: 'row',
        gap: 5
    },
    setPieceLabel: {
        marginTop: 10,
        alignSelf: 'center',
        paddingVertical: 7,
        paddingRight: 5,
        borderRightWidth: 2,
    },
    separator: {
        borderBottomWidth: 1,
        paddingVertical: 5
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
