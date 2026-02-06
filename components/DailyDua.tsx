
import React, { useState, useEffect } from 'react';
import { Dua } from '../types';
import DuaCard from './DuaCard';
import { MoonIcon, SearchIcon, XMarkIcon, SparklesIcon } from './Icons';
import { duaData } from '../data/duas';

interface DailyDuaProps {
  onEnterSleepMode: () => void;
}

const DailyDua: React.FC<DailyDuaProps> = ({ onEnterSleepMode }) => {
  const [dailyDua, setDailyDua] = useState<Dua | null>(null);
  const [allDuas, setAllDuas] = useState<Dua[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDuaModalOpen, setIsDuaModalOpen] = useState(false);

  useEffect(() => {
    // Loading from bundled TS data
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

  const filteredDuas = allDuas.filter(dua => {
      const query = searchQuery.toLowerCase();
      return (
          dua.translation_en.toLowerCase().includes(query) ||
          dua.transliteration.toLowerCase().includes(query) ||
          dua.arabic.includes(query) ||
          dua.translation_ur.includes(query)
      );
  });

  return (
    <div className="space-y-8">
        <div className="py-2">
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                Welcome to <br /> 
                <span className="text-yellow-400">Your Sanctuary</span>
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-medium mt-2">Nourish your soul today</p>
        </div>

        {/* Refined Search Bar */}
        <div className="relative group">
            <input
                type="text"
                className="block w-full pl-6 pr-12 py-5 border border-white/5 rounded-[2rem] bg-[#1b1b2f] text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400/20 transition-all duration-500 shadow-2xl"
                placeholder="Search Duas by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <SearchIcon className="w-5 h-5 text-gray-600 group-focus-within:text-yellow-400/50 transition-colors" />
                )}
            </div>
        </div>
      
      {searchQuery ? (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center px-1">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Found {filteredDuas.length} Results</span>
             </div>
             {filteredDuas.map(dua => (
                 <DuaCard key={dua.id} dua={dua} />
             ))}
             {filteredDuas.length === 0 && (
                 <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5">
                   <p className="text-gray-500 italic">No Duas found matching your search</p>
                 </div>
             )}
          </div>
      ) : (
          <>
            {/* Daily Feature Card - Improved UI */}
            <div 
              onClick={() => setIsDuaModalOpen(true)}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[320px] w-full flex flex-col group cursor-pointer transition-all duration-700 hover:shadow-yellow-400/5"
            >
                {/* Background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b2f] via-[#0c1021] to-[#0c1021] z-0"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full group-hover:bg-yellow-400/10 transition-all duration-700"></div>
                
                <div className="relative z-10 p-8 h-full flex flex-col">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-px bg-yellow-400/40"></span>
                        <span className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.4em]">Daily Noor</span>
                      </div>
                      <div className="p-2 bg-yellow-400/10 rounded-xl text-yellow-400 group-hover:rotate-12 transition-transform duration-500">
                        <SparklesIcon className="w-4 h-4" />
                      </div>
                   </div>

                   <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Dua of the Day</h3>
                   
                   {dailyDua && (
                       <div className="flex-grow flex flex-col justify-center space-y-6">
                           <p className="font-arabic text-4xl text-right leading-relaxed text-white drop-shadow-sm group-hover:text-yellow-400/90 transition-colors duration-500">
                             {dailyDua.arabic}
                           </p>
                           <div className="bg-[#0c1021]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 group-hover:border-yellow-400/20 transition-all duration-500">
                               <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-2">
                                 "{dailyDua.translation_en}"
                               </p>
                           </div>
                           <div className="flex justify-end pt-2">
                             <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest group-hover:text-yellow-400/50 transition-colors">Tap to read full reflection</span>
                           </div>
                       </div>
                   )}
                </div>
            </div>

            <button
                onClick={onEnterSleepMode}
                className="w-full flex items-center justify-between bg-white/5 backdrop-blur-sm text-gray-100 px-8 py-8 rounded-[2.5rem] border border-white/5 group hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-500 shadow-xl"
            >
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                        <MoonIcon className="w-8 h-8"/>
                    </div>
                    <div className="text-left">
                      <span className="block text-xl font-black tracking-tight">Sleep Mode</span>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Ambient Recitations</span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </button>
          </>
      )}

      {/* Dua Modal for Daily Dua */}
      {isDuaModalOpen && dailyDua && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in" onClick={() => setIsDuaModalOpen(false)}>
           <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsDuaModalOpen(false)} className="absolute -top-12 right-0 p-2 text-gray-500 hover:text-white transition-colors">
                <XMarkIcon className="w-8 h-8" />
              </button>
              <DuaCard dua={dailyDua} />
           </div>
        </div>
      )}
    </div>
  );
};

export default DailyDua;
