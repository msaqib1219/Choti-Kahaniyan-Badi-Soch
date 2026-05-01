import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, ArrowRight, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Story } from '../services/geminiService';
import { soundService } from '../services/soundService';

interface StoryCardProps {
  story: Story;
  onComplete: () => void;
  onExit: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onComplete, onExit }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [interacted, setInteracted] = useState(false);

  const scene = story.scenes[currentScene];

  useEffect(() => {
    setTapCount(0);
    setInteracted(false);
  }, [currentScene]);

  const handleNext = () => {
    soundService.play('transition');
    if (currentScene < story.scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      soundService.play('success');
      setIsFinished(true);
      onComplete();
    }
  };

  const handleInteract = () => {
    const requiredCount = scene.action.type === 'multi-tap' ? (scene.action.count || 2) : 1;
    const nextCount = tapCount + 1;
    
    setTapCount(nextCount);
    soundService.play('interaction');

    if (nextCount >= requiredCount) {
      setInteracted(true);
      soundService.play('sparkle');
    }
  };

  // Generate random positions for the "action" triggers if multiple taps are needed
  const [renderTargets, setRenderTargets] = useState<{ x: number, y: number }[]>([]);
  
  useEffect(() => {
    const count = scene.action.type === 'multi-tap' ? (scene.action.count || 2) : 1;
    const newTargets = Array.from({ length: count }).map(() => ({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70
    }));
    setRenderTargets(newTargets);
  }, [currentScene, scene.action]);

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto my-12 border-4 border-yellow-400"
      >
        <div className="text-7xl mb-6">🏆</div>
        <h2 className="font-display text-4xl text-yellow-600 mb-4">Shabbash! Well Done!</h2>
        <p className="text-xl text-center mb-8 font-medium">
          Mubarak! You finished the story: <br/>
          <span className="font-bold text-2xl text-blue-600">"{story.title}"</span>
        </p>
        <div className="bg-blue-50 p-6 rounded-2xl mb-8 border-2 border-blue-200 italic">
          <p className="text-lg text-blue-800">"{story.moral}"</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onExit}
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
          >
            <RotateCcw size={20} /> Back Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-6">
      <div className="w-full flex justify-between items-center px-4">
        <h1 className="font-display text-3xl text-slate-800 md:text-4xl">{story.title}</h1>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
           <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Scene {currentScene + 1}/{story.scenes.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group relative"
        >
          <div className="aspect-video w-full bg-slate-100 relative group overflow-hidden">
             <motion.img 
               key={currentScene}
               initial={{ scale: 1.1, opacity: 0.5 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.5 }}
               src={`https://picsum.photos/seed/${encodeURIComponent(story.title + currentScene)}/1200/800`}
               alt={scene.imagePrompt}
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
             
             {/* Interaction Targets */}
             {!interacted && renderTargets.map((pos, i) => (
                <motion.button
                  key={`${currentScene}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: i === tapCount ? 1 : 0,
                    opacity: i === tapCount ? 1 : 0 
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleInteract}
                  className="absolute bg-white text-slate-800 p-6 rounded-full shadow-2xl animate-bounce hover:bg-slate-50 transition-all z-20 text-4xl flex items-center justify-center min-w-[80px] min-h-[80px]"
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                  }}
                >
                  {scene.action.emoji || '❤️'}
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                    {i + 1}
                  </span>
                </motion.button>
             ))}

             {interacted && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute inset-0 flex items-center justify-center bg-green-500/10 pointer-events-none"
                >
                   <div className="bg-white/90 backdrop-blur scale-150 p-4 rounded-full shadow-2xl">
                      <Star className="text-yellow-500" fill="currentColor" size={48} />
                   </div>
                </motion.div>
             )}
          </div>

          <div className="p-8 md:p-12">
            <div className="story-text text-slate-700 mb-8">
              <ReactMarkdown>{scene.text}</ReactMarkdown>
            </div>
            
            <div className={`p-6 rounded-2xl transition-all duration-300 border-2 ${interacted ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
               <div className="flex flex-col gap-2">
                 <p className={`text-xl font-bold flex items-center gap-3 ${interacted ? 'text-green-700' : 'text-slate-700'}`}>
                    {interacted ? <Star size={24} fill="currentColor" /> : '👉'} 
                    {scene.action.instruction}
                 </p>
                 {!interacted && scene.action.type === 'multi-tap' && (
                    <div className="flex gap-2 mt-2">
                      {Array.from({ length: scene.action.count || 2 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-3 w-12 rounded-full transition-all ${i < tapCount ? 'bg-green-500' : 'bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                 )}
               </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between w-full px-4 mb-12">
        <button 
          onClick={onExit}
          className="text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          Cancel Story
        </button>
        
        {interacted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleNext}
            className="px-12 py-4 bg-yellow-400 text-yellow-900 font-display text-2xl rounded-full hover:bg-yellow-500 transition-all shadow-xl flex items-center gap-3 active:scale-95"
          >
            {currentScene === story.scenes.length - 1 ? 'Finish Story!' : 'Next Page'} 
            <ArrowRight size={24} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
