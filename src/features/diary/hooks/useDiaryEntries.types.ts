import type { DiaryDraft, DiaryEntry } from '@/features/diary/types/diaryTypes';

export type PrunedEntriesResult = {
  entries: DiaryEntry[];
  removed: boolean;
};

export type UseDiaryEntriesResult = {
  entries: DiaryEntry[];
  draft: DiaryDraft;
  isLoading: boolean;
  now: number;
  expiresAt: number | null;
  lastVisitedAt: number | null;
  daysSinceLastVisit: number | null;
  handleChange: (field: keyof DiaryDraft, value: string) => void;
  handleSubmit: (options?: { id?: string; createdAt?: string }) => void;
  handleDelete: (id: string, options?: { skipConfirm?: boolean }) => void;
  handleToggleComplete: (id: string) => void;
};
