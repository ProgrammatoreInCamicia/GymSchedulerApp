import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAppSelector } from '../../store/hooks';
import { formatDate } from '../../shared/utils';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Page() {
  const colorScheme = useColorScheme();
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const themeColor = Colors[colorScheme ?? 'light'];
  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: themeColor.background }]}>
      <Text style={[styles.title, { color: themeColor.text, backgroundColor: themeColor.secondary + 40 }]}>Gestione schede</Text>
      <View style={styles.container}>
        <FlatList
          data={schedules}
          keyExtractor={(schedule) => schedule._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={[styles.scheduleContainer, {
                borderColor: themeColor.secondary + 40,
                backgroundColor: themeColor.secondary + 20,
              }]}
                onPress={() =>
                  console.log('DetailSchedule', item._id)}
              >
                <Text style={[styles.subtitle, { color: themeColor.text }]}>{item.title}</Text>
                <Text style={[styles.subtitle, { color: themeColor.text }]}>{formatDate(item.startDate)}</Text>
                <Text style={[styles.subtitle, { color: themeColor.text }]}>{formatDate(item.endDate)}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity style={[styles.addScheduleContainer, {
          borderColor: themeColor.secondary + 40,
          backgroundColor: themeColor.secondary + 20,
          marginBottom: 120
        }]}
          onPress={() => router.push('/schedules/scheduleEdit')}
        >
          <AntDesign name="plus" size={40} color="white" />
          {/* <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Aggiungi scheda</Text> */}
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    flex: 1
  },
  title: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    padding: 10
  },
  scheduleContainer: {
    borderWidth: 3,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginVertical: 10,
    gap: 20
  },
  addScheduleContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addScheduleIcon: {

  },
  subtitle: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
})