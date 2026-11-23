import { useEffect } from 'react';
import { Text } from 'react-native';
import { scheduleOnUI } from 'react-native-worklets';

export default function App() {
  useEffect(() => {
    scheduleOnUI(() => {
      'worklet';
      console.log('hello from the UI runtime');
    });
  }, []);
  return <Text>Hello</Text>;
}
