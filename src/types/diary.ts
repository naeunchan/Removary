export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface DiaryDraft {
  title: string;
  content: string;
}
