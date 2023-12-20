import { Text, View, useColorScheme } from 'react-native';
import AnimatedPagerView from '../components/animatedPagerView';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonComponentsStyle from '../constants/CommonComponentsStyle';
import Colors from '../constants/Colors';

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
  return (
    <SafeAreaView style={[
      CommonComponentsStyle.mainContainer,
      CommonComponentsStyle.container,
      { backgroundColor: themeColor.background }
    ]}>
      <AnimatedPagerView data={data} content={(item) => content(item)} titleField='title' />
    </SafeAreaView>
  )
  // <View>
  //   {/* <AnimatedPagerView /> */}
  // </View>
}