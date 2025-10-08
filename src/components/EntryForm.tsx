import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DiaryDraft } from '../hooks/useDiaryEntries';

type EntryFormProps = {
  draft: DiaryDraft;
  onChange: (field: keyof DiaryDraft, value: string) => void;
  onSubmit: () => void;
};

export const EntryForm: React.FC<EntryFormProps> = ({ draft, onChange, onSubmit }) => (
  <View style={styles.formCard}>
    <Text style={styles.sectionTitle}>새 다이어리 작성</Text>
    <TextInput
      style={styles.input}
      placeholder="제목 (선택)"
      placeholderTextColor="#94a3b8"
      value={draft.title}
      onChangeText={(text) => onChange('title', text)}
      maxLength={120}
      returnKeyType="done"
    />
    <TextInput
      style={[styles.input, styles.textarea]}
      placeholder="오늘은 어떤 하루였나요?"
      placeholderTextColor="#94a3b8"
      value={draft.content}
      onChangeText={(text) => onChange('content', text)}
      multiline
      textAlignVertical="top"
    />
    <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
      <Text style={styles.submitText}>저장하기</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f8fafc',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  textarea: {
    minHeight: 140,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
