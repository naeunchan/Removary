import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { DAY_MS } from '@/utils/time';
import { LAST_ACCESS_KEY, RETENTION_DAYS, STORAGE_KEY } from '@/constants/diary';
import { DiaryDraft, DiaryEntry } from '@/types/diary';

const createEmptyEntry = (): DiaryDraft => ({
  title: '',
  content: '',
});

const RETENTION_WINDOW_MS = RETENTION_DAYS * DAY_MS;

const getEntryExpiryTimestamp = (entry: DiaryEntry): number | null => {
  const createdAtTimestamp = Date.parse(entry.createdAt);
  if (Number.isNaN(createdAtTimestamp)) {
    return null;
  }
  return createdAtTimestamp + RETENTION_WINDOW_MS;
};

const pruneExpiredEntries = (entries: DiaryEntry[], referenceTime: number) => {
  const nextEntries: DiaryEntry[] = [];
  let removed = false;

  entries.forEach((entry) => {
    const expiryTimestamp = getEntryExpiryTimestamp(entry);
    if (expiryTimestamp === null || expiryTimestamp <= referenceTime) {
      removed = true;
      return;
    }
    nextEntries.push(entry);
  });

  return { entries: nextEntries, removed };
};

const calculateNextExpiryTimestamp = (entries: DiaryEntry[]): number | null => {
  let nextExpiry: number | null = null;

  entries.forEach((entry) => {
    const expiryTimestamp = getEntryExpiryTimestamp(entry);
    if (expiryTimestamp === null) {
      return;
    }
    if (nextExpiry === null || expiryTimestamp < nextExpiry) {
      nextExpiry = expiryTimestamp;
    }
  });

  return nextExpiry;
};

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
      typeof candidate.createdAt === 'string' &&
      (typeof candidate.isCompleted === 'boolean' || typeof candidate.isCompleted === 'undefined')
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
  const [lastVisitedAt, setLastVisitedAt] = useState<number | null>(null);
  const [daysSinceLastVisit, setDaysSinceLastVisit] = useState<number | null>(null);
  const persistEntries = usePersistEntries();
  const persistLastAccess = useCallback(async (timestamp: number) => {
    try {
      await AsyncStorage.setItem(LAST_ACCESS_KEY, timestamp.toString());
    } catch (error) {
      console.error('Failed to persist last access timestamp', error);
    }
  }, []);

  const updateAccessTimestamp = useCallback(
    (timestamp: number, options?: { resetVisitDiff?: boolean }) => {
      if (options?.resetVisitDiff) {
        setLastVisitedAt(timestamp);
        setDaysSinceLastVisit(0);
      }
      void persistLastAccess(timestamp);
    },
    [persistLastAccess],
  );

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
      if (lastAccessTimestamp !== null) {
        setLastVisitedAt(lastAccessTimestamp);
        const diffDays = Math.max(0, Math.floor((nowTs - lastAccessTimestamp) / DAY_MS));
        setDaysSinceLastVisit(diffDays);
      } else {
        setLastVisitedAt(null);
        setDaysSinceLastVisit(null);
      }

      if (lastAccessTimestamp && nowTs - lastAccessTimestamp >= RETENTION_WINDOW_MS) {
        setEntries([]);
        setExpiresAt(null);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      } else if (rawEntries) {
        const parsedEntries: unknown = JSON.parse(rawEntries);
        if (isDiaryEntryArray(parsedEntries)) {
          const sanitizedEntries = parsedEntries.map((entry) => ({
            ...entry,
            isCompleted: typeof entry.isCompleted === 'boolean' ? entry.isCompleted : false,
          }));
          const { entries: activeEntries, removed } = pruneExpiredEntries(sanitizedEntries, nowTs);
          setEntries(activeEntries);
          setExpiresAt(calculateNextExpiryTimestamp(activeEntries));
          const needsPersist = parsedEntries.some(
            (entry) => typeof entry.isCompleted !== 'boolean',
          );
          if (needsPersist || removed) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activeEntries));
          }
        } else {
          setEntries([]);
          setExpiresAt(null);
        }
      } else {
        setEntries([]);
        setExpiresAt(null);
      }

      updateAccessTimestamp(nowTs);
    } catch (error) {
      console.error('Failed to load diary entries', error);
      Alert.alert('오류', '다이어리를 불러오는 중 문제가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [updateAccessTimestamp]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!expiresAt || now < expiresAt) {
      return;
    }

    setEntries((prev) => {
      if (!prev.length) {
        setExpiresAt(null);
        return prev;
      }

      const { entries: activeEntries, removed } = pruneExpiredEntries(prev, now);
      const nextExpiry = calculateNextExpiryTimestamp(activeEntries);
      setExpiresAt(nextExpiry);

      if (!removed) {
        return prev;
      }

      void persistEntries(activeEntries);
      return activeEntries;
    });
    updateAccessTimestamp(now, { resetVisitDiff: true });
  }, [expiresAt, now, persistEntries, updateAccessTimestamp]);

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
      isCompleted: false,
    };

    const updatedAccess = Date.now();
    setNow(updatedAccess);
    updateAccessTimestamp(updatedAccess, { resetVisitDiff: true });

    setEntries((prev) => {
      const next = [newEntry, ...prev];
      setExpiresAt(calculateNextExpiryTimestamp(next));
      void persistEntries(next);
      return next;
    });
    setDraft(createEmptyEntry());
    Alert.alert('저장 완료', '새로운 다이어리가 추가되었어요.');
  }, [draft, persistEntries, updateAccessTimestamp]);

  const handleDelete = useCallback(
    (id: string, options?: { skipConfirm?: boolean }) => {
      const removeEntry = () => {
        const updatedAccess = Date.now();
        setNow(updatedAccess);
        updateAccessTimestamp(updatedAccess, { resetVisitDiff: true });

        setEntries((prev) => {
          const next = prev.filter((entry) => entry.id !== id);
          if (next.length === prev.length) {
            return prev;
          }
          setExpiresAt(calculateNextExpiryTimestamp(next));
          void persistEntries(next);
          return next;
        });
      };

      if (options?.skipConfirm) {
        removeEntry();
        return;
      }

      Alert.alert('삭제 확인', '정말로 이 다이어리를 삭제할까요?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: removeEntry,
        },
      ]);
    },
    [persistEntries, updateAccessTimestamp],
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      const updatedAccess = Date.now();
      setNow(updatedAccess);
      updateAccessTimestamp(updatedAccess, { resetVisitDiff: true });

      setEntries((prev) => {
        let hasUpdates = false;
        const next = prev.map((entry) => {
          if (entry.id === id) {
            hasUpdates = true;
            return { ...entry, isCompleted: !entry.isCompleted };
          }
          return entry;
        });
        if (!hasUpdates) {
          return prev;
        }
        setExpiresAt(calculateNextExpiryTimestamp(next));
        void persistEntries(next);
        return next;
      });
    },
    [persistEntries, updateAccessTimestamp],
  );

  return {
    entries,
    draft,
    isLoading,
    now,
    expiresAt,
    lastVisitedAt,
    daysSinceLastVisit,
    handleChange,
    handleSubmit,
    handleDelete,
    handleToggleComplete,
  };
};
