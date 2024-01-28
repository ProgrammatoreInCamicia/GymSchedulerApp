import { StyleSheet, Text, TouchableOpacity, View, useColorScheme, Animated as Animated2, Image, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimatedPagerView from '../../components/animatedPagerView';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { getExercise } from '../../store/exercises.reducer';
import { MUSCLES_CATEGORIES } from '../../store/store.models';

export default function ExerciseDetailComponent() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const colorScheme = useColorScheme();
    const themeColor = Colors[colorScheme ?? 'light'];

    const dispatch = useAppDispatch();
    const currentExercise = useAppSelector((store) => store.exercises.exerciseDetail)
    const imgContent = (img: string) => {
        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}/images/${img}` }}
                    style={[styles.image]}
                    resizeMode='contain'
                />
            </View>
        )
    }

    const details: string[] = ['instructions', 'muscles', 'equipment'];

    const getImageFromMuscle = (muscle: MUSCLES_CATEGORIES) => {
        let img;// = '';
        console.log('is lower back,', muscle, MUSCLES_CATEGORIES['lower back'], muscle == MUSCLES_CATEGORIES['lower back'])
        switch (muscle) {
            case MUSCLES_CATEGORIES.abdominals:
                img = require('../../assets/muscles/abs.png')
                break;
            case MUSCLES_CATEGORIES.abductors:
                img = require('../../assets/muscles/abductors.png')
                break;
            case MUSCLES_CATEGORIES.adductors:
                img = require('../../assets/muscles/adductors.png')
                break;
            case MUSCLES_CATEGORIES.biceps:
                img = require('../../assets/muscles/biceps.png')
                break;
            case MUSCLES_CATEGORIES.calves:
                img = require('../../assets/muscles/calfs.png')
                break;
            case MUSCLES_CATEGORIES.chest:
                img = require('../../assets/muscles/chest.png')
                break;
            case MUSCLES_CATEGORIES.forearms:
                img = require('../../assets/muscles/forearms.png')
                break;
            case MUSCLES_CATEGORIES.glutes:
                img = require('../../assets/muscles/gluteus.png')
                break;
            case MUSCLES_CATEGORIES.hamstrings:
                img = require('../../assets/muscles/hamstring.png')
                break;
            case MUSCLES_CATEGORIES.lats:
                img = require('../../assets/muscles/latissimus.png')
                break;
            case MUSCLES_CATEGORIES['lower back']:
                img = require('../../assets/muscles/back_lower.png')
                break;
            case MUSCLES_CATEGORIES.neck:
                img = require('../../assets/muscles/neck.png')
                break;
            case MUSCLES_CATEGORIES.quadriceps:
                img = require('../../assets/muscles/quadriceps.png')
                break;
            case MUSCLES_CATEGORIES.shoulders:
                img = require('../../assets/muscles/shoulders.png')
                break;
            case MUSCLES_CATEGORIES.traps:
                img = require('../../assets/muscles/back_upper.png')
                break;
            case MUSCLES_CATEGORIES.triceps:
                img = require('../../assets/muscles/triceps.png')
                break;
            case MUSCLES_CATEGORIES['middle back']:
                img = require('../../assets/muscles/back_upper.png')
                break;

            default:
                break;
        }
        // const source = require("../../assets/muscles/" + img);
        return (
            <Image style={[{ width: 200, height: 200 }]} source={img} />
        )
    }

    const detailContent = (detail: string) => {
        return (
            <View style={{ padding: 10 }}>
                {detail == 'instructions' && (
                    <View style={{ gap: 15 }}>
                        {currentExercise?.instructions?.map((singleRow, index) => {
                            return (
                                <Text key={index} style={{ color: 'white', fontSize: 14 }}>{index + 1}. {singleRow}</Text>
                            )
                        })}
                    </View>
                )}
                {detail == 'muscles' && (
                    <ScrollView>
                        <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>Primary muscles</Text>
                        {currentExercise?.primaryMuscles.map((primaryMuscle, index) => {
                            return (
                                <View style={styles.muscleContainer} key={index}>
                                    <Text style={[{ color: themeColor.text, textTransform: 'uppercase' }]}>{primaryMuscle}</Text>
                                    {getImageFromMuscle(primaryMuscle)}
                                </View>
                            )
                        })}
                        <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>Secondary muscles</Text>
                        {currentExercise?.secondaryMuscles.map((secondaryMuscle, index) => {
                            return (
                                <View style={styles.muscleContainer} key={index}>
                                    <Text style={[{ color: themeColor.text, textTransform: 'uppercase' }]}>{secondaryMuscle}</Text>
                                    {getImageFromMuscle(secondaryMuscle)}
                                </View>
                            )
                        })}
                    </ScrollView>

                )}
                {detail == 'equipment' && (
                    <Text>{currentExercise.equipment} ...in progess...</Text>

                )}

            </View>
        )
    }

    const paginationContent = (scrollOffsetAnimatedValue: Animated.Value, positionAnimatedValue: Animated.Value) => {
        return <View style={{ flexDirection: 'row' }}>
            {details.map((item, index) => {
                const backgroundColor = Animated.add(scrollOffsetAnimatedValue, positionAnimatedValue).interpolate(
                    {
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [themeColor.background, themeColor.success, themeColor.background],
                        extrapolate: 'clamp',
                    },
                );

                return (
                    <Animated.View key={index} style={{ flex: 1, alignItems: 'center', paddingVertical: 5, borderBottomWidth: 3, borderBottomColor: backgroundColor }}>
                        <Text style={[{ color: themeColor.text, textTransform: 'uppercase', fontSize: 16 }]}>{item}</Text>
                    </Animated.View>
                )
            })}
        </View>
    }

    useEffect(() => {
        dispatch(getExercise(id));
    }, [id]);

    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: themeColor.background }]}>
            <View style={{ height: 250 }}>
                <AnimatedPagerView
                    content={imgContent}
                    data={currentExercise?.images}

                ></AnimatedPagerView>

            </View>
            <View style={[styles.exerciseContainer, {}]}>
                <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>
                    {currentExercise?.name}
                </Text>
                <View style={{ flex: 1 }}>
                    <AnimatedPagerView
                        content={detailContent}
                        data={details}
                        paginationContent={paginationContent}
                    ></AnimatedPagerView>
                </View>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    exerciseContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    imageContainer: {
        // borderRadius: 10,
        width: '100%',
        height: 250,
    },
    image: {
        // borderRadius: 10,
        width: '100%',
        flex: 1,
    },
    muscleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})