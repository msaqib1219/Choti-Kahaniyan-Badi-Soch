import { useState, useEffect } from 'react';
import ThemeWrapper from './components/ThemeWrapper';
import Dashboard from './components/Dashboard';
import StoryCard from './components/StoryCard';
import { ThemeType, AgeLevel, UserStats, INITIAL_BADGES } from './types';
import { generateStory, Story } from './services/geminiService';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('heroic_hearts_stats');
    return saved ? JSON.parse(saved) : {
      hearts: 5,
      stars: 0,
      storiesCompleted: 0,
      badges: INITIAL_BADGES
    };
  });

  const [selectedAge, setSelectedAge] = useState<AgeLevel>('4-5');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('forest');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('heroic_hearts_stats', JSON.stringify(stats));
  }, [stats]);

  const handleStartStory = async () => {
    setIsGenerating(true);
    try {
      // Rotate core values for variety
      const values = ['Helping each other', 'Sharing toys', 'Taking turns', 'Being kind to animals', 'Saying Thank You'];
      const randomValue = values[Math.floor(Math.random() * values.length)];
      
      const story = await generateStory(selectedAge, selectedTheme, randomValue);
      setCurrentStory(story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      alert("Oops! The magic book is sleeping. Let's try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStoryComplete = () => {
    setStats(prev => {
      const newCount = prev.storiesCompleted + 1;
      const updatedBadges = [...prev.badges];
      
      // Unlock logic
      if (newCount === 1) updatedBadges[0].unlocked = true;
      if (newCount === 3) updatedBadges[1].unlocked = true;
      
      return {
        ...prev,
        stars: prev.stars + 10,
        hearts: prev.hearts + 2,
        storiesCompleted: newCount,
        badges: updatedBadges
      };
    });
  };

  return (
    <ThemeWrapper theme={selectedTheme}>
      {!currentStory ? (
        <Dashboard
          stats={stats}
          selectedAge={selectedAge}
          selectedTheme={selectedTheme}
          onSelectAge={setSelectedAge}
          onSelectTheme={setSelectedTheme}
          onStartStory={handleStartStory}
          isGenerating={isGenerating}
        />
      ) : (
        <StoryCard
          story={currentStory}
          onComplete={handleStoryComplete}
          onExit={() => setCurrentStory(null)}
        />
      )}
      
      {/* Sound Credit or Tiny Footer */}
      <footer className="mt-auto pt-12 pb-4 text-center">
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase bg-white/30 backdrop-blur inline-block px-4 py-1 rounded-full border border-white/50">
          Made with ❤️ for Pakistani Children
        </p>
      </footer>
    </ThemeWrapper>
  );
}
