
import React, { useState, useEffect } from 'react';
import { MenuIcon, BellIcon, SparklesIcon } from './Icons';

interface TopNavProps {
  title: string;
  hasNotification?: boolean;
  onBellClick?: () => void;
  onMenuClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ title, hasNotification, onBellClick, onMenuClick }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const lastVisit = localStorage.getItem('lastStreakVisit');
    const currentStreak = parseInt(localStorage.getItem('noorStreak') || '0');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit === yesterday) {
      const newStreak = currentStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('noorStreak', newStreak.toString());
      localStorage.setItem('lastStreakVisit', today);
    } else if (lastVisit !== today) {
      setStreak(1);
      localStorage.setItem('noorStreak', '1');
      localStorage.setItem('lastStreakVisit', today);
    } else {
      setStreak(currentStreak || 1);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-5 py-6 flex items-center justify-between bg-transparent backdrop-blur-sm">
      <button 
        onClick={onMenuClick}
        className="p-1 text-gray-400 hover:text-white transition-colors"
      >
        <MenuIcon className="w-7 h-7" />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
          {title} <span className="text-yellow-400 text-3xl leading-none">.</span>
          {streak > 0 && (
            <div className="ml-2 flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20 animate-pulse">
              <SparklesIcon className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-bold">{streak}</span>
            </div>
          )}
        </h1>
      </div>

      <button 
        onClick={onBellClick}
        className="relative p-1 text-gray-400 hover:text-white transition-colors"
      >
        <BellIcon className="w-7 h-7" />
        {hasNotification && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0c1021]"></span>
        )}
      </button>
    </header>
  );
};

export default TopNav;
