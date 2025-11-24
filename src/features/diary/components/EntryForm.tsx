import React, { useState } from 'react';
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDiaryStore } from '@/features/diary/store/useDiaryStore';
import type { DayEmotion, DiaryCategory } from '@/features/diary/types/diaryTypes';
import { CATEGORY_OPTIONS, MOOD_OPTIONS } from './EntryForm.constants';
import { styles } from './EntryForm.styles';
import type { EntryFormProps } from './EntryForm.types';

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

    const now = new Date();
    const createdAtIso = now.toISOString();
    const id = now.getTime().toString();
    onSubmit({ id, createdAt: createdAtIso });

    const store = useDiaryStore.getState();
    // Mirror the entry into the zustand store so future features (categories, moods) have data,
    // while keeping useDiaryEntries as the UI source-of-truth for now.
    store.addEntry({
      id,
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
        blurOnSubmit
        onSubmitEditing={Keyboard.dismiss}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="내용을 입력하세요"
        placeholderTextColor="#a1a1aa"
        value={draft.content}
        onChangeText={(text) => onChange('content', text)}
        multiline
        textAlignVertical="top"
        blurOnSubmit
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
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
