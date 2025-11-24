import type { DiaryEntry } from '@/features/diary/types/diaryTypes';

export type EntryListProps = {
  entries: DiaryEntry[];
  isLoading: boolean;
  onDelete: (id: string, options?: { skipConfirm?: boolean }) => void;
  onToggleComplete: (id: string) => void;
};
