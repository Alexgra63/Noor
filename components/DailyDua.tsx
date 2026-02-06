
import React, { useState, useEffect } from 'react';
import { Dua } from '../types';
import DuaCard from './DuaCard';
import { MoonIcon, SearchIcon, XMarkIcon, SparklesIcon, CompassIcon } from './Icons';
import { GoogleGenAI, Type } from "@google/genai";
import { duaData } from '../data/duas';

interface DailyDuaProps {
  onEnterSleepMode: () => void;
}

const DailyDua: React.FC<DailyDuaProps> = ({ onEnterSleepMode }) => {
  const [dailyDua, setDailyDua] = useState<Dua | null>(null);
  const [allDuas, setAllDuas] = useState<Dua[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDuaModalOpen, setIsDuaModalOpen] = useState(false);
  
  // AI Compass State
  const [moodInput, setMoodInput] = useState('');
  const [isCompassLoading, setIsCompassLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{reflection: string, suggestedDuaId: number} | null>(null);
  const [showCompassModal, setShowCompassModal] = useState(false);

  useEffect(() => {
    // Correctly loading from the bundled TS data to avoid resolution errors on Vercel
    const loadedDuas = duaData.categories.flatMap((category) => category.duas);
    setAllDuas(loadedDuas);
  }, []);

  useEffect(() => {
    if (allDuas.length === 0) return;

    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const storedDuaId = localStorage.getItem('dailyDuaId');
    
    let duaToSet: Dua | null = null;

    if (lastVisitDate === today && storedDuaId) {
      duaToSet = allDuas.find(d => d.id === parseInt(storedDuaId)) || null;
    } 
    
    if (!duaToSet) {
      const randomIndex = Math.floor(Math.random() * allDuas.length);
      duaToSet = allDuas[randomIndex];
      localStorage.setItem('dailyDuaId', String(duaToSet.id));
      localStorage.setItem('lastVisitDate', today);
    }

    setDailyDua(duaToSet);
  }, [allDuas]);

  const handleCompassSearch = async () => {
    if (!moodInput.trim()) return;
    setIsCompassLoading(true);
    setAiRecommendation(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const duaContext = allDuas.map(d => ({id: d.id, title: d.translation_en})).slice(0, 50);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user says: "${moodInput}". Based on the following list of Islamic Duas, pick the best one by ID and provide a short, 2-sentence spiritual reflection.
        Library: ${JSON.stringify(duaContext)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reflection: { type: Type.STRING },
              suggestedDuaId: { type: Type.NUMBER }
            },
            required: ["reflection", "suggestedDuaId"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      setAiRecommendation(result);
      setShowCompassModal(true);
    } catch (error) {
      console.error("AI Compass failed:", error);
      alert("The spiritual compass is recalibrating. Please try again in a moment.");
    } finally {
      setIsCompassLoading(false);
    }
  };

  const filteredDuas = allDuas.filter(dua => {
      const query = searchQuery.toLowerCase();
      return (
          dua.translation_en.toLowerCase().includes(query) ||
          dua.transliteration.toLowerCase().includes(query) ||
          dua.arabic.includes(query) ||
          dua.translation_ur.includes(query)
      );
  });

  const recommendedDua = aiRecommendation ? allDuas.find(d => d.id === aiRecommendation.suggestedDuaId) : null;

  return (
    <div className="space-y-6">
        <div className="py-2">
            <h2 className="text-3xl font-bold text-white leading-tight">
                Welcome to <br /> 
                <span className="text-yellow-400">Your Sanctuary</span>
            </h2>
        </div>

        {/* Spiritual Compass UI */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 border border-white/5 rounded-[2rem] p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400">
                    <CompassIcon className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Spiritual Compass</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">How is your heart today?</p>
                </div>
            </div>
            <div className="relative">
                <input 
                  type="text" 
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="e.g. I am feeling very overwhelmed"
                  className="w-full bg-[#0c1021]/60 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400/30"
                />
                <button 
                  onClick={handleCompassSearch}
                  disabled={isCompassLoading}
                  className="absolute right-2 top-2 p-1.5 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  {isCompassLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                  ) : (
                    <SparklesIcon className="w-5 h-5"/>
                  )}
                </button>
            </div>
        </div>

        {/* Refined Search Bar */}
        <div className="relative">
            <input
                type="text"
                className="block w-full pl-6 pr-12 py-4 border-0 rounded-2xl bg-[#1b1b2f] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/30 transition-all duration-300 shadow-lg"
                placeholder="Search Duas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <SearchIcon className="w-5 h-5 text-gray-500" />
                )}
            </div>
        </div>
      
      {searchQuery ? (
          <div className="space-y-4 animate-fade-in">
             {filteredDuas.map(dua => (
                 <DuaCard key={dua.id} dua={dua} />
             ))}
             {filteredDuas.length === 0 && (
                 <div className="text-center text-gray-500 py-10">No results found</div>
             )}
          </div>
      ) : (
          <>
            {/* Daily Feature Card */}
            <div 
              onClick={() => setIsDuaModalOpen(true)}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-64 w-full flex items-end group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b2f] to-[#0c1021] z-0"></div>
                
                <div className="relative z-10 p-8 w-full flex flex-col justify-end">
                   <h3 className="text-2xl font-bold text-white mb-3">Dua of the Day</h3>
                   
                   {dailyDua && (
                       <div className="bg-[#0c1021]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                           <p className="text-gray-300 text-sm line-clamp-2 italic">"{dailyDua.translation_en}"</p>
                       </div>
                   )}
                </div>
            </div>

            <button
                onClick={onEnterSleepMode}
                className="w-full flex items-center justify-between bg-white/5 backdrop-blur-sm text-gray-100 px-6 py-6 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <MoonIcon className="w-6 h-6"/>
                    </div>
                    <span className="text-lg font-bold">Sleep Mode</span>
                </div>
                <div className="text-gray-500 group-hover:text-white">→</div>
            </button>
          </>
      )}

      {/* AI Result Modal */}
      {showCompassModal && recommendedDua && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in" onClick={() => setShowCompassModal(false)}>
           <div className="relative w-full max-w-md bg-[#0c1021] border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-yellow-400">A Reflection for You</h2>
              <p className="text-gray-200 italic">"{aiRecommendation?.reflection}"</p>
              <div className="border-t border-white/10 pt-6">
                <DuaCard dua={recommendedDua} />
              </div>
              <button onClick={() => setShowCompassModal(false)} className="w-full bg-yellow-400 text-gray-900 py-3 rounded-2xl font-bold">Close</button>
           </div>
        </div>
      )}

      {/* Dua Modal for Daily Dua */}
      {isDuaModalOpen && dailyDua && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in" onClick={() => setIsDuaModalOpen(false)}>
           <div className="relative w-full max-w-md bg-[#0c1021] border border-white/10 rounded-[3rem] p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsDuaModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 text-gray-400 hover:text-white rounded-full">
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="pt-6">
                <DuaCard dua={dailyDua} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DailyDua;
