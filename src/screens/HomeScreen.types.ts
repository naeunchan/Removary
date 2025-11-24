import type { DiaryEntry as LegacyDiaryEntry, DiaryStoreEntry, DiaryCategory } from '@/features/diary/types/diaryTypes';

export type HomeScreenProps = {
  onOpenEmotionCalendar?: () => void;
};

export type DeleteModalConfig = { type: 'single'; entryId: string } | { type: 'batch' };

export type StoreEntryMapper = (entry: DiaryStoreEntry) => LegacyDiaryEntry;
