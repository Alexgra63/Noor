import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dua } from '../types';
import { XMarkIcon } from './Icons';

interface SleepModeProps {
  onExit: () => void;
}

const SleepMode: React.FC<SleepModeProps> = ({ onExit }) => {
  const [playlist, setPlaylist] = useState<Dua[]>([]);
  const [currentDua, setCurrentDua] = useState<Dua | null>(null);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndexRef = useRef(0);

  useEffect(() => {
    fetch('/data/duas.json')
      .then(res => res.json())
      .then(data => {
        const sleepCategory = data.categories.find((c: any) => c.name === 'Before Sleep');
        const sleepDuas = sleepCategory?.duas.filter((d: Dua) => d.audio) || [];
        if (sleepDuas.length > 0) {
          setPlaylist(sleepDuas);
        } else {
          setAudioAvailable(false);
        }
      })
      .catch(err => {
        console.error("Failed to load sleep playlist:", err);
        setAudioAvailable(false);
      });
  }, []);

  const playNextTrack = useCallback(() => {
    if (playlist.length === 0) return;

    if (currentTrackIndexRef.current >= playlist.length) {
      currentTrackIndexRef.current = 0; // Loop playlist
    }
    
    const track = playlist[currentTrackIndexRef.current];
    setCurrentDua(track);
    
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer) {
        audioPlayer.src = track.audio;
        const playPromise = audioPlayer.play();
        if(playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Audio play failed:", e);
                // try next track
                currentTrackIndexRef.current++;
                playNextTrack();
            });
        }
        currentTrackIndexRef.current++;
    }
  }, [playlist]);

  useEffect(() => {
    if (playlist.length === 0) return;

    if (!audioPlayerRef.current) {
        audioPlayerRef.current = document.getElementById('global-audio-player') as HTMLAudioElement;
    }
    
    const audioPlayer = audioPlayerRef.current;
    if(audioPlayer) {
        // Stop any previous audio
        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        audioPlayer.onended = playNextTrack;
        playNextTrack();
    }
    
    return () => {
        if(audioPlayer) {
            audioPlayer.pause();
            audioPlayer.onended = null;
        }
    }
  }, [playNextTrack, playlist]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0c1021] to-[#1b1b2f] flex flex-col items-center justify-center p-4 z-50 animate-fade-in">
        <button onClick={onExit} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 bg-white/10 rounded-full">
            <XMarkIcon className="w-6 h-6"/>
        </button>

        <div className="text-center">
            {!audioAvailable ? (
                 <p className="text-xl text-gray-300">Audio for Sleep Mode is not available.</p>
            ) : currentDua ? (
                <div key={currentDua.id} className="animate-fade-in-out">
                    <p className="font-arabic text-5xl md:text-7xl text-white leading-relaxed">
                        {currentDua.arabic}
                    </p>
                    <p className="mt-4 text-xl text-gray-300">{currentDua.translation_en}</p>
                </div>
            ) : (
                <p className="text-xl text-gray-300">Preparing your sleep playlist...</p>
            )}
        </div>
        
        <style>{`
            @keyframes fade-in-out {
                0%, 100% { opacity: 0; transform: scale(0.95); }
                10%, 90% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-out {
                animation: fade-in-out 10s ease-in-out infinite;
            }
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-in-out;
            }
        `}</style>
    </div>
  );
};

export default SleepMode;