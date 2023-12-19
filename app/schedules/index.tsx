import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { formatDate } from '../../shared/utils';
import { AntDesign } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import ModalDropdown from '../../components/modalDropdown';
import { addRoutineToSchedule, setCurrentSchedule } from '../../store/schedules.reducer';
import { Schedule } from '../../store/store.models';
import { useState } from 'react';
import Input from '../../components/Input';
import InternalModal from '../../components/modal';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import InternalButton from '../../components/button';

export default function Page() {
  const path = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');

  const colorScheme = useColorScheme();
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const currentSchedule = useAppSelector((state) => state.schedules.currentSchedule);
  const themeColor = Colors[colorScheme ?? 'light'];
  const dispatch = useAppDispatch();

  // console.log('currentSchedule', currentSchedule);

  const onSelect = (data: Schedule) => {
    dispatch(setCurrentSchedule(data))
  }

  const modalContent = () => {
    return (
      // <View style={styles.modalContent}>
      <Animated.View style={[styles.modalContent,
      { backgroundColor: themeColor.background }]} entering={FadeIn}>
        <Input
          value={routineTitle}
          placeholder={''}
          onValueChange={setRoutineTitle}
          // onValueSubmit={() => {

          // }}
          label="Nome routine"
        />
        {/* <TouchableOpacity onPress={() => console.log('touched')}>
          <Text>touch me please</Text>
        </TouchableOpacity> */}
        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
          <TouchableOpacity style={[
            CommonComponentsStyle.button,
            {
              backgroundColor: themeColor.grey
            }
          ]}
            onPress={() => setShowModal(false)}
          >
            <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Annulla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            CommonComponentsStyle.button,
            {
              backgroundColor: themeColor.success
            }
          ]}
            onPress={() => newRoutine()}
          >
            <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Conferma</Text>
          </TouchableOpacity>
          {/* <InternalButton label='Conferma' onPress={() => newRoutine} /> */}

          {/* <InternalButton label='Annulla' cancelButton={true} onPress={() => setShowModal(false)} > */}
        </View>
      </Animated.View>
    );
  }
  const newRoutine = () => {
    console.log('gen routine in comp: ', currentSchedule._id, routineTitle)
    dispatch(addRoutineToSchedule({ scheduleId: currentSchedule._id, routineName: routineTitle }));
    setShowModal(false);
  }
  return (
    <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>
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
      {currentSchedule.title != '' && currentSchedule.routines?.length == 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 200, height: 200 }} source={require('../../assets/5.png')} />
          <TouchableOpacity style={[
            CommonComponentsStyle.button,
            styles.addButton,
            {
              backgroundColor: themeColor.success,
            }
          ]}
            onPress={() => setShowModal(true)}
          >
            <AntDesign name="pluscircle" size={18} color="white" />
            <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Add your first routine</Text>
          </TouchableOpacity>
        </View>
      )}

      <InternalModal
        showModal={showModal}
        removeModal={() => setShowModal(false)}
        content={modalContent}
      />

      {/* <Modal animationType="none" transparent={true} visible={showModal}>
        
      </Modal> */}
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
  addButton: {
    flexDirection: 'row',
    gap: 10
  },
  subtitle: {
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  modalContent: {
    // position: 'absolute',
    width: '80%',
    // bottom: '50%',
    height: 200,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
  }
})