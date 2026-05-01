import { Story } from '../services/geminiService';
import { ThemeType, AgeLevel } from '../types';
import { parseStoryMarkdown } from '../services/storyParser';

// Use Vite's glob import to get all markdown files as raw strings
const storyFiles = (import.meta as any).glob('../stories/**/*.md', { query: '?raw', eager: true });

const getStory = (age: AgeLevel, theme: ThemeType): Story => {
  const path = `../stories/${age}/${theme}.md`;
  const module = storyFiles[path] as { default: string };
  if (!module) throw new Error(`Story not found: ${path}`);
  return parseStoryMarkdown(module.default);
};

export const PREBUILT_STORIES: Record<AgeLevel, Record<ThemeType, Story>> = {
  '2-3': {
    car: getStory('2-3', 'car'),
    forest: getStory('2-3', 'forest'),
    sea: getStory('2-3', 'sea'),
  },
  '4-5': {
    car: getStory('4-5', 'car'),
    forest: getStory('4-5', 'forest'),
    sea: getStory('4-5', 'sea'),
  },
  '6-8': {
    car: getStory('6-8', 'car'),
    forest: getStory('6-8', 'forest'),
    sea: getStory('6-8', 'sea'),
  }
};

