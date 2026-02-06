
export interface Dua {
  id: number;
  arabic: string;
  transliteration: string;
  translation_en: string;
  translation_ur: string;
  audio: string;
}

export interface DuaCategory {
  name: string;
  duas: Dua[];
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'answered';
}

export interface AmeenPost {
    id: string;
    text: string;
    ameenCount: number;
    createdAt: string;
}

export interface ZikrReminder {
  enabled: boolean;
  time: string;
  zikrType: string;
  lastTriggered: string;
}

export enum AppView {
    Home = 'Home',
    Zikr = 'Zikr',
    Journal = 'Journal',
    Ameen = 'Ameen',
    Categories = 'Categories',
}