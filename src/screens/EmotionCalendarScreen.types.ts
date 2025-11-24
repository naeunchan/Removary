import type { DayEmotion } from '@/features/diary/types/diaryTypes';

export type EmotionCalendarScreenProps = {
  onClose: () => void;
};

export type CalendarCell = {
  id: string;
  date: Date | null;
};

export type MoodMeta = {
  label: string;
  color: string;
};

export type MoodMetaMap = Record<DayEmotion['mood'], MoodMeta>;
