import { StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import SearchBar from '../components/searchBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { searchExercises, searchTermChange } from '../store/exercises.reducer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ExercisesComponent } from '../components/exercisesComponents';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../constants/CommonComponentsStyle';
import { router } from 'expo-router';
import { deleteSchedule } from '../store/schedules.reducer';

export default function Page() {
  const colorScheme = useColorScheme();

  const exercises = useAppSelector((state) => state.exercises.exercises);

  const counter = useAppSelector((state) => state.counter);
  const term = useAppSelector((state) => state.exercises.filter.searchTerm);
  const dispatch = useAppDispatch();

  function onTermChange(term: string) {
    dispatch(searchTermChange(term))
  }

  async function onTermSubmit() {
    await dispatch(searchExercises(term));
  }

  function exercisePressed(id: string) {
    router.push({ pathname: '/exercise', params: { id } });
  }

  useEffect(() => {
    // dispatch(fetchExercises());
    // dispatch(deleteSchedule());
  }, []);

  return (
    <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>

      <SearchBar term={term} onTermChange={onTermChange} onTermSubmit={onTermSubmit} />
      <ExercisesComponent exercises={exercises} exercisePressed={exercisePressed} />
      <StatusBar style="light" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
});
