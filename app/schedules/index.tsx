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
import PagerView, { PagerViewOnPageScrollEventData } from 'react-native-pager-view';
import RoutineComponent from './scheduleComponents/routine';
import AnimatedPagerView from '../../components/animatedPagerView';

const DOT_SIZE = 40;

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');

  // const [scrollOffsetAnimatedValue, setScrollOffsetAnimatedValue] = useState(undefined);
  // const [positionAnimatedValue, setPositionAnimatedValue] = useState(undefined);

  const scrollOffsetAnimatedValue = React.useRef(new Animated2.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated2.Value(0)).current;
  console.log('scrollOffsetAnimatedValue', scrollOffsetAnimatedValue, positionAnimatedValue)
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
    setShowModal(false);
  }

  const content = (routine: Routine) => {
    return (
      <RoutineComponent routine={routine} />
      // <Text>{routine.name}</Text>
    )
  }

  const renderRoutines = () => {
    return <AnimatedPagerView
      data={currentSchedule.routines}
      content={(item) => content(item)}
      titleField='name'
      addElement={() => setShowModal(true)}
    />
    // return currentSchedule.routines.map((routine, index) => {
    //   return (
    //     <View key={index}>
    //       <RoutineComponent routine={routine} />
    //     </View>
    //   )
    // })
  }



  // const Pagination = ({
  //   scrollOffsetAnimatedValue,
  //   positionAnimatedValue,
  // }: {
  //   scrollOffsetAnimatedValue: Animated2.Value;
  //   positionAnimatedValue: Animated2.Value;
  // }) => {
  //   console.log('inside pagination; ', scrollOffsetAnimatedValue, positionAnimatedValue)
  //   const inputRange = [0, currentSchedule.routines.length];
  //   const translateX = Animated2.add(
  //     scrollOffsetAnimatedValue,
  //     positionAnimatedValue
  //   ).interpolate({
  //     inputRange,
  //     outputRange: [0, currentSchedule.routines.length * DOT_SIZE],
  //   });

  //   return (
  //     <View style={[styles.pagination]}>
  //       <Animated2.View
  //         style={[
  //           styles.paginationIndicator,
  //           {
  //             position: 'absolute',
  //             transform: [{ translateX: translateX }],
  //             backgroundColor: 'red'
  //           },
  //         ]}
  //       />
  //       {currentSchedule.routines.map((item, index) => {
  //         return (
  //           <View key={index} style={styles.paginationDotContainer}>
  //             <View
  //               style={[styles.paginationDot,]}
  //             >
  //               <Text>
  //                 {item.name}

  //               </Text>
  //             </View>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   );
  // };

  // const AnimatedPagerView = Animated2.createAnimatedComponent(PagerView);

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
            {/* <AnimatedPagerView style={styles.pagerView} initialPage={0}
              onPageScroll={Animated2.event<PagerViewOnPageScrollEventData>(
                [
                  {
                    nativeEvent: {
                      offset: scrollOffsetAnimatedValue,
                      position: positionAnimatedValue,
                    },
                  },
                ],
                {
                  listener: ({ nativeEvent: { offset, position } }) => {
                    console.log(`Position: ${position} Offset: ${offset}`);
                  },
                  useNativeDriver: true,
                }
              )}
            // onPageScroll={(e) => {
            //   setScrollOffsetAnimatedValue(e.nativeEvent.offset);
            //   setPositionAnimatedValue(e.nativeEvent.position)
            //   console.log('page scrolling: ');
            // }}
            >
              {renderRoutines()}
            </AnimatedPagerView>
            <Pagination
              scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
              positionAnimatedValue={positionAnimatedValue}
            /> */}

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
    width: '80%',
    height: 200,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
  },
  pagerView: {
    flex: 1
  },

  pagination: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ddd',
  },
})