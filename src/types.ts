export type ThemeType = 'forest' | 'sea' | 'car';
export type AgeLevel = '2-3' | '4-5' | '6-8';

export interface UserStats {
  hearts: number;
  stars: number;
  storiesCompleted: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export const INITIAL_BADGES: Badge[] = [
  { id: 'first_story', name: 'Starter Storyteller', icon: '📖', description: 'Finished your first story!', unlocked: false },
  { id: 'helper', name: 'Super Helper', icon: '🤝', description: 'Completed 3 helping stories!', unlocked: false },
  { id: 'sharer', name: 'Giving Heart', icon: '💖', description: 'Shared things 3 times!', unlocked: false },
];
