import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

export default function Page() {
  let cuore: string = '<3';
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={{ color: 'red' }}>La mia bellezza è bella tanto tanto tanto !!! {cuore} {cuore} {cuore} {cuore} {cuore}</Text> */}
      <Text style={{ color: Colors.light.text }}>Schermata di configurazione schede di allenamento</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
  },
})