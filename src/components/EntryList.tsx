import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { DiaryEntry } from '../hooks/useDiaryEntries';
import { EntryCard } from './EntryCard';

type EntryListProps = {
  entries: DiaryEntry[];
  currentTime: number;
  isLoading: boolean;
  onDelete: (id: string) => void;
};

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  currentTime,
  isLoading,
  onDelete,
}) => {
  const renderItem = useCallback<ListRenderItem<DiaryEntry>>(
    ({ item }) => <EntryCard entry={item} onDelete={onDelete} currentTime={currentTime} />,
    [onDelete, currentTime]
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
        <Text style={styles.helperText}>아직 작성된 다이어리가 없어요.</Text>
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
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  list: {
    paddingBottom: 12,
  },
  helperText: {
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 15,
  },
});
