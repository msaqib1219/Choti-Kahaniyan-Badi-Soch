import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface Story {
  title: string;
  scenes: Array<{
    text: string;
    action: {
      instruction: string;
      type: 'tap' | 'multi-tap' | 'sequence';
      count?: number;
      targetDesc: string;
    };
    imagePrompt: string;
  }>;
  moral: string;
  level: string;
}

export const generateStory = async (age: string, theme: string, value: string): Promise<Story> => {
  const prompt = `Generate a short interactive story for a Pakistani child aged ${age}.
  Theme: ${theme} (Car/Forest/Sea).
  Core Value: ${value} (e.g., Helping, Sharing, Taking turns).
  Include Pakistani cultural touches (names like Ali, Sara, Omar, or Zoya; mention of things like local fruits, trees, or truck art for cars).
  The story should be divided into 3-4 scenes.
  
  Each scene MUST have:
  1. text: a simple narrative (1-2 sentences).
  2. action: An interactive element:
     - instruction: What the child should do (e.g., "Tap the mangoes to share them").
     - type: One of 'tap', 'multi-tap', or 'sequence'.
     - count: (For multi-tap) Number of times to tap (2-4).
     - targetDesc: A short description of the item being interacted with (e.g., "Shiny Mangoes").
  3. imagePrompt: a HIGHLY DESCRIPTIVE prompt. Style: "A vibrant, soft children's book illustration, bright colors, friendly characters, 3D clay style, Pakistani aesthetic". Include the target item clearly.
  
  The tone should be warm, encouraging, and playful.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                action: {
                  type: Type.OBJECT,
                  properties: {
                    instruction: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['tap', 'multi-tap', 'sequence'] },
                    count: { type: Type.NUMBER },
                    targetDesc: { type: Type.STRING }
                  },
                  required: ["instruction", "type", "targetDesc"]
                },
                imagePrompt: { type: Type.STRING }
              },
              required: ["text", "action", "imagePrompt"]
            }
          },
          moral: { type: Type.STRING },
          level: { type: Type.STRING }
        },
        required: ["title", "scenes", "moral", "level"]
      }
    }
  });

  return JSON.parse(response.text) as Story;
};
