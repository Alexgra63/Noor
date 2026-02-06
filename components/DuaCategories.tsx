
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DuaCategory, Dua } from '../types';
import DuaCard from './DuaCard';
import { 
    PlayIcon, 
    SunIcon, 
    CloudIcon, 
    ShieldCheckIcon, 
    SparklesIcon, 
    BriefcaseIcon, 
    GlobeAltIcon, 
    LeafIcon, 
    GiftIcon, 
    HeartIcon, 
    MoonIcon, 
    CategoryIcon 
} from './Icons';

const DuaCategories: React.FC = () => {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<Dua[]>([]);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    fetch('/data/duas.json')
        .then(res => res.json())
        .then(data => {
            setCategories(data.categories);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Failed to load categories:", err);
            setIsLoading(false);
        });
  }, []);

  const getCategoryIcon = (name: string) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes("morning")) return SunIcon;
      if (lowerName.includes("forgiveness")) return CloudIcon;
      if (lowerName.includes("protection")) return ShieldCheckIcon;
      if (lowerName.includes("gratitude")) return GiftIcon;
      if (lowerName.includes("zikr")) return SparklesIcon;
      if (lowerName.includes("stress")) return HeartIcon;
      if (lowerName.includes("health")) return LeafIcon;
      if (lowerName.includes("rizq")) return BriefcaseIcon;
      if (lowerName.includes("travel")) return GlobeAltIcon;
      if (lowerName.includes("death")) return MoonIcon;
      if (lowerName.includes("sleep")) return MoonIcon;
      return CategoryIcon;
  };

  const handlePlayAll = useCallback(() => {
    const validPlaylist = selectedCategory?.duas.filter(d => d.audio) || [];
    if (!validPlaylist.length) return;

    playlistRef.current = validPlaylist;
    currentTrackIndexRef.current = 0;
    
    if (!audioPlayerRef.current) {
        audioPlayerRef.current = document.getElementById('global-audio-player') as HTMLAudioElement;
    }

    const audioPlayer = audioPlayerRef.current;
    if (!audioPlayer) return;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    const playNextTrack = () => {
        if (currentTrackIndexRef.current >= playlistRef.current.length) {
            audioPlayer.onended = null; // Playlist finished
            return;
        }
        const track = playlistRef.current[currentTrackIndexRef.current];
        audioPlayer.src = track.audio;
        const playPromise = audioPlayer.play();
        if(playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Playlist audio error:", e);
                currentTrackIndexRef.current++;
                playNextTrack(); // Skip to next track on error
            });
        }
        currentTrackIndexRef.current++;
    };
    
    audioPlayer.onended = playNextTrack;
    playNextTrack();
  }, [selectedCategory]);


  if (selectedCategory) {
    const hasAudio = selectedCategory.duas.some(d => d.audio);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
            <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-400/20">
                  <span className="text-lg">←</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Library</span>
            </button>
            <h1 className="text-lg font-bold text-center text-white truncate max-w-[200px]">{selectedCategory.name}</h1>
            <div className="w-12"></div>
        </div>
        
        <button
            onClick={handlePlayAll}
            disabled={!hasAudio}
            className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-white px-6 py-5 rounded-[2rem] hover:bg-yellow-400/10 transition-all border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-black/20 group"
        >
            <div className="p-2 bg-yellow-400 rounded-xl text-gray-900 shadow-lg shadow-yellow-400/20 group-hover:scale-110 transition-transform">
              <PlayIcon className="w-5 h-5"/>
            </div>
            <span className="font-bold tracking-tight">{hasAudio ? 'Play All Recitations' : 'Audio Unavailable'}</span>
        </button>

        <div className="space-y-6">
          {selectedCategory.duas.map(dua => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dua <span className="text-yellow-400">Library</span></h1>
        <p className="text-gray-500 text-sm font-medium">Curated collections for your spiritual growth.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-yellow-400/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Loading Collections</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const cleanName = category.name.replace(/^[^\w\s]+/, '').trim();
            const emoji = category.name.match(/^[^\w\s]+/);
            return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category)}
                  className="relative group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all duration-500 text-left flex flex-col items-center text-center overflow-hidden hover:bg-white/[0.07] hover:-translate-y-1 active:scale-95"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400/5 blur-3xl rounded-full group-hover:bg-yellow-400/10 transition-colors"></div>
                  
                  <div className="relative mb-6 p-5 bg-[#0c1021]/80 rounded-[1.5rem] shadow-inner border border-white/10 text-yellow-400 group-hover:text-yellow-300 transition-all group-hover:scale-110 shadow-xl">
                    <Icon className="w-10 h-10" />
                  </div>
                  
                  <h2 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors tracking-tight leading-snug">
                    {cleanName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{category.duas.length} Items</span>
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                    <span className="text-xs">{emoji}</span>
                  </div>
                </button>
            );
          })}
        </div>
      )}
      
      <div className="py-12 text-center opacity-30">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-medium italic">Seek & You Shall Find</p>
      </div>
    </div>
  );
};

export default DuaCategories;