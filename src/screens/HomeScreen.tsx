import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { EntryForm } from '@/components/EntryForm';
import { EntryList } from '@/components/EntryList';
import { EntrySummary } from '@/components/EntrySummary';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';

export const HomeScreen: React.FC = () => {
  const {
    entries,
    draft,
    isLoading,
    lastVisitedAt,
    daysSinceLastVisit,
    handleChange,
    handleSubmit,
    handleDelete,
    handleToggleComplete,
  } = useDiaryEntries();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader lastVisitedAt={lastVisitedAt} daysSinceLastVisit={daysSinceLastVisit} />
          <EntryForm draft={draft} onChange={handleChange} onSubmit={handleSubmit} />
          <EntrySummary count={entries.length} />
          <EntryList
            entries={entries}
            isLoading={isLoading}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 28,
  },
});
