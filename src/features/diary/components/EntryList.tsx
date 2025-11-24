import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { DiaryEntry } from '@/features/diary/types/diaryTypes';
import { EntryCard } from '@/features/diary/components/EntryCard';
import { EMPTY_LABEL, LOADING_LABEL } from './EntryList.constants';
import { styles } from './EntryList.styles';
import type { EntryListProps } from './EntryList.types';

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
        <Text style={styles.helperText}>{LOADING_LABEL}</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.listContainer}>
        <Text style={styles.helperText}>{EMPTY_LABEL}</Text>
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
