import { StyleSheet, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import SearchBar from '../components/searchBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { fetchExercises, searchExercises, searchTermChange } from '../store/exercises.reducer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ExercisesComponent from '../components/exercisesComponents';
import MainNavigationBar from '../components/mainNavigationBar';

export default function Page() {
  const colorScheme = useColorScheme();

  const exercises = useAppSelector((state) => state.exercises.exercises);
  console.log('inside index: ', exercises.length);

  const counter = useAppSelector((state) => state.counter);
  const term = useAppSelector((state) => state.exercises.filter.searchTerm);
  const dispatch = useAppDispatch();

  function onTermChange(term: string) {
    dispatch(searchTermChange(term))
  }

  async function onTermSubmit() {
    await dispatch(searchExercises(term));
  }

  function exercisePressed() {

  }

  useEffect(() => {
    // dispatch(fetchExercises());
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <SearchBar term={term} onTermChange={onTermChange} onTermSubmit={onTermSubmit} />
      <ExercisesComponent exercises={exercises} exercisePressed={exercisePressed} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 300,
    height: 50
  }
});
