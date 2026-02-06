
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { JournalEntry } from '../types';
import { CheckCircleIcon, PlusCircleIcon, XMarkIcon } from './Icons';

const DuaJournal: React.FC = () => {
  const [journal, setJournal] = useLocalStorage<JournalEntry[]>('duaJournal', []);
  const [activeTab, setActiveTab] = useState<'pending' | 'answered'>('pending');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/quotes.json')
      .then(res => res.json())
      .then(data => setQuotes(data.quotes))
      .catch(err => console.error("Failed to load quotes:", err));
  }, []);

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
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setReflection(quotes[randomIndex]);
  };
  
  const deleteEntry = (id: string) => {
    setJournal(prev => prev.filter(entry => entry.id !== id));
  };

  const filteredEntries = journal.filter(entry => entry.status === activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">My Dua Journal</h1>
      
      {reflection && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setReflection(null)}>
          <div className="bg-gray-800 border border-yellow-400/50 rounded-2xl p-6 text-center max-w-sm" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-yellow-400 mb-2">💭 Reflect on this</p>
            <p className="text-lg text-white">"{reflection}"</p>
            <button onClick={() => setReflection(null)} className="mt-4 bg-yellow-400/20 text-yellow-300 px-4 py-1 rounded-full text-sm">Close</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <form onSubmit={addEntry} className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-lg border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-semibold text-white">New Dua Entry</h2>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Dua Title" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Pour your heart out..." rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg">Save</button>
                </div>
            </form>
        </div>
      )}

      <div className="flex justify-between items-center">
          <div className="flex bg-gray-800/60 rounded-full p-1">
            <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === 'pending' ? 'bg-yellow-400 text-gray-900 font-semibold' : 'text-gray-300'}`}>My Duas</button>
            <button onClick={() => setActiveTab('answered')} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === 'answered' ? 'bg-green-400 text-gray-900 font-semibold' : 'text-gray-300'}`}>Blessings</button>
          </div>
          <button onClick={showReflection} className="text-sm text-yellow-300 hover:underline">💭 Reflect</button>
      </div>

      <div className="space-y-4 min-h-[300px]">
        {filteredEntries.length > 0 ? filteredEntries.map(entry => (
          <div key={entry.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 relative group">
            <h3 className="font-semibold text-white">{entry.title}</h3>
            <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{entry.content}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(entry.createdAt).toLocaleDateString()}</p>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus(entry.id)} className="p-1.5 bg-gray-700 rounded-full text-green-400 hover:bg-gray-600">
                    <CheckCircleIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => deleteEntry(entry.id)} className="p-1.5 bg-gray-700 rounded-full text-red-400 hover:bg-gray-600">
                    <XMarkIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
        )) : <p className="text-center text-gray-500 pt-16">No entries in this section yet.</p>}
      </div>

      <button onClick={() => setShowForm(true)} className="fixed bottom-24 right-4 bg-yellow-400 text-gray-900 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
        <PlusCircleIcon className="w-8 h-8"/>
      </button>
    </div>
  );
};

export default DuaJournal;