import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeType } from '../types';

interface ThemeWrapperProps {
  theme: ThemeType;
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'forest':
        return {
          bg: 'bg-forest-secondary',
          accent: 'border-forest-primary',
          overlay: 'bg-forest-primary/5',
          decoration: '🌲🌳🍃',
        };
      case 'sea':
        return {
          bg: 'bg-sea-secondary',
          accent: 'border-sea-primary',
          overlay: 'bg-sea-primary/5',
          decoration: '🌊🐚🐠',
        };
      case 'car':
        return {
          bg: 'bg-car-secondary',
          accent: 'border-car-primary',
          overlay: 'bg-car-primary/5',
          decoration: '🚗🚙🚦',
        };
      default:
        return {
          bg: 'bg-slate-50',
          accent: 'border-slate-400',
          overlay: '',
          decoration: '✨',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`min-h-screen w-full ${styles.bg} transition-colors duration-1000 relative overflow-hidden`}>
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random() * 2}rem`
            }}
          >
            {styles.decoration.split('')[Math.floor(Math.random() * 3)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.main
          key={theme}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Ground Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 ${styles.overlay} blur-3xl`} />
    </div>
  );
};

export default ThemeWrapper;
