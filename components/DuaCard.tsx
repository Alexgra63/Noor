
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
      // Fallback: Copy to clipboard
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
      audioPlayer.onended = null;
      audioPlayer.src = dua.audio;
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg space-y-6 animate-fade-in relative">
      {showCopyFeedback && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-[10px] font-bold z-20 animate-bounce">
          Copied to Clipboard!
        </div>
      )}

      <div>
        <p className="font-arabic text-3xl text-right leading-relaxed text-white">{dua.arabic}</p>
      </div>
      
      <div className="border-t border-gray-700/50 pt-4 space-y-4">
        <p className="text-gray-300 italic">{dua.transliteration}</p>
        <p className="text-gray-200">"{dua.translation_en}"</p>
        <p className="text-right text-gray-300" dir="rtl">{dua.translation_ur}</p>
      </div>

      <p className="text-center text-xs text-yellow-400 opacity-80 pt-2">✨ Read meaningfully</p>

      <div className="flex justify-center space-x-3 pt-4">
        {dua.audio && (
          <button 
            onClick={playAudio}
            className="flex items-center justify-center p-3 bg-yellow-400/20 text-yellow-300 rounded-full hover:bg-yellow-400/30 transition-all duration-300 transform hover:scale-110"
            title="Listen"
          >
            <PlayIcon className="w-5 h-5"/>
          </button>
        )}
        <button 
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
            isFavorite 
              ? 'bg-pink-500/20 text-pink-400' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
          }`}
        >
          <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}/>
          <span className="text-sm font-medium">{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>
        <button 
          onClick={shareDua}
          className="flex items-center justify-center p-3 bg-indigo-500/20 text-indigo-400 rounded-full hover:bg-indigo-500/30 transition-all duration-300 transform hover:scale-110"
          title="Share"
        >
          <ShareIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

export default DuaCard;
