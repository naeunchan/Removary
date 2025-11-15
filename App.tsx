/* eslint-disable import/no-duplicates */
import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/HomeScreen';
import { EmotionCalendarScreen } from '@/screens/EmotionCalendarScreen';

const App: React.FC = () => {
  const [route, setRoute] = useState<'home' | 'emotionCalendar'>('home');

  const handleOpenCalendar = useCallback(() => setRoute('emotionCalendar'), []);
  const handleCloseCalendar = useCallback(() => setRoute('home'), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {route === 'home' ? (
          <HomeScreen onOpenEmotionCalendar={handleOpenCalendar} />
        ) : (
          <EmotionCalendarScreen onClose={handleCloseCalendar} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
/* eslint-enable import/no-duplicates */
