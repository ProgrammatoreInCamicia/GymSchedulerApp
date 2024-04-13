import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CommonComponentsStyle from '../../constants/CommonComponentsStyle';
import ModalDropdown from '../../components/modalDropdown';
import { addRoutineToSchedule, deleteCurrentSchedule, setCurrentSchedule } from '../../store/schedules.reducer';
import { Routine, Schedule } from '../../store/store.models';
import React, { useState } from 'react';
import Input from '../../components/Input';
import InternalModal from '../../components/modal';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import RoutineComponent from './scheduleComponents/routine';
import AnimatedPagerView from '../../components/animatedPagerView';


export default function Page() {
  const [showScheduleMenuShowModal, setShowScheduleMenuShowModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');

  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const schedules = useAppSelector((state) => state.schedules.schedules);
  const currentSchedule = useAppSelector((state) => state.schedules.currentSchedule);

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
            <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            CommonComponentsStyle.button,
            {
              backgroundColor: themeColor.success
            }
          ]}
            onPress={() => newRoutine()}
          >
            <Text style={[CommonComponentsStyle.buttonText, { color: themeColor.text }]}>Confirm</Text>
          </TouchableOpacity>
          {/* <InternalButton label='Conferma' onPress={() => newRoutine} /> */}

          {/* <InternalButton label='Annulla' cancelButton={true} onPress={() => setShowModal(false)} > */}
        </View>
      </Animated.View>
    );
  }

  const newRoutine = () => {
    dispatch(addRoutineToSchedule({ scheduleId: currentSchedule.guid, routineName: routineTitle }));
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

  const scheduleMenuModalContent = () => {
    return (
      <Animated.View style={[CommonComponentsStyle.modalContentContainer,
      { backgroundColor: themeColor.background }]} entering={FadeInDown}>
        <View style={[{ padding: 10 }]}>
          <Text style={[{ color: themeColor.text, fontSize: 20, textTransform: 'capitalize' }]}>{currentSchedule.title}</Text>
        </View>
        <TouchableOpacity style={[CommonComponentsStyle.modalContentContainerItem]} onPress={() => {
          router.push({ pathname: '/schedules/scheduleEdit', params: { insertMode: false } });
          setShowScheduleMenuShowModal(false);
        }}>
          <Entypo name="edit" size={18} color="white" />
          <Text style={[styles.itemText, { color: themeColor.text }]}>Modify</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={schedules.length === 1}
          style={[
            CommonComponentsStyle.modalContentContainerItem,
            {
              opacity: schedules.length === 1 ? .6 : 1
            }
          ]} onPress={() => {
            dispatch(deleteCurrentSchedule());
            setShowScheduleMenuShowModal(false);
          }}>
          {/* <Entypo name="edit" size={18} color="white" /> */}
          <AntDesign name="delete" size={18} color="white" />
          <Text style={[styles.itemText, { color: themeColor.text }]}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={[CommonComponentsStyle.mainContainer, CommonComponentsStyle.container, { backgroundColor: themeColor.background }]}>
      <View style={[styles.scheduleManager, {}]}>
        <View style={{ flex: 1 }}>
          <ModalDropdown
            value={currentSchedule}
            label='Seleziona scheda'
            data={schedules}
            keyField='guid'
            labelField='title'
            onSelect={onSelect}
            onAddElement={() => router.push({ pathname: '/schedules/scheduleEdit', params: { insertMode: true } })}
          />
        </View>
        <TouchableOpacity onPress={() => setShowScheduleMenuShowModal(true)} style={[styles.scheduleManagerMenuButton, {}]}>
          <Entypo name="dots-three-vertical" size={18} color={themeColor.background} />
        </TouchableOpacity>
        <InternalModal
          showModal={showScheduleMenuShowModal}
          removeModal={() => setShowScheduleMenuShowModal(false)}
          content={scheduleMenuModalContent}
        />
      </View>
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
  scheduleManager: {
    flexDirection: 'row',
    gap: 10
  },
  scheduleManagerMenuButton: {
    marginTop: 15,
    borderRadius: 5,
    padding: 8,
    backgroundColor: '#f0EEEE',
    justifyContent: 'center',
    alignContent: 'center'
  },
  itemText: {
    fontWeight: '500',
    fontSize: 16,
    textTransform: 'capitalize',
    flex: 1
  }
})