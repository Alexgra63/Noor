
import React from 'react';
import { AppView } from '../types';
import { HomeIcon, ZikrIcon, JournalIcon, AmeenIcon, CategoryIcon } from './Icons';

interface BottomNavProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: AppView;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 group"
  >
    {/* Active Glow Effect */}
    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-12 h-12 bg-yellow-400/10 blur-xl rounded-full"></div>
    </div>

    {/* Icon Wrapper */}
    <div className={`relative z-10 transition-all duration-300 ${isActive ? '-translate-y-1.5' : 'group-hover:-translate-y-1'}`}>
      <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
    </div>

    {/* Label */}
    <span className={`relative z-10 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-yellow-400 opacity-100 translate-y-0.5' : 'text-gray-500 opacity-0 translate-y-2 group-hover:opacity-60 group-hover:translate-y-1'}`}>
      {label}
    </span>

    {/* Active Dot */}
    {isActive && (
      <div className="absolute bottom-1 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse"></div>
    )}
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { icon: HomeIcon, label: AppView.Home },
    { icon: ZikrIcon, label: AppView.Zikr },
    { icon: JournalIcon, label: AppView.Journal },
    { icon: AmeenIcon, label: AppView.Ameen },
    { icon: CategoryIcon, label: AppView.Categories },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-40">
      <nav className="h-16 bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] px-4 overflow-hidden">
        <div className="flex justify-between items-center h-full relative">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.label}
              onClick={() => setActiveView(item.label)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
