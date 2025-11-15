import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { EntryForm } from '@/components/EntryForm';
import { EntryList } from '@/components/EntryList';
import { EntrySummary } from '@/components/EntrySummary';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { useDiaryStore } from '@/store/diaryStore';
import type { DiaryCategory } from '@/types/diaryModels';
import type { DiaryEntry as LegacyDiaryEntry } from '@/types/diary';

export const HomeScreen: React.FC = () => {
  const {
    entries: legacyEntries,
    draft,
    isLoading,
    lastVisitedAt,
    daysSinceLastVisit,
    handleChange,
    handleSubmit,
    handleDelete,
    handleToggleComplete,
  } = useDiaryEntries();
  const storeEntries = useDiaryStore((state) => state.entries);
  const [selectedCategory] = useState<DiaryCategory | 'all'>('all');

  const filteredStoreEntries = useMemo(() => {
    if (selectedCategory === 'all') {
      return storeEntries;
    }
    return storeEntries.filter((entry) => entry.category === selectedCategory);
  }, [storeEntries, selectedCategory]);

  const legacyEntryMap = useMemo(() => {
    return new Map(legacyEntries.map((entry) => [entry.id, entry]));
  }, [legacyEntries]);

  const resolvedEntries = useMemo<LegacyDiaryEntry[]>(() => {
    if (!filteredStoreEntries.length) {
      return legacyEntries;
    }

    return filteredStoreEntries.map<LegacyDiaryEntry>((entry) => {
      const legacyEntry = legacyEntryMap.get(entry.id);
      const derivedTitle =
        legacyEntry?.title ??
        entry.content
          .trim()
          .split('\n')
          .find((line) => line.trim().length > 0) ??
        '제목 없음';

      return {
        id: entry.id,
        title: derivedTitle,
        content: legacyEntry?.content ?? entry.content,
        createdAt: legacyEntry?.createdAt ?? entry.createdAt,
        isCompleted: legacyEntry?.isCompleted ?? false,
      };
    });
  }, [filteredStoreEntries, legacyEntries, legacyEntryMap]);

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
          <EntrySummary count={resolvedEntries.length} />
          <EntryList
            entries={resolvedEntries}
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
