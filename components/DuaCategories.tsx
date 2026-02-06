
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
import { duaData } from '../data/duas';

const DuaCategories: React.FC = () => {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);

  useEffect(() => {
    setCategories(duaData.categories);
    setIsLoading(false);
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
      return CategoryIcon;
  };

  if (selectedCategory) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedCategory(null)} className="text-gray-500 hover:text-white flex items-center gap-2 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-6">{selectedCategory.name}</h1>
        <div className="space-y-6">
          {selectedCategory.duas.map(dua => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Categories</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category)}
                className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all text-center flex flex-col items-center gap-4"
              >
                <div className="p-4 bg-yellow-400/10 rounded-2xl text-yellow-400">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-sm font-bold text-white">{category.name.replace(/^[^\w\s]+/, '').trim()}</h2>
              </button>
          );
        })}
      </div>
    </div>
  );
};

export default DuaCategories;
