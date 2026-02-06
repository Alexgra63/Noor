
import React, { useState, useEffect } from 'react';
// FIX: Removed 'Type' as it's not exported from '../types'.
import { Dua } from '../types';
import DuaCard from './DuaCard';
import { MoonIcon, SearchIcon, XMarkIcon, SparklesIcon, CompassIcon } from './Icons';
// FIX: Imported 'Type' from '@google/genai' to use in responseSchema.
import { GoogleGenAI, Type } from "@google/genai";

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
    fetch('/data/duas.json')
      .then(res => res.json())
      .then(data => {
        const loadedDuas = data.categories.flatMap((category: any) => category.duas);
        setAllDuas(loadedDuas);
      })
      .catch(err => console.error("Failed to load duas:", err));
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
      const duaContext = allDuas.map(d => ({id: d.id, title: d.translation_en})).slice(0, 50); // Send subset for context
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am feeling: "${moodInput}". Based on the following list of Islamic Duas, pick the best one by ID and provide a short, 2-sentence empathetic spiritual reflection.
        Library: ${JSON.stringify(duaContext)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            // FIX: Replaced string literals and 'any' casts with the 'Type' enum from @google/genai.
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
      console.error("AI Guide failed:", error);
      alert("Spiritual Guide is taking a moment to reflect. Please try again.");
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
        {/* Intro Message */}
        <div className="py-2">
            <h2 className="text-3xl font-bold text-white leading-tight">
                Let's find your perfect <br /> 
                <span className="text-yellow-400">Dua for you!</span>
            </h2>
        </div>

        {/* AI Compass Mini-Widget */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-yellow-900/10 border border-white/5 rounded-[2rem] p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400">
                    <CompassIcon className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Spiritual Compass</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">AI Guided Suggestions</p>
                </div>
            </div>
            <div className="relative">
                <input 
                  type="text" 
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="How is your heart today? (e.g. I'm feeling anxious)"
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

        {/* Search Bar - Removed Left Icon */}
        <div className="relative">
            <input
                type="text"
                className="block w-full pl-6 pr-12 py-4 border-0 rounded-2xl bg-[#1b1b2f] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/30 transition-all duration-300 shadow-lg"
                placeholder="Search for Dua, category or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-white/5">
                    <SearchIcon className="w-4 h-4 text-gray-500" />
                  </div>
                )}
            </div>
        </div>
      
      {searchQuery ? (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center ml-1">
               <p className="text-sm text-gray-400 font-medium">Found {filteredDuas.length} results</p>
               <button onClick={() => setSearchQuery('')} className="text-xs text-yellow-400/60 uppercase tracking-widest font-bold">Clear All</button>
             </div>
             {filteredDuas.map(dua => (
                 <DuaCard key={dua.id} dua={dua} />
             ))}
             {filteredDuas.length === 0 && (
                 <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                     <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
                     <p>No Duas found matching "{searchQuery}"</p>
                 </div>
             )}
          </div>
      ) : (
          <>
            {/* Quick Filters */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                    <span>Quick filters</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['Morning', 'Protection', 'Anxiety', 'Gratitude', 'Rizq', 'Travel'].map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => setSearchQuery(tag)}
                          className="px-5 py-2 bg-[#1b1b2f] rounded-xl text-xs text-gray-300 border border-white/5 flex-shrink-0 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition-all active:scale-95"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Banner */}
            <div 
              onClick={() => setIsDuaModalOpen(true)}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-64 w-full flex items-end group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b2f] to-[#0c1021] z-0"></div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-colors"></div>
                
                <div className="relative z-10 p-8 w-full flex flex-col justify-end">
                   <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-400 text-gray-900 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">DAILY NOOR</span>
                        <span className="text-gray-500 text-xs font-medium">Spiritual Nourishment</span>
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-3">Dua of the Day</h3>
                   
                   {dailyDua && (
                       <div className="bg-[#0c1021]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 group-hover:border-yellow-400/30 transition-all transform group-hover:-translate-y-1">
                           <p className="text-gray-300 text-sm line-clamp-2 italic leading-relaxed mb-3">"{dailyDua.translation_en}"</p>
                           <div className="flex justify-between items-center">
                               <span className="text-[10px] text-yellow-400 uppercase font-black tracking-[0.2em]">Read full reflection</span>
                               <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 shadow-lg shadow-yellow-400/20 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                               </div>
                           </div>
                       </div>
                   )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={onEnterSleepMode}
                    className="w-full flex items-center justify-between bg-white/5 backdrop-blur-sm text-gray-100 px-6 py-6 rounded-[2rem] border border-white/5 group hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-500"
                >
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform shadow-inner shadow-indigo-500/10">
                            <MoonIcon className="w-7 h-7"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-base font-bold text-white">Sleep Mode</span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-medium">Night Recitations</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                </button>
            </div>
          </>
      )}

      {/* AI Compass Result Modal */}
      {showCompassModal && aiRecommendation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in" onClick={() => setShowCompassModal(false)}>
           <div className="relative w-full max-w-md bg-[#0c1021] border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowCompassModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 text-gray-400 hover:text-white rounded-full">
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="text-center space-y-3">
                <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em]">AI Reflection</span>
                <p className="text-white text-lg font-medium leading-relaxed italic">"{aiRecommendation.reflection}"</p>
              </div>

              <div className="border-t border-white/5 pt-8">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] block text-center mb-6">Suggested Remembrance</span>
                {recommendedDua ? (
                  <DuaCard dua={recommendedDua} />
                ) : (
                  <p className="text-center text-gray-500 italic">Finding the perfect words for you...</p>
                )}
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setShowCompassModal(false)}
                  className="bg-white/5 text-gray-400 px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors text-xs font-bold"
                >
                  Close Compass
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Full Dua Modal */}
      {isDuaModalOpen && dailyDua && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-fade-in" onClick={() => setIsDuaModalOpen(false)}>
           <div className="relative w-full max-w-md bg-[#0c1021] border border-white/10 rounded-[3rem] p-10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsDuaModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 text-gray-400 hover:text-white rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-1 w-16 bg-yellow-400/20 rounded-full"></div>
                </div>
                <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em]">Reflect Meaningfully</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dua of the Day</h2>
              </div>

              <div className="space-y-12">
                <p className="font-arabic text-5xl text-right leading-[1.8] text-white py-4">{dailyDua.arabic}</p>
                <div className="space-y-6 border-t border-white/5 pt-10 text-center">
                  <p className="text-gray-500 italic text-sm leading-relaxed px-4">"{dailyDua.transliteration}"</p>
                  <p className="text-white text-xl font-semibold leading-snug">"{dailyDua.translation_en}"</p>
                  <p className="text-gray-400 text-xl leading-relaxed mt-4 font-arabic" dir="rtl">{dailyDua.translation_ur}</p>
                </div>
              </div>

              <div className="pt-8 flex justify-center">
                <button 
                  onClick={() => setIsDuaModalOpen(false)}
                  className="bg-yellow-400 text-gray-900 font-black px-12 py-4 rounded-[1.5rem] hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 uppercase text-xs tracking-widest"
                >
                  Done
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DailyDua;
