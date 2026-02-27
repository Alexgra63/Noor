
import React, { useState, useEffect } from 'react';
import { Dua } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { HeartIcon, PlayIcon, ShareIcon } from './Icons';

interface DuaCardProps {
  dua: Dua;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua }) => {
  const [favorites, setFavorites] = useLocalStorage<number[]>('favoriteDuas', []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.includes(dua.id));
  }, [favorites, dua.id]);

  const toggleFavorite = () => {
    setFavorites(prev => 
      isFavorite ? prev.filter(id => id !== dua.id) : [...prev, dua.id]
    );
  };

  const shareDua = async () => {
    const shareText = `Dua: ${dua.arabic}\n\nTranslation: ${dua.translation_en}\n\nShared from Noor App.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Islamic Dua',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const playAudio = () => {
    const audioPlayer = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioPlayer && dua.audio) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      audioPlayer.src = dua.audio;
      audioPlayer.play().catch(console.error);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 shadow-lg space-y-4 animate-fade-in relative">
      {showCopyFeedback && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold z-20">
          Copied!
        </div>
      )}

      <p className="font-arabic text-2xl text-right leading-relaxed text-white">{dua.arabic}</p>
      
      <div className="pt-2 space-y-2">
        <p className="text-gray-400 italic text-sm">{dua.transliteration}</p>
        <p className="text-gray-200 text-sm">"{dua.translation_en}"</p>
      </div>

      <div className="flex justify-center space-x-3 pt-4 border-t border-gray-700/50">
        {dua.audio && (
          <button onClick={playAudio} className="p-2 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20">
            <PlayIcon className="w-4 h-4"/>
          </button>
        )}
        <button 
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isFavorite ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-700/50 text-gray-300'}`}
        >
          <HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`}/>
          <span className="text-xs font-bold">{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
        <button onClick={shareDua} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-full hover:bg-indigo-500/20">
          <ShareIcon className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
};

export default DuaCard;
