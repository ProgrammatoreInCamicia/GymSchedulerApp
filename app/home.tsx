import { Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonComponentsStyle from '../constants/CommonComponentsStyle';
import Colors from '../constants/Colors';
import Input from '../components/Input';
import { useState } from 'react';

export default function Page() {
  const colorScheme = useColorScheme();
  const themeColor = Colors[colorScheme ?? 'light'];
  const data = [
    { title: 'first' },
    { title: 'second' },
    { title: 'third' },
    { title: 'third' },
    { title: 'third' },
  ];

  const content = (item: any) => {
    return <Text>{item.title}</Text>
  }

  const [exerciseSettings, setExerciseSettings] = useState<{
    weight: number;
    reps: number
  }[][]>([[{ reps: 10, weight: 20 }], [{ reps: 12, weight: 18 }], [{ reps: 15, weight: 15 }]]);

  const setExerciseValue = (value: string, index: number) => {
    setExerciseSettings(exerciseSettings => {
      const updatedArray = [...exerciseSettings];
      updatedArray[index][0].weight = +value;
      return [
        ...updatedArray
      ]
    })
  }
  return (
    <SafeAreaView style={[
      CommonComponentsStyle.mainContainer,
      CommonComponentsStyle.container,
      { backgroundColor: themeColor.background }
    ]}>
      <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>Prove varie</Text>
      <Text style={[CommonComponentsStyle.title, { color: themeColor.text }]}>Test array di input</Text>
      <View style={{ flex: 1 }}>
        {exerciseSettings.map((exercise, index) => {
          return (
            <Input
              key={index}
              inputMode="decimal"
              value={exerciseSettings[index][0]?.weight + ''}
              onValueChange={(value) => setExerciseValue(value, index)}
              backgroundColor={themeColor.background}
              inputStyle={{ fontSize: 14, color: themeColor.text, fontWeight: '500' }} />
          )
        })}
      </View>
    </SafeAreaView>
  )
}