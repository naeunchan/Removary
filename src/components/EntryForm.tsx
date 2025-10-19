import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DiaryDraft } from '@/types/diary';

type EntryFormProps = {
  draft: DiaryDraft;
  onChange: (field: keyof DiaryDraft, value: string) => void;
  onSubmit: () => void;
};

export const EntryForm: React.FC<EntryFormProps> = ({ draft, onChange, onSubmit }) => (
  <View style={styles.formCard}>
    <Text style={styles.sectionTitle}>새로운 메모</Text>
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
    <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
      <Text style={styles.submitText}>저장</Text>
    </TouchableOpacity>
  </View>
);

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 18,
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
