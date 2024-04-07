import { useEffect, useState } from "react";
import InternalModal from "../../../../components/modal";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import Colors from "../../../../constants/Colors";
import CommonComponentsStyle from "../../../../constants/CommonComponentsStyle";
import Animated, { FadeIn } from "react-native-reanimated";
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { deleteExerciseInRoutine, guidGenerator, saveExerciseInRoutine } from "../../../../store/schedules.reducer";
import Input from "../../../../components/Input";
import { SetConfig } from "../../../../store/store.models";
import { getGroupedSetsConfig } from "../../../../shared/utils";

export default function ExerciseSettingsInSchedule({ exerciseId, routineId, onSetShowExerciseModal, routineExerciseGuid = null }: { exerciseId: string, routineId: string, onSetShowExerciseModal: () => any, routineExerciseGuid?: string }) {
    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];
    const dispatch = useAppDispatch();

    const exercise = useAppSelector(state => state.exercises.exercises.find(ex => ex._id == exerciseId))
    const routine = useAppSelector(state => state.schedules.currentSchedule.routines.find(r => r.guid == routineId));

    const deleteExercise = () => {
        dispatch(deleteExerciseInRoutine({ routine, routineExerciseGuid: routineExerciseGuid }));
        onSetShowExerciseModal();
        resetExerciseData();
    }

    const [note, setNote] = useState('');
    const [time, settime] = useState('');

    const [setsConfig, setSetsConfig] = useState([
        {
            guid: guidGenerator(),
            sets: '',
            reps: '',
            weight: ''
        }
    ]);

    const handleSetsChange = (index: number, newSets: string) => {
        setSetsConfig((prevSetsConfig) => {
            const updatedSetsConfig = [...prevSetsConfig];
            updatedSetsConfig[index] = { ...updatedSetsConfig[index], sets: newSets };
            return updatedSetsConfig;
        });
    };

    const handleRepsChange = (index: number, newReps: string) => {
        setSetsConfig((prevSetsConfig) => {
            const updatedSetsConfig = [...prevSetsConfig];
            updatedSetsConfig[index] = { ...updatedSetsConfig[index], reps: newReps };
            return updatedSetsConfig;
        });
    };

    const handleWeightChange = (index: number, newWeight: string) => {
        setSetsConfig((prevSetsConfig) => {
            const updatedSetsConfig = [...prevSetsConfig];
            updatedSetsConfig[index] = { ...updatedSetsConfig[index], weight: newWeight };
            return updatedSetsConfig;
        });
    };

    const resetExerciseData = () => {
        setSetsConfig([
            {
                guid: guidGenerator(),
                sets: '',
                reps: '',
                weight: ''
            }
        ]);
        setNote('');
    }

    const saveExercise = () => {
        console.log(setsConfig);
        dispatch(saveExerciseInRoutine({
            routine,
            routineExercise: {
                exercise: exercise,
                setsConfig: setsConfig.map(s => {
                    let setConfigArray: SetConfig[] = [];
                    for (let index = 0; index < +s.sets; index++) {
                        let setConfig: SetConfig = {
                            reps: +s.reps,
                            weight: +s.weight,
                            guid: s.guid,
                            historicalData: []
                        };
                        setConfigArray.push(setConfig);
                    }

                    return setConfigArray;
                }).flat(),
                rest: +time,
                guid: routineExerciseGuid
            }
        }));
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
                    <TouchableOpacity onPress={() => onSetShowExerciseModal()}>
                        <Ionicons name="chevron-back" size={24} color={themeColor.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={[{ color: themeColor.text }]}>Exercise settings</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                        {routineExerciseGuid && (
                            <TouchableOpacity style={[{
                                backgroundColor: themeColor.error,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 5
                            }]} onPress={() =>
                                deleteExercise()
                            }>
                                <Text style={[{ color: themeColor.text }]}>Delete</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[{
                            backgroundColor: themeColor.success,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 5
                        }]} onPress={() => saveExercise()}>
                            <Text style={[{ color: themeColor.text }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.centeredView]}>
                    <ScrollView style={[{}]}>
                        <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>
                            {exercise?.name}
                        </Text>
                        <View style={[styles.setsContainer, { backgroundColor: themeColor.secondary + 20 }]}>
                            {setsConfig.map((setConfig, index) => {
                                return (
                                    <View key={index}>
                                        <View style={[styles.setContainer, {}]}>
                                            <View style={styles.setPiece}>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        inputMode="decimal"
                                                        value={setConfig.sets}
                                                        onValueChange={(sets) => handleSetsChange(index, sets)}
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
                                                        value={setConfig.reps}
                                                        onValueChange={(reps) => handleRepsChange(index, reps)}
                                                    />
                                                </View>
                                                <View style={[styles.setPieceLabel, { borderRightColor: themeColor.accent }]}>
                                                    <Text style={[{ color: themeColor.text }]}>Reps</Text>
                                                </View>
                                            </View>
                                            <View style={styles.setPiece}>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        inputMode="decimal"
                                                        value={setConfig.weight}
                                                        onValueChange={(weight) => handleWeightChange(index, weight)}
                                                    />
                                                </View>
                                                <View style={[styles.setPieceLabel, { borderRightWidth: 0 }]}>
                                                    <Text style={[{ color: themeColor.text }]}>Kg</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.separatorContainer]}>
                                            <View style={[styles.separator, {
                                                backgroundColor: themeColor.accent,
                                                marginTop: index > 0 ? 12 : 0
                                            }]}></View>
                                            {index > 0 && (
                                                <TouchableOpacity
                                                    style={[styles.deleteSet, { backgroundColor: themeColor.accent }]}
                                                    onPress={() => setSetsConfig(setsConfig.filter((_, i) => i !== index))}
                                                >
                                                    <FontAwesome5 name="trash" size={14} color={themeColor.error} />
                                                </TouchableOpacity>
                                            )}
                                            <View style={[styles.separator, {
                                                backgroundColor: themeColor.accent,
                                                marginTop: index > 0 ? 12 : 0
                                            }]}></View>
                                        </View>
                                    </View>
                                )
                            })}

                            <TouchableOpacity onPress={() => setSetsConfig(items => [...items, {
                                reps: '',
                                sets: '',
                                weight: '',
                                guid: guidGenerator(),
                            }])}>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                    justifyContent: 'center',
                                    margin: 'auto',
                                    backgroundColor: themeColor.background,
                                    padding: 10,
                                    borderRadius: 10
                                }}>
                                    <AntDesign name="pluscircle" size={18} color={themeColor.text} />
                                    <Text style={{
                                        color: themeColor.text,
                                        fontWeight: "bold",
                                        alignSelf: 'center'
                                    }}>Add different set</Text>
                                </View>
                            </TouchableOpacity>
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
                    </ScrollView>
                </View>
            </Animated.View>
        )
    }

    useEffect(() => {
        if (routineExerciseGuid) {
            const currentRoutineExercise = routine.exercises.find(ex => ex.guid === routineExerciseGuid);
            console.log(currentRoutineExercise);
            settime(currentRoutineExercise.rest + '');
            const groupedData = getGroupedSetsConfig(currentRoutineExercise.setsConfig)
            console.log(groupedData);
            groupedData.forEach(gd => gd.sets = gd.sets.toString());
            setSetsConfig(groupedData);
            // setSetsConfig(currentRoutineExercise.setsConfig.map((setConfig) => {
            //     return {
            //         guid: setConfig.guid,
            //         reps: setConfig.reps.toString(),
            //         sets: setConfig.sets.toString(),
            //         weight: setConfig.weight.toString()
            //     }
            // }));
        }
    }, [routineExerciseGuid])

    return (
        <InternalModal
            showModal={true}
            removeModal={() => onSetShowExerciseModal()}
            content={exercisesSettingsModalContent}
            preventRemove={true}
        />
    )
};

const styles = StyleSheet.create({
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
        marginBottom: 50
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
        marginBottom: 5,
        alignSelf: 'center',
        paddingVertical: 7,
        paddingRight: 5,
        borderRightWidth: 2,
    },
    separatorContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    separator: {
        flex: 1,
        height: 1
    },
    deleteSet: {
        width: 25,
        height: 25,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});