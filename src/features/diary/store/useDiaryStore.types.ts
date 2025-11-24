import type { DayEmotion, DiaryCategory, DiaryStoreEntry } from '@/features/diary/types/diaryTypes';

export type AddEntryPayload = {
  id?: string;
  title: string;
  content: string;
  category: DiaryCategory;
  createdAt?: string;
};

export type DiaryStoreState = {
  entries: DiaryStoreEntry[];
  dayEmotions: DayEmotion[];
  addEntry: (payload: AddEntryPayload) => void;
  removeEntry: (id: string) => void;
  toggleEntryCompletion: (id: string) => void;
  clearExpiredEntries: () => number;
  setDayEmotion: (emotion: DayEmotion) => void;
  getExpiredEntries: () => DiaryStoreEntry[];
};

export type PersistedState = Pick<DiaryStoreState, 'entries' | 'dayEmotions'>;
