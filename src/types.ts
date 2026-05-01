export type ThemeType = 'forest' | 'sea' | 'car';
export type AgeLevel = '2-3' | '4-5' | '6-8';
export type LanguageType = 'en' | 'ur';

export interface UserStats {
  hearts: number;
  stars: number;
  storiesCompleted: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  nameUrdu?: string;
  icon: string;
  description: string;
  descriptionUrdu?: string;
  unlocked: boolean;
}

export const INITIAL_BADGES: Badge[] = [
  { 
    id: 'first_story', 
    name: 'Starter Storyteller', 
    nameUrdu: 'پہلا قصہ گو', 
    icon: '📖', 
    description: 'Finished your first story!', 
    descriptionUrdu: 'پہلی کہانی مکمل کی!', 
    unlocked: false 
  },
  { 
    id: 'helper', 
    name: 'Super Helper', 
    nameUrdu: 'سپر مددگار', 
    icon: '🤝', 
    description: 'Completed 3 helping stories!', 
    descriptionUrdu: 'مدد والی 3 کہانیاں مکمل کیں!', 
    unlocked: false 
  },
  { 
    id: 'sharer', 
    name: 'Giving Heart', 
    nameUrdu: 'بانٹنے والا دل', 
    icon: '💖', 
    description: 'Shared things 3 times!', 
    descriptionUrdu: '3 بار چیزیں بانٹیں!', 
    unlocked: false 
  },
];
