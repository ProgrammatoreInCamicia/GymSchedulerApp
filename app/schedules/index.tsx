import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAppSelector } from '../../store/hooks';
import { formatDate } from '../../shared/utils';
import { AntDesign } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
// import Dropdown from '../../components/Dropdown';
import ModalDropdown from '../../components/modalDropdown';

export default function Page() {
  const path = usePathname();
  const colorScheme = useColorScheme();
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const currentSchedule = useAppSelector((state) => state.schedules.currentSchedule);
  const themeColor = Colors[colorScheme ?? 'light'];

  const data = [
    { label: 'abs', value: 'abs' },
    { label: 'cazzo', value: 'cazzo' },
    { label: 'in', value: 'in' },
    { label: 'culo', value: 'culo' },
    { label: 'gucci', value: 'gucci' },
    { label: 'abs', value: 'abs' },
    { label: 'cazzo', value: 'cazzo' },
    { label: 'in', value: 'in' },
    { label: 'culo', value: 'culo' },
    { label: 'gucci', value: 'gucci' },
  ];

  const onSelect = (data: any) => {
    console.log('on select', data);
  }
  return (
    <SafeAreaView style={[CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>
      {/* <Text style={[CommonComponentsStyle.title, { color: themeColor.text, backgroundColor: themeColor.secondary + 40 }]}>Gestione schede</Text> */}
      {/* <View style={CommonComponentsStyle.container}>
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
        </TouchableOpacity>
      </View> */}
      <ModalDropdown
        value={currentSchedule}
        label='Seleziona scheda'
        data={schedules}
        keyField='_id'
        labelField='title'
        onSelect={onSelect}
        onAddElement={() => router.push('/schedules/scheduleEdit')}
      />
      <StatusBar style="light" />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
})