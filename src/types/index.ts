export type EntryType = 'gratitude' | 'journal';

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface Entry {
  id: string;
  type: EntryType;
  content: string;
  title?: string;
  mood?: MoodRating;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  synced?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
