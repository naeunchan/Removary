import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDiaryStore } from '@/features/diary/store/useDiaryStore';
import type { DayEmotion, DiaryCategory } from '@/features/diary/types/diaryTypes';
import { DiaryDraft } from '@/features/diary/types/diaryTypes';

const CATEGORY_OPTIONS: { label: string; value: DiaryCategory }[] = [
  { label: '일', value: 'work' },
  { label: '관계', value: 'relationship' },
  { label: '일상', value: 'daily' },
  { label: '공부', value: 'study' },
  { label: '기타', value: 'etc' },
];

const MOOD_OPTIONS: { value: DayEmotion['mood']; emoji: string; label: string }[] = [
  { value: 'very_good', emoji: '😄', label: '최고' },
  { value: 'good', emoji: '🙂', label: '좋음' },
  { value: 'neutral', emoji: '😐', label: '보통' },
  { value: 'bad', emoji: '🙁', label: '별로' },
  { value: 'very_bad', emoji: '😣', label: '나쁨' },
];

type EntryFormProps = {
  draft: DiaryDraft;
  onChange: (field: keyof DiaryDraft, value: string) => void;
  onSubmit: () => void;
};

export const EntryForm: React.FC<EntryFormProps> = ({ draft, onChange, onSubmit }) => {
  const [category, setCategory] = useState<DiaryCategory>('daily');
  const [mood, setMood] = useState<DayEmotion['mood']>('neutral');
  const dateLabel = new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });

  const handleSubmit = () => {
    const trimmedTitle = draft.title.trim();
    const trimmedContent = draft.content.trim();

    if (!trimmedContent) {
      Alert.alert('알림', '내용은 반드시 입력해 주세요.');
      return;
    }

    onSubmit();

    const now = new Date();
    const createdAtIso = now.toISOString();
    const store = useDiaryStore.getState();
    // Mirror the entry into the zustand store so future features (categories, moods) have data,
    // while keeping useDiaryEntries as the UI source-of-truth for now.
    store.addEntry({
      title: trimmedTitle,
      content: trimmedContent,
      category,
      createdAt: createdAtIso,
    });
    const dateStr = createdAtIso.slice(0, 10);
    store.setDayEmotion({ date: dateStr, mood });

    setCategory('daily');
    setMood('neutral');
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>새로운 메모</Text>
        <Text style={styles.dateText}>{dateLabel}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="제목"
        placeholderTextColor="#a1a1aa"
        value={draft.title}
        onChangeText={(text) => onChange('title', text)}
        maxLength={120}
        returnKeyType="done"
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="내용을 입력하세요"
        placeholderTextColor="#a1a1aa"
        value={draft.content}
        onChangeText={(text) => onChange('content', text)}
        multiline
        textAlignVertical="top"
      />
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>카테고리</Text>
        <View style={styles.chipRow}>
          {CATEGORY_OPTIONS.map((option) => {
            const isSelected = option.value === category;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setCategory(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.metaSection}>
        <Text style={styles.metaLabel}>오늘의 기분</Text>
        <View style={styles.moodRow}>
          {MOOD_OPTIONS.map((option) => {
            const isSelected = option.value === mood;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.moodButton, isSelected && styles.moodButtonSelected]}
                onPress={() => setMood(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  dateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textarea: {
    minHeight: 140,
    paddingTop: 16,
  },
  metaSection: {
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  chipText: {
    fontSize: 13,
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#92400e',
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f7',
    marginHorizontal: 4,
  },
  moodButtonSelected: {
    backgroundColor: '#ecfccb',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  moodLabelSelected: {
    color: '#15803d',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#fdd663',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#fcd34d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 2,
  },
  submitText: {
    color: '#1c1c1e',
    fontWeight: '600',
    fontSize: 16,
  },
});
