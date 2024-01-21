import { StyleSheet, Text, TouchableOpacity, View, useColorScheme, Animated as Animated2, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AnimatedPagerView from '../../components/animatedPagerView';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { getExercise } from '../../store/exercises.reducer';

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
                {detail !== 'instructions' && (
                    <Text>{detail}</Text>

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
    }
})