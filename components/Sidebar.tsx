
import React, { useState } from 'react';
import { XMarkIcon, ShieldCheckIcon, SparklesIcon, GlobeAltIcon, BellIcon, MoonIcon, HeartIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [activeSubView, setActiveSubView] = useState<'menu' | 'settings' | 'features' | 'about'>('menu');

  const renderContent = () => {
    switch (activeSubView) {
      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setActiveSubView('menu')} className="text-yellow-400 text-sm mb-4">← Back to Menu</button>
            <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-gray-300">Push Notifications</span>
                <div className="w-10 h-5 bg-yellow-400 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-gray-300">Dark Mode</span>
                <div className="w-10 h-5 bg-yellow-400 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <span className="text-gray-300 block mb-2">Language</span>
                <select className="w-full bg-transparent text-yellow-400 outline-none">
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setActiveSubView('menu')} className="text-yellow-400 text-sm mb-4">← Back to Menu</button>
            <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-300 text-sm">
                <SparklesIcon className="w-5 h-5 text-yellow-400 shrink-0" />
                <span><b>Daily Reminders:</b> Contextual Duas based on time of day.</span>
              </li>
              <li className="flex gap-3 text-gray-300 text-sm">
                <MoonIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                <span><b>Sleep Mode:</b> Calm recitations for a peaceful night.</span>
              </li>
              <li className="flex gap-3 text-gray-300 text-sm">
                <HeartIcon className="w-5 h-5 text-pink-400 shrink-0" />
                <span><b>Dua Journal:</b> Track your personal conversations with Allah.</span>
              </li>
              <li className="flex gap-3 text-gray-300 text-sm">
                <GlobeAltIcon className="w-5 h-5 text-green-400 shrink-0" />
                <span><b>Ameen Wall:</b> Community support through shared prayers.</span>
              </li>
            </ul>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setActiveSubView('menu')} className="text-yellow-400 text-sm mb-4">← Back to Menu</button>
            <h3 className="text-xl font-bold text-white mb-4">About Noor</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Noor was created to be a digital sanctuary. Our mission is to provide a clean, distraction-free environment for spiritual growth and remembrance.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Designed with love and peace in mind, Noor works 100% offline to ensure your connection with the Divine is never interrupted.
            </p>
            <div className="pt-4">
              <p className="text-xs text-yellow-400/60">Crafted with gratitude • 2025</p>
            </div>
          </div>
        );
      default:
        return (
          <nav className="space-y-4 flex-grow">
            <button 
              onClick={() => setActiveSubView('settings')}
              className="w-full flex items-center gap-4 text-gray-300 hover:text-yellow-400 transition-colors group p-3 rounded-2xl hover:bg-white/5"
            >
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-yellow-400/10 transition-colors">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <span className="font-medium">Settings</span>
            </button>
            <button 
              onClick={() => setActiveSubView('features')}
              className="w-full flex items-center gap-4 text-gray-300 hover:text-yellow-400 transition-colors group p-3 rounded-2xl hover:bg-white/5"
            >
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-yellow-400/10 transition-colors">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <span className="font-medium">Features</span>
            </button>
            <button 
              onClick={() => setActiveSubView('about')}
              className="w-full flex items-center gap-4 text-gray-300 hover:text-yellow-400 transition-colors group p-3 rounded-2xl hover:bg-white/5"
            >
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-yellow-400/10 transition-colors">
                <GlobeAltIcon className="w-5 h-5" />
              </div>
              <span className="font-medium">About App</span>
            </button>
          </nav>
        );
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#0c1021] z-[60] shadow-2xl transform transition-transform duration-500 ease-out border-r border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tighter">Noor <span className="text-yellow-400">.</span></h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-1">Peace & Simplicity</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar">
            {renderContent()}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-xs text-indigo-200 font-medium">Offline Mode: Active</span>
            </div>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center mt-6">Version 2.0.4 • 2025</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;