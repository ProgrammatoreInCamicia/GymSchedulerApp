import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme, Animated as Animated2 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import ModalDropdown from '../../components/modalDropdown';
import { addRoutineToSchedule, setCurrentSchedule } from '../../store/schedules.reducer';
import { Routine, Schedule } from '../../store/store.models';
import React, { useState } from 'react';
import Input from '../../components/Input';
import InternalModal from '../../components/modal';
import Animated, { FadeIn } from 'react-native-reanimated';
import RoutineComponent from './scheduleComponents/routine';
import AnimatedPagerView from '../../components/animatedPagerView';


export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');

  const colorScheme = useColorScheme();
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const currentSchedule = useAppSelector((state) => state.schedules.currentSchedule);
  const themeColor = Colors[colorScheme ?? 'light'];
  const dispatch = useAppDispatch();


  const onSelect = (data: Schedule) => {
    dispatch(setCurrentSchedule(data))
  }

  const modalContent = () => {
    return (
      <Animated.View style={[styles.modalContent,
      { backgroundColor: themeColor.background }]} entering={FadeIn}>
        <Input
          value={routineTitle}
          placeholder={''}
          onValueChange={setRoutineTitle}
          label="Nome routine"
        />
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
    dispatch(addRoutineToSchedule({ scheduleId: currentSchedule._id, routineName: routineTitle }));
    setRoutineTitle('');
    setShowModal(false);
  }

  const content = (routine: Routine) => {
    return (
      <RoutineComponent routine={routine} />
    )
  }

  const renderRoutines = () => {
    return <AnimatedPagerView
      data={currentSchedule.routines}
      content={(item) => content(item)}
      titleField='name'
      addElement={() => setShowModal(true)}
    />
  }



  return (
    <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>

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

      {
        currentSchedule.title != '' && currentSchedule.routines?.length > 0 && (
          <View style={{ flex: 1, paddingTop: 10 }}>
            {renderRoutines()}
          </View>

        )}

      <InternalModal
        showModal={showModal}
        removeModal={() => setShowModal(false)}
        content={modalContent}
      />

      <StatusBar style="light" />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    gap: 10
  },
  modalContent: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
  },
})