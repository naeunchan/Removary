import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DiaryEntry } from '../hooks/useDiaryEntries';
import { formatRemainingTime } from '../utils/time';

type EntryCardProps = {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
  currentTime: number;
  expiresAt: number | null;
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete, currentTime, expiresAt }) => {
  const createdAt = useMemo(() => new Date(entry.createdAt), [entry.createdAt]);
  const remaining = useMemo(
    () => (expiresAt ? formatRemainingTime(expiresAt, currentTime) : '계산 중...'),
    [expiresAt, currentTime]
  );

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{entry.title || '제목 없음'}</Text>
        <Text style={styles.remaining}>{remaining}</Text>
      </View>
      <Text style={styles.entryBody}>{entry.content}</Text>
      <View style={styles.entryFooter}>
        <Text style={styles.createdAt}>
          작성일 {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}
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
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  remaining: {
    marginLeft: 12,
    fontSize: 13,
    color: '#38bdf8',
  },
  entryBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#e2e8f0',
    marginBottom: 16,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 13,
    color: '#94a3b8',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
  },
  deleteText: {
    color: '#f87171',
    fontWeight: '600',
  },
});
