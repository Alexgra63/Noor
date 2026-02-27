
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { JournalEntry } from '../types';
import { CheckCircleIcon, PlusCircleIcon, XMarkIcon, JournalIcon, SparklesIcon } from './Icons';
import { quotesData } from '../data/quotes';

const DuaJournal: React.FC = () => {
  const [journal, setJournal] = useLocalStorage<JournalEntry[]>('duaJournal', []);
  const [activeTab, setActiveTab] = useState<'pending' | 'answered'>('pending');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const newEntry: JournalEntry = {
      id: new Date().toISOString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setJournal(prev => [newEntry, ...prev]);
    setTitle('');
    setContent('');
    setShowForm(false);
  };
  
  const toggleStatus = (id: string) => {
    setJournal(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, status: entry.status === 'pending' ? 'answered' : 'pending' } : entry
      )
    );
  };

  const showReflection = () => {
    const randomIndex = Math.floor(Math.random() * quotesData.quotes.length);
    setReflection(quotesData.quotes[randomIndex]);
  };
  
  const deleteEntry = (id: string) => {
    setJournal(prev => prev.filter(entry => entry.id !== id));
  };

  const filteredEntries = journal.filter(entry => entry.status === activeTab);

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black text-white tracking-tight">My <span className="text-yellow-400">Journal</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-medium mt-1">Sacred Conversations</p>
        </div>
        <button 
            onClick={showReflection} 
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-400/20 hover:bg-yellow-400/20 transition-all active:scale-95"
        >
            <SparklesIcon className="w-3 h-3" />
            Reflection
        </button>
      </div>
      
      {reflection && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-8 animate-fade-in" onClick={() => setReflection(null)}>
          <div className="relative text-center max-w-sm space-y-6" onClick={e => e.stopPropagation()}>
            <div className="text-yellow-400 flex justify-center">
                <SparklesIcon className="w-12 h-12 opacity-40 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-white leading-snug">"{reflection}"</p>
            <button onClick={() => setReflection(null)} className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Dismiss</button>
          </div>
        </div>
      )}

      <div className="flex bg-[#1b1b2f] rounded-[2rem] p-1.5 shadow-inner border border-white/5">
        <button 
            onClick={() => setActiveTab('pending')} 
            className={`flex-1 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'pending' ? 'bg-[#0c1021] text-yellow-400 shadow-xl border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
            Active Duas
        </button>
        <button 
            onClick={() => setActiveTab('answered')} 
            className={`flex-1 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'answered' ? 'bg-[#0c1021] text-emerald-400 shadow-xl border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
        >
            Blessings
        </button>
      </div>

      <div className="space-y-6 min-h-[400px]">
        {filteredEntries.length > 0 ? filteredEntries.map(entry => (
          <div 
            key={entry.id} 
            className={`group relative overflow-hidden rounded-[2rem] border border-white/5 transition-all duration-500 hover:shadow-2xl ${activeTab === 'answered' ? 'bg-gradient-to-br from-emerald-950/20 to-emerald-900/10 hover:border-emerald-500/30' : 'bg-white/5 hover:bg-white/[0.08] hover:border-yellow-400/30'}`}
          >
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-white tracking-tight leading-tight group-hover:text-yellow-400 transition-colors">{entry.title}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 group-hover:text-gray-300 transition-colors">{entry.content}</p>
                
                <div className="pt-4 flex justify-between items-center">
                    <button 
                        onClick={() => toggleStatus(entry.id)} 
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'answered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/20 border border-transparent'}`}
                    >
                        {activeTab === 'answered' ? 'Move to Active' : 'Mark as Blessed'}
                    </button>
                    <button 
                        onClick={() => deleteEntry(entry.id)} 
                        className="p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Decoration */}
            {activeTab === 'answered' && (
                <div className="absolute -bottom-6 -right-6 text-emerald-500/5 rotate-12">
                    <SparklesIcon className="w-24 h-24" />
                </div>
            )}
          </div>
        )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                <div className="mb-6 p-6 bg-white/5 rounded-full">
                    <JournalIcon className="w-12 h-12" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.3em]">Nothing here yet</h4>
                <p className="text-xs max-w-xs mt-2 italic">"{activeTab === 'pending' ? 'Pour your heart out into words.' : 'One day, these Duas will become your testimony.'}"</p>
            </div>
        )}
      </div>

      <button 
        onClick={() => setShowForm(true)} 
        className="fixed bottom-24 right-6 bg-yellow-400 text-gray-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/30 transform hover:scale-110 active:scale-95 transition-all z-40 border-4 border-[#0c1021]"
      >
        <PlusCircleIcon className="w-6 h-6"/>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowForm(false)}>
            <form onSubmit={addEntry} className="bg-[#0c1021] p-6 rounded-[2rem] w-full max-w-md space-y-6 border border-white/5 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">New <span className="text-yellow-400">Entry</span></h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Speak from the heart</p>
                    </div>
                    <button type="button" onClick={() => setShowForm(false)} className="p-2 bg-white/5 text-gray-500 hover:text-white rounded-full">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Subject</label>
                        <input 
                            type="text" 
                            autoFocus
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. For my parents" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-400/50 transition-colors" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Your Conversation</label>
                        <textarea 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            placeholder="O Allah, I ask You..." 
                            rows={6} 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none text-sm leading-relaxed"
                        ></textarea>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full py-4 bg-yellow-400 text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-400/10 hover:bg-yellow-300 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                    Save to Journal
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default DuaJournal;
