import type { DiaryEntry, DiaryCategory } from '@/features/diary/types/diaryTypes';
import type { SharedValue } from 'react-native-reanimated';

export type EntryCardProps = {
  entry: DiaryEntry;
  onDelete: (id: string, options?: { skipConfirm?: boolean }) => void;
  onToggleComplete: (id: string) => void;
};

export type SwipeActionProps = {
  width: number;
  progress: SharedValue<number>;
  translation: SharedValue<number>;
};

export type CategoryMeta = {
  label: string;
  bg: string;
  text: string;
};

export type CategoryMetaMap = Record<DiaryCategory, CategoryMeta>;
