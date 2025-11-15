export type DiaryCategory = 'work' | 'relationship' | 'daily' | 'study' | 'etc';

export type DiaryStoreEntry = {
  id: string;
  title: string;
  content: string;
  category: DiaryCategory;
  createdAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (createdAt + 21 days)
  isCompleted: boolean;
};

export type DayEmotion = {
  date: string; // YYYY-MM-DD
  mood: 'very_good' | 'good' | 'neutral' | 'bad' | 'very_bad';
};

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isCompleted: boolean;
  category?: DiaryCategory;
}

export interface DiaryDraft {
  title: string;
  content: string;
}
