export type DiaryCategory = 'work' | 'relationship' | 'daily' | 'study' | 'etc';

export type DiaryEntry = {
  id: string;
  content: string;
  category: DiaryCategory;
  createdAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp
};

export type DayEmotion = {
  date: string; // YYYY-MM-DD
  mood: 'very_good' | 'good' | 'neutral' | 'bad' | 'very_bad';
};
