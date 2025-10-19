import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DiaryEntry } from '@/types/diary';
import { formatDateYMD } from '@/utils/time';

type EntryCardProps = {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  const createdAt = useMemo(() => new Date(entry.createdAt), [entry.createdAt]);
  const createdAtDate = useMemo(() => formatDateYMD(entry.createdAt), [entry.createdAt]);

  return (
    <View style={styles.entryCard}>
      <Text style={styles.entryTitle}>{entry.title || '제목 없음'}</Text>
      <Text style={styles.entryBody}>{entry.content}</Text>
      <View style={styles.entryFooter}>
        <Text style={styles.createdAt}>
          작성일 {createdAtDate}{' '}
          {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(entry.id)}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  entryTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  entryBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#3c3c43',
    marginBottom: 18,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 13,
    color: '#9ca3af',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffe4e4',
  },
  deleteText: {
    color: '#d9463a',
    fontWeight: '600',
  },
});
