import { Button, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from '../store/counter.reducer';
import Colors from '../constants/Colors';
import { State } from '../store/store.models';
import SearchBar from '../components/searchBar';

export default function Page() {
  const colorScheme = useColorScheme();

  const counter = useSelector((state: State) => state.counter);
  const dispatch = useDispatch();
  let term = '';
  function onTermChange() {

  }

  function onTermSubmit() {

  }
  return (
    <View style={styles.container}>
      <SearchBar term={term} onTermChange={onTermChange} onTermSubmit={onTermSubmit} />
      <Text style={styles.text}>
        Counter: {counter}
      </Text>
      <View style={styles.button}>
        <Button
          title='Increment'
          onPress={() => dispatch(increment())}
        />
        <Button
          title='Decrement'
          onPress={() => dispatch(decrement())}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    paddingTop: 300
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
