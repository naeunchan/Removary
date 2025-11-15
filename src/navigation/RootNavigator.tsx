import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/HomeScreen';
import { EmotionCalendarScreen } from '@/screens/EmotionCalendarScreen';

export const RootNavigator: React.FC = () => {
  const [route, setRoute] = useState<'home' | 'emotionCalendar'>('home');

  const handleOpenCalendar = useCallback(() => setRoute('emotionCalendar'), []);
  const handleCloseCalendar = useCallback(() => setRoute('home'), []);

  return (
    <SafeAreaProvider>
      {route === 'home' ? (
        <HomeScreen onOpenEmotionCalendar={handleOpenCalendar} />
      ) : (
        <EmotionCalendarScreen onClose={handleCloseCalendar} />
      )}
    </SafeAreaProvider>
  );
};
