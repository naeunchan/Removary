import { create } from 'zustand';

import type { DayEmotion, DiaryEntry } from '@/types/diaryModels';

type AddEntryPayload = {
  content: string;
  category: DiaryEntry['category'];
  createdAt?: string;
};

type DiaryStore = {
  entries: DiaryEntry[];
  dayEmotions: DayEmotion[];
  addEntry: (payload: AddEntryPayload) => void;
  removeEntry: (id: string) => void;
  setDayEmotion: (emotion: DayEmotion) => void;
};

const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

const createEntryId = () =>
  `entry_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const resolveDate = (input?: string) => {
  if (!input) {
    return new Date();
  }
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const useDiaryStore = create<DiaryStore>((set) => ({
  entries: [],
  dayEmotions: [],
  addEntry: ({ content, category, createdAt }) => {
    set((state) => {
      const createdAtDate = resolveDate(createdAt);
      const createdAtIso = createdAtDate.toISOString();
      const expiresAtIso = new Date(createdAtDate.getTime() + TWENTY_ONE_DAYS_MS).toISOString();

      const entry: DiaryEntry = {
        id: createEntryId(),
        content,
        category,
        createdAt: createdAtIso,
        expiresAt: expiresAtIso,
      };

      return { entries: [entry, ...state.entries] };
    });
  },
  removeEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    }));
  },
  setDayEmotion: (emotion) => {
    set((state) => {
      const index = state.dayEmotions.findIndex((item) => item.date === emotion.date);
      if (index === -1) {
        return { dayEmotions: [...state.dayEmotions, emotion] };
      }

      const updated = state.dayEmotions.slice();
      updated[index] = emotion;
      return { dayEmotions: updated };
    });
  },
}));
