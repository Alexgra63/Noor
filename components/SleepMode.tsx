
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dua } from '../types';
import { XMarkIcon } from './Icons';
import { duaData } from '../data/duas';

interface SleepModeProps {
  onExit: () => void;
}

const SleepMode: React.FC<SleepModeProps> = ({ onExit }) => {
  const [playlist, setPlaylist] = useState<Dua[]>([]);
  const [currentDua, setCurrentDua] = useState<Dua | null>(null);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    const sleepCategory = duaData.categories.find((c: any) => c.name.toLowerCase().includes('sleep'));
    const sleepDuas = sleepCategory?.duas || [];
    setPlaylist(sleepDuas);
  }, []);

  const playNextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    if (currentTrackIndexRef.current >= playlist.length) {
      currentTrackIndexRef.current = 0;
    }
    setCurrentDua(playlist[currentTrackIndexRef.current]);
    currentTrackIndexRef.current++;
  }, [playlist]);

  useEffect(() => {
    if (playlist.length === 0) return;
    playNextTrack();
    const interval = setInterval(playNextTrack, 10000);
    return () => clearInterval(interval);
  }, [playNextTrack, playlist]);

  return (
    <div className="fixed inset-0 bg-[#0c1021] flex flex-col items-center justify-center p-8 z-50">
        <button onClick={onExit} className="absolute top-6 right-6 text-gray-500 hover:text-white p-3 bg-white/5 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6"/>
        </button>
        <div className="text-center max-w-lg space-y-12 animate-fade-in">
            {currentDua && (
                <>
                    <p className="font-arabic text-5xl md:text-7xl text-white leading-relaxed">{currentDua.arabic}</p>
                    <p className="text-xl md:text-2xl text-gray-400 italic">"{currentDua.translation_en}"</p>
                </>
            )}
        </div>
    </div>
  );
};

export default SleepMode;
