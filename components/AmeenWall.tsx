
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AmeenPost } from '../types';
import { SparklesIcon, XMarkIcon } from './Icons';

const AmeenWall: React.FC = () => {
  const [posts, setPosts] = useLocalStorage<AmeenPost[]>('ameenWall', []);
  const [newDua, setNewDua] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.trim()) return;
    const newPost: AmeenPost = {
      id: new Date().toISOString(),
      text: newDua,
      ameenCount: Math.floor(Math.random() * 50) + 1, // Simulate community feel
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
    setNewDua('');
    setIsPosting(false);
  };

  const sayAmeen = (id: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, ameenCount: post.ameenCount + 1 } : post
      )
    );
    // Haptic if supported
    if ('vibrate' in navigator) {
        navigator.vibrate(20);
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Ameen <span className="text-yellow-400">Wall</span></h1>
        <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto">A digital sanctuary where hearts meet in collective prayer. Share a wish, say Ameen.</p>
      </div>
      
      {/* Contribution Bar */}
      <div className="sticky top-20 z-30 px-1">
        <div className={`transition-all duration-500 overflow-hidden ${isPosting ? 'h-[220px] opacity-100 mb-6' : 'h-14 opacity-100 mb-4'}`}>
            {!isPosting ? (
                <button 
                    onClick={() => setIsPosting(true)}
                    className="w-full flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 h-14 rounded-full px-6 group hover:bg-white/[0.08] transition-all shadow-xl shadow-black/40"
                >
                    <span className="text-gray-500 font-medium italic text-sm">Write a collective Dua...</span>
                    <div className="p-2 bg-yellow-400 rounded-full text-gray-900 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                </button>
            ) : (
                <form onSubmit={addPost} className="bg-[#1b1b2f] border border-white/10 rounded-[2rem] p-5 space-y-4 shadow-2xl relative">
                    <button type="button" onClick={() => setIsPosting(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
                    <h4 className="text-[10px] text-yellow-400 font-black uppercase tracking-widest ml-2">Your contribution</h4>
                    <textarea 
                        autoFocus
                        value={newDua}
                        onChange={e => setNewDua(e.target.value)}
                        placeholder="e.g. May Allah ease the pain of all those who are suffering in silence."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-400/30 transition-colors resize-none h-20 text-sm leading-relaxed"
                    ></textarea>
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-yellow-400 text-gray-900 font-black rounded-2xl shadow-lg shadow-yellow-400/20 active:scale-95 uppercase tracking-widest text-[10px]"
                    >
                        Place on Wall
                    </button>
                </form>
            )}
        </div>
      </div>

      <div className="space-y-6">
        {posts.length > 0 ? (
            <div className="columns-1 gap-6 space-y-6">
                {posts.map((post, index) => (
                    <div 
                        key={post.id} 
                        className="break-inside-avoid relative group rounded-[2rem] bg-gradient-to-br from-[#1b1b2f] to-[#0c1021] border border-white/5 p-6 shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-500 animate-fade-in"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <div className="absolute top-4 right-6">
                            <SparklesIcon className="w-6 h-6 text-yellow-400/10 group-hover:text-yellow-400/30 transition-colors" />
                        </div>
                        
                        <p className="text-white text-base leading-relaxed font-medium italic mb-6">"{post.text}"</p>
                        
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-yellow-400/60 uppercase tracking-widest leading-none mb-1">Impact</span>
                                <span className="text-xs text-gray-500 font-medium tabular-nums">{post.ameenCount} souls said Ameen</span>
                            </div>
                            <button 
                                onClick={() => sayAmeen(post.id)} 
                                className="relative bg-white/5 text-emerald-400 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-emerald-400/10 hover:border-emerald-400/20 active:scale-[1.3] transition-all active:rotate-3 shadow-lg"
                            >
                                Ameen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 flex flex-col items-center opacity-20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <SparklesIcon className="w-8 h-8" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.4em]">The wall awaits your light</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AmeenWall;
