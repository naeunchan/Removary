import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { EntryForm } from '../components/EntryForm';
import { EntryList } from '../components/EntryList';
import { EntrySummary } from '../components/EntrySummary';
import { useDiaryEntries } from '../hooks/useDiaryEntries';

export const HomeScreen: React.FC = () => {
  const { entries, draft, isLoading, now, handleChange, handleSubmit, handleDelete } =
    useDiaryEntries();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader />
          <EntryForm draft={draft} onChange={handleChange} onSubmit={handleSubmit} />
          <EntrySummary count={entries.length} />
          <EntryList
            entries={entries}
            currentTime={now}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 24,
  },
});
