import type { CategoryOption, MoodOption } from './EntryForm.types';

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: '일', value: 'work' },
  { label: '관계', value: 'relationship' },
  { label: '일상', value: 'daily' },
  { label: '공부', value: 'study' },
  { label: '기타', value: 'etc' },
];

export const MOOD_OPTIONS: MoodOption[] = [
  { value: 'very_good', emoji: '😄', label: '최고' },
  { value: 'good', emoji: '🙂', label: '좋음' },
  { value: 'neutral', emoji: '😐', label: '보통' },
  { value: 'bad', emoji: '🙁', label: '별로' },
  { value: 'very_bad', emoji: '😣', label: '나쁨' },
];
