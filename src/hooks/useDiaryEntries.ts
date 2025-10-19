import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { DAY_MS } from '../utils/time';

const STORAGE_KEY = '@removary_entries';
const LAST_ACCESS_KEY = '@removary_last_access';
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
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [draft, setDraft] = useState<DiaryDraft>(createEmptyEntry());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<number>(Date.now());
  const persistEntries = usePersistEntries();
  const persistLastAccess = useCallback(async (timestamp: number) => {
    try {
      await AsyncStorage.setItem(LAST_ACCESS_KEY, timestamp.toString());
    } catch (error) {
      console.error('Failed to persist last access timestamp', error);
    }
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      const [rawEntries, rawLastAccess] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(LAST_ACCESS_KEY),
      ]);

      const nowTs = Date.now();
      const parsedLastAccess = rawLastAccess ? Number(rawLastAccess) : null;
      const lastAccessTimestamp =
        parsedLastAccess !== null && !Number.isNaN(parsedLastAccess) ? parsedLastAccess : null;

      setNow(nowTs);
      if (lastAccessTimestamp && nowTs - lastAccessTimestamp >= RETENTION_DAYS * DAY_MS) {
        setEntries([]);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      } else if (rawEntries) {
        const parsedEntries: unknown = JSON.parse(rawEntries);
        if (isDiaryEntryArray(parsedEntries)) {
          setEntries(parsedEntries);
        } else {
          setEntries([]);
        }
      } else {
        setEntries([]);
      }

      setExpiresAt(nowTs + RETENTION_DAYS * DAY_MS);
      await persistLastAccess(nowTs);
    } catch (error) {
      console.error('Failed to load diary entries', error);
      Alert.alert('오류', '다이어리를 불러오는 중 문제가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [persistLastAccess]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      setExpiresAt(current + RETENTION_DAYS * DAY_MS);
      void persistLastAccess(current);
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [persistLastAccess]);

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

    const updatedAccess = Date.now();
    setNow(updatedAccess);
    setExpiresAt(updatedAccess + RETENTION_DAYS * DAY_MS);
    void persistLastAccess(updatedAccess);

    setEntries((prev) => {
      const next = [newEntry, ...prev];
      void persistEntries(next);
      return next;
    });
    setDraft(createEmptyEntry());
    Alert.alert('저장 완료', '새로운 다이어리가 추가되었어요.');
  }, [draft, persistEntries, persistLastAccess]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('삭제 확인', '정말로 이 다이어리를 삭제할까요?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const updatedAccess = Date.now();
            setNow(updatedAccess);
            setExpiresAt(updatedAccess + RETENTION_DAYS * DAY_MS);
            void persistLastAccess(updatedAccess);

            setEntries((prev) => {
              const next = prev.filter((entry) => entry.id !== id);
              void persistEntries(next);
              return next;
            });
          },
        },
      ]);
    },
    [persistEntries, persistLastAccess]
  );

  return {
    entries,
    draft,
    isLoading,
    now,
    expiresAt,
    handleChange,
    handleSubmit,
    handleDelete,
  };
};
