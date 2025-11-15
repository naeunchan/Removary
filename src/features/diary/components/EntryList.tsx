import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { DiaryEntry } from '@/features/diary/types/diaryTypes';
import { EntryCard } from '@/features/diary/components/EntryCard';

type EntryListProps = {
  entries: DiaryEntry[];
  isLoading: boolean;
  onDelete: (id: string, options?: { skipConfirm?: boolean }) => void;
  onToggleComplete: (id: string) => void;
};

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  isLoading,
  onDelete,
  onToggleComplete,
}) => {
  const renderItem = useCallback<ListRenderItem<DiaryEntry>>(
    ({ item }) => (
      <EntryCard entry={item} onDelete={onDelete} onToggleComplete={onToggleComplete} />
    ),
    [onDelete, onToggleComplete]
  );

  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        <Text style={styles.helperText}>불러오는 중...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.listContainer}>
        <Text style={styles.helperText}>아직 작성된 메모가 없어요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList<DiaryEntry>
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 6,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 12,
  },
  separator: {
    height: 12,
  },
  helperText: {
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 36,
    fontSize: 16,
  },
});
