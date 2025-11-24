import type { MoodMetaMap } from './EmotionCalendarScreen.types';

export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
export const CELL_HORIZONTAL_PADDING = 10;
export const CELL_GAP = 6;

export const MOOD_META: MoodMetaMap = {
  very_good: { label: '아주 좋음', color: '#22c55e' },
  good: { label: '좋음', color: '#86efac' },
  neutral: { label: '보통', color: '#d1d5db' },
  bad: { label: '별로', color: '#fb923c' },
  very_bad: { label: '나쁨', color: '#ef4444' },
};
