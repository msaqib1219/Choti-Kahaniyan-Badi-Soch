import { Story } from './geminiService';

export const parseStoryMarkdown = (content: string): Story => {
  const lines = content.split('\n');
  const title = lines.find(l => l.startsWith('# Title:'))?.replace('# Title:', '').trim() || 'Untitled';
  const titleUrdu = lines.find(l => l.startsWith('# Title (Urdu):'))?.replace('# Title (Urdu):', '').trim();
  const level = lines.find(l => l.startsWith('Level:'))?.replace('Level:', '').trim() || '4-5';
  const moral = lines.find(l => l.startsWith('Moral:'))?.replace('Moral:', '').trim() || '';
  const moralUrdu = lines.find(l => l.startsWith('Moral (Urdu):'))?.replace('Moral (Urdu):', '').trim();

  const scenes: any[] = [];
  let currentScene: any = null;

  lines.forEach(line => {
    if (line.startsWith('## Scene')) {
      if (currentScene) scenes.push(currentScene);
      currentScene = { text: '', textUrdu: '', action: { instruction: '', instructionUrdu: '', type: 'tap', targetDesc: '', emoji: '' }, imagePrompt: '' };
    } else if (currentScene) {
      if (line.startsWith('Text:')) currentScene.text = line.replace('Text:', '').trim();
      else if (line.startsWith('Text (Urdu):')) currentScene.textUrdu = line.replace('Text (Urdu):', '').trim();
      else if (line.startsWith('Action Instruction:')) currentScene.action.instruction = line.replace('Action Instruction:', '').trim();
      else if (line.startsWith('Action Instruction (Urdu):')) currentScene.action.instructionUrdu = line.replace('Action Instruction (Urdu):', '').trim();
      else if (line.startsWith('Action Type:')) currentScene.action.type = line.replace('Action Type:', '').trim();
      else if (line.startsWith('Action Count:')) currentScene.action.count = parseInt(line.replace('Action Count:', '').trim());
      else if (line.startsWith('Action Target:')) currentScene.action.targetDesc = line.replace('Action Target:', '').trim();
      else if (line.startsWith('Action Emoji:')) currentScene.action.emoji = line.replace('Action Emoji:', '').trim();
      else if (line.startsWith('Image Prompt:')) currentScene.imagePrompt = line.replace('Image Prompt:', '').trim();
      else if (line.startsWith('Image URL:')) currentScene.imageUrl = line.replace('Image URL:', '').trim();
    }
  });

  if (currentScene) scenes.push(currentScene);

  return { title, titleUrdu, level, moral, moralUrdu, scenes };
};
