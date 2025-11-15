import type { DiaryCategory } from '@/types/diaryModels';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isCompleted: boolean;
  category?: DiaryCategory;
}

export interface DiaryDraft {
  title: string;
  content: string;
}
