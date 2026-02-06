
import React from 'react';
import { MenuIcon, BellIcon } from './Icons';

interface TopNavProps {
  title: string;
  hasNotification?: boolean;
  onBellClick?: () => void;
  onMenuClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ title, hasNotification, onBellClick, onMenuClick }) => {
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
