import React from 'react';
import { motion } from 'motion/react';
import { ThemeType, AgeLevel, UserStats } from '../types';
import { Heart, Star, Sparkles, BookOpen } from 'lucide-react';
import { soundService } from '../services/soundService';

interface DashboardProps {
  stats: UserStats;
  selectedAge: AgeLevel;
  selectedTheme: ThemeType;
  onSelectAge: (age: AgeLevel) => void;
  onSelectTheme: (theme: ThemeType) => void;
  onStartStory: () => void;
  isGenerating: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  selectedAge, 
  selectedTheme, 
  onSelectAge, 
  onSelectTheme, 
  onStartStory,
  isGenerating
}) => {
  const themes: { id: ThemeType; label: string; icon: string; color: string }[] = [
    { id: 'car', label: 'Fast Cars', icon: '🚗', color: 'bg-car-primary' },
    { id: 'forest', label: 'Magical Forest', icon: '🌲', color: 'bg-forest-primary' },
    { id: 'sea', label: 'Deep Blue Sea', icon: '🐠', color: 'bg-sea-primary' },
  ];

  const ages: AgeLevel[] = ['2-3', '4-5', '6-8'];

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto w-full">
      {/* Header / Stats */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="font-display text-5xl md:text-6xl text-slate-800 mb-2">Assalam-u-Alaikum!</h1>
          <p className="text-xl text-slate-600 font-medium">Which adventure should we go on today?</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-md border-b-4 border-slate-200 flex items-center gap-3">
             <Heart className="text-pink-500 animate-pulse" fill="currentColor" size={24} />
             <span className="text-2xl font-bold">{stats.hearts}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-md border-b-4 border-slate-200 flex items-center gap-3">
             <Star className="text-yellow-500" fill="currentColor" size={24} />
             <span className="text-2xl font-bold">{stats.stars}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Age Selection */}
        <section className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border-2 border-white shadow-inner">
           <h2 className="font-display text-3xl mb-6 text-slate-700 flex items-center gap-3">
             <BookOpen size={32} className="text-blue-500" /> My Age
           </h2>
           <div className="grid grid-cols-3 gap-4">
              {ages.map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    soundService.play('click');
                    onSelectAge(age);
                  }}
                  className={`py-6 rounded-2xl font-display text-2xl transition-all border-4 ${
                    selectedAge === age 
                      ? 'bg-blue-500 text-white border-blue-200 scale-105 shadow-xl' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 shadow-md'
                  }`}
                >
                  {age}
                </button>
              ))}
           </div>
        </section>

        {/* Theme Selection */}
        <section className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border-2 border-white shadow-inner">
           <h2 className="font-display text-3xl mb-6 text-slate-700 flex items-center gap-3">
             <Sparkles size={32} className="text-yellow-500" /> Magic World
           </h2>
           <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    soundService.play('click');
                    onSelectTheme(theme.id);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-4 ${
                    selectedTheme === theme.id 
                      ? `${theme.color} text-white border-white scale-105 shadow-xl` 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200 shadow-md'
                  }`}
                >
                  <span className="text-4xl">{theme.icon}</span>
                  <span className="font-bold text-sm tracking-tight">{theme.label}</span>
                </button>
              ))}
           </div>
        </section>
      </div>

      {/* Start Button */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundService.play('sparkle');
            onStartStory();
          }}
          disabled={isGenerating}
          className={`group flex items-center gap-4 px-16 py-6 rounded-full font-display text-4xl shadow-2xl transition-all relative overflow-hidden ${
             isGenerating ? 'bg-slate-400 cursor-wait' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              Building Magic...
            </>
          ) : (
            <>
              Let's Go!
              <motion.span 
                animate={{ x: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 1 }}
              >
                🌈
              </motion.span>
            </>
          )}
          
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </motion.button>
      </div>

      {/* Badges Preview */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-80">
        {stats.badges.map(badge => (
          <div 
            key={badge.id} 
            className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 ${
              badge.unlocked ? 'bg-white border-yellow-400 text-yellow-700' : 'bg-slate-200/50 border-transparent text-slate-400 grayscale'
            }`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="font-bold text-sm">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
