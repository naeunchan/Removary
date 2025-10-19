import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/HomeScreen';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
