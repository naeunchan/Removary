export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface DiaryDraft {
  title: string;
  content: string;
}
