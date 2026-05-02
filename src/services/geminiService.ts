// AI functionality is disabled for this version to allow deployment without API keys.
export interface Story {
  title: string;
  titleUrdu?: string;
  scenes: Array<{
    text: string;
    textUrdu?: string;
    action: {
      instruction: string;
      instructionUrdu?: string;
      type: 'tap' | 'multi-tap' | 'sequence';
      count?: number;
      targetDesc: string;
      emoji: string;
    };
    imagePrompt: string;
    imageUrl?: string;
    imageError?: string;
  }>;
  moral: string;
  moralUrdu?: string;
  level: string;
}

export const generateSpeech = async (text: string, lang: 'en' | 'ur' = 'en'): Promise<string> => {
  throw new Error('AI_DISABLED');
};

export const generateSceneImage = async (prompt: string): Promise<string> => {
  throw new Error('AI_DISABLED');
};

export const generateStory = async (age: string, theme: string, value: string): Promise<Story> => {
  throw new Error('AI_DISABLED');
};
