import type { DiaryDraft, DiaryCategory, DayEmotion } from '@/features/diary/types/diaryTypes';

export type EntryFormProps = {
  draft: DiaryDraft;
  onChange: (field: keyof DiaryDraft, value: string) => void;
  onSubmit: (options?: { id?: string; createdAt?: string }) => void;
};

export type CategoryOption = {
  label: string;
  value: DiaryCategory;
};

export type MoodOption = {
  value: DayEmotion['mood'];
  emoji: string;
  label: string;
};
