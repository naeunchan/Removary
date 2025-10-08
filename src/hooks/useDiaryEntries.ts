import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { DAY_MS } from '../utils/time';

const STORAGE_KEY = '@removary_entries';
export const RETENTION_DAYS = 30;

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface DiaryDraft {
  title: string;
  content: string;
}

const createEmptyEntry = (): DiaryDraft => ({
  title: '',
  content: '',
});

const isDiaryEntryArray = (value: unknown): value is DiaryEntry[] =>
  Array.isArray(value) &&
  value.every((item) => {
    if (typeof item !== 'object' || item === null) {
      return false;
    }
    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.content === 'string' &&
      typeof candidate.createdAt === 'string'
    );
  });

const pruneExpiredEntries = (entries: DiaryEntry[], referenceTime: number): DiaryEntry[] =>
  entries.filter(
    (entry) => referenceTime - new Date(entry.createdAt).getTime() < RETENTION_DAYS * DAY_MS
  );

const usePersistEntries = () =>
  useCallback(async (nextEntries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
    } catch (error) {
      console.error('Failed to persist diary entries', error);
      Alert.alert('오류', '변경사항을 저장하지 못했어요.');
    }
  }, []);

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [draft, setDraft] = useState<DiaryDraft>(createEmptyEntry());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(Date.now());
  const persistEntries = usePersistEntries();

  const loadEntries = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setEntries([]);
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!isDiaryEntryArray(parsed)) {
        setEntries([]);
        return;
      }

      const validEntries = pruneExpiredEntries(parsed, Date.now());
      setEntries(validEntries);

      if (validEntries.length !== parsed.length) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
      }
    } catch (error) {
      console.error('Failed to load diary entries', error);
      Alert.alert('오류', '다이어리를 불러오는 중 문제가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setEntries((prev) => {
      const filtered = pruneExpiredEntries(prev, now);
      if (filtered.length !== prev.length) {
        void persistEntries(filtered);
        return filtered;
      }
      return prev;
    });
  }, [now, persistEntries]);

  const handleChange = useCallback((field: keyof DiaryDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!draft.content.trim()) {
      Alert.alert('알림', '내용은 반드시 입력해 주세요.');
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: draft.title.trim(),
      content: draft.content.trim(),
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => {
      const next = [newEntry, ...prev];
      void persistEntries(next);
      return next;
    });
    setDraft(createEmptyEntry());
    Alert.alert('저장 완료', '새로운 다이어리가 추가되었어요.');
  }, [draft, persistEntries]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('삭제 확인', '정말로 이 다이어리를 삭제할까요?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setEntries((prev) => {
              const next = prev.filter((entry) => entry.id !== id);
              void persistEntries(next);
              return next;
            });
          },
        },
      ]);
    },
    [persistEntries]
  );

  return {
    entries,
    draft,
    isLoading,
    now,
    handleChange,
    handleSubmit,
    handleDelete,
  };
};
