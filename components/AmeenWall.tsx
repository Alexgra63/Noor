
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AmeenPost } from '../types';

const AmeenWall: React.FC = () => {
  const [posts, setPosts] = useLocalStorage<AmeenPost[]>('ameenWall', []);
  const [newDua, setNewDua] = useState('');

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.trim()) return;
    const newPost: AmeenPost = {
      id: new Date().toISOString(),
      text: newDua,
      ameenCount: Math.floor(Math.random() * 50) + 1, // Simulate initial count
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
    setNewDua('');
  };

  const sayAmeen = (id: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, ameenCount: post.ameenCount + 1 } : post
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Global Ameen Wall</h1>
      <p className="text-center text-gray-400 -mt-4">Share a dua and say 'Ameen' for others.</p>
      
      <form onSubmit={addPost} className="flex gap-2">
        <input 
          type="text"
          value={newDua}
          onChange={e => setNewDua(e.target.value)}
          placeholder="Write your Dua here..."
          className="flex-grow bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button type="submit" className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full">Post</button>
      </form>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <p className="text-gray-200">{post.text}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-500">🤲 {post.ameenCount} people said Ameen</p>
              <button onClick={() => sayAmeen(post.id)} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm hover:bg-green-500/30">Ameen</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-gray-500 pt-16">The wall is quiet. Be the first to share a Dua.</p>}
      </div>
    </div>
  );
};

export default AmeenWall;
