import { useState, useEffect } from 'react';
import ThemeWrapper from './components/ThemeWrapper';
import Dashboard from './components/Dashboard';
import StoryCard from './components/StoryCard';
import { ThemeType, AgeLevel, UserStats, INITIAL_BADGES, LanguageType } from './types';
import { generateStory, Story, generateSceneImage } from './services/geminiService';
import { soundService } from './services/soundService';
import { Volume2, VolumeX } from 'lucide-react';

import { PREBUILT_STORIES } from './data/prebuiltStories';

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
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('en');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    soundService.updateBGM(selectedTheme as any);
  }, [selectedTheme]);

  useEffect(() => {
    localStorage.setItem('heroic_hearts_stats', JSON.stringify(stats));
  }, [stats]);

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    soundService.updateBGM(selectedTheme as any);
  };

  const handleStartStory = () => {
    setLoading(true);
    // Simulate a tiny delay for "magic" effect, but load instantly from data
    setTimeout(() => {
      const story = PREBUILT_STORIES[selectedAge][selectedTheme];
      setCurrentStory(story);
      setLoading(false);
    }, 800);
  };

  const handleGenerateAIStory = () => {
    // AI functionality is disabled. Fallback to prebuilt immediately.
    handleStartStory();
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
      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:scale-110 transition-all border border-white/50"
      >
        {isMuted ? <VolumeX className="text-slate-400" /> : <Volume2 className="text-blue-500 animate-pulse" />}
      </button>

      {!currentStory ? (
        <Dashboard
          stats={stats}
          selectedAge={selectedAge}
          selectedTheme={selectedTheme}
          selectedLanguage={selectedLanguage}
          onSelectAge={setSelectedAge}
          onSelectTheme={setSelectedTheme}
          onSelectLanguage={setSelectedLanguage}
          onStartStory={handleStartStory}
          onGenerateAIStory={handleGenerateAIStory}
          loading={loading}
        />
      ) : (
        <StoryCard
          story={currentStory}
          language={selectedLanguage}
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
