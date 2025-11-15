import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type {
  DayEmotion,
  DiaryCategory,
  DiaryStoreEntry,
} from '@/features/diary/types/diaryTypes';

type AddEntryPayload = {
  title: string;
  content: string;
  category: DiaryCategory;
  createdAt?: string;
};

type DiaryStore = {
  entries: DiaryStoreEntry[];
  dayEmotions: DayEmotion[];
  addEntry: (payload: AddEntryPayload) => void;
  removeEntry: (id: string) => void;
  toggleEntryCompletion: (id: string) => void;
  clearExpiredEntries: () => number;
  setDayEmotion: (emotion: DayEmotion) => void;
  getExpiredEntries: () => DiaryStoreEntry[];
};

const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = '@removary/useDiaryStore';
let hasHydrated = false;

const generateId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });

const isDiaryCategory = (value: unknown): value is DiaryCategory =>
  value === 'work' ||
  value === 'relationship' ||
  value === 'daily' ||
  value === 'study' ||
  value === 'etc';

const deriveTitle = (title: string, content: string) => {
  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 0) {
    return trimmedTitle;
  }

  const derived = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  return derived ?? '제목 없음';
};

const resolveDate = (input?: string) => {
  if (!input) {
    return new Date();
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const resolveExpiresAt = (expiresAt: string | undefined, createdAt: Date) => {
  if (expiresAt) {
    const parsed = new Date(expiresAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date(createdAt.getTime() + TWENTY_ONE_DAYS_MS);
};

const sanitizeDiaryEntry = (entry: Partial<DiaryStoreEntry>): DiaryStoreEntry => {
  const content = typeof entry.content === 'string' ? entry.content : '';
  const createdAtDate = resolveDate(entry.createdAt);
  const expiresAtDate = resolveExpiresAt(entry.expiresAt, createdAtDate);

  return {
    id: typeof entry.id === 'string' && entry.id.length > 0 ? entry.id : generateId(),
    title: deriveTitle(typeof entry.title === 'string' ? entry.title : '', content),
    content,
    category: isDiaryCategory(entry.category) ? entry.category : 'daily',
    createdAt: createdAtDate.toISOString(),
    expiresAt: expiresAtDate.toISOString(),
    isCompleted: typeof entry.isCompleted === 'boolean' ? entry.isCompleted : false,
  };
};

const sanitizeEntries = (value: unknown): DiaryStoreEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => sanitizeDiaryEntry(item as Partial<DiaryStoreEntry>));
};

const buildDiaryEntry = ({ title, content, category, createdAt }: AddEntryPayload): DiaryStoreEntry => {
  const createdAtDate = resolveDate(createdAt);
  const createdAtIso = createdAtDate.toISOString();
  const expiresAtIso = new Date(createdAtDate.getTime() + TWENTY_ONE_DAYS_MS).toISOString();

  return {
    id: generateId(),
    title: deriveTitle(title, content),
    content,
    category,
    createdAt: createdAtIso,
    expiresAt: expiresAtIso,
    isCompleted: false,
  };
};

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  dayEmotions: [],
  addEntry: (payload) => {
    const entry = buildDiaryEntry(payload);
    set((state) => ({ entries: [entry, ...state.entries] }));
  },
  removeEntry: (id) => {
    set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) }));
  },
  toggleEntryCompletion: (id) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, isCompleted: !entry.isCompleted } : entry
      ),
    }));
  },
  clearExpiredEntries: () => {
    const now = Date.now();
    const { entries } = get();
    const nextEntries: DiaryStoreEntry[] = [];
    let expiredCount = 0;

    entries.forEach((entry) => {
      if (new Date(entry.expiresAt).getTime() < now) {
        expiredCount += 1;
        return;
      }
      nextEntries.push(entry);
    });

    set({ entries: nextEntries });
    return expiredCount;
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
  getExpiredEntries: () => {
    const now = Date.now();
    return get().entries.filter((entry) => new Date(entry.expiresAt).getTime() < now);
  },
}));

const isPersistedState = (
  value: unknown
): value is Pick<DiaryStore, 'entries' | 'dayEmotions'> =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as Record<string, unknown>).entries) &&
  Array.isArray((value as Record<string, unknown>).dayEmotions);

const hydrateStore = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      hasHydrated = true;
      return;
    }

    const parsed: unknown = JSON.parse(raw);
    if (isPersistedState(parsed)) {
      useDiaryStore.setState({
        entries: sanitizeEntries(parsed.entries),
        dayEmotions: parsed.dayEmotions as DayEmotion[],
      });
    }
  } catch (error) {
    console.error('Failed to hydrate diary store', error);
  } finally {
    hasHydrated = true;
  }
};

const persistState = async (state: Pick<DiaryStore, 'entries' | 'dayEmotions'>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to persist diary store', error);
  }
};

void hydrateStore();

useDiaryStore.subscribe(
  (state) => ({ entries: state.entries, dayEmotions: state.dayEmotions }),
  (state) => {
    if (!hasHydrated) {
      return;
    }
    void persistState(state);
  }
);
