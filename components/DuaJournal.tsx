
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { JournalEntry } from '../types';
import { CheckCircleIcon, PlusCircleIcon, XMarkIcon, JournalIcon } from './Icons';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Journal</h1>
        <button onClick={showReflection} className="text-xs text-yellow-400 font-bold uppercase tracking-widest">Reflect</button>
      </div>
      
      {reflection && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setReflection(null)}>
          <div className="bg-gray-800 border border-yellow-400/50 rounded-2xl p-6 text-center max-w-sm">
            <p className="text-white">"{reflection}"</p>
          </div>
        </div>
      )}

      <div className="flex bg-gray-800/60 rounded-full p-1">
        <button onClick={() => setActiveTab('pending')} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500'}`}>My Duas</button>
        <button onClick={() => setActiveTab('answered')} className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'answered' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500'}`}>Blessings</button>
      </div>

      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 relative group">
            <h3 className="font-bold text-white">{entry.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{entry.content}</p>
            <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => toggleStatus(entry.id)} className="text-green-400"><CheckCircleIcon className="w-5 h-5"/></button>
                <button onClick={() => deleteEntry(entry.id)} className="text-red-400"><XMarkIcon className="w-5 h-5"/></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowForm(true)} className="fixed bottom-28 right-6 bg-yellow-400 text-gray-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl z-40">
        <PlusCircleIcon className="w-8 h-8"/>
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
            <form onSubmit={addEntry} className="bg-gray-900 p-8 rounded-[2rem] w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white">New Entry</h2>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-gray-800 border-0 rounded-xl px-4 py-3 text-white" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" rows={4} className="w-full bg-gray-800 border-0 rounded-xl px-4 py-3 text-white"></textarea>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-400">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl">Save</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default DuaJournal;
