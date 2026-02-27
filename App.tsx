
import React, { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import DailyDua from './components/DailyDua';
import ZikrCounter from './components/ZikrCounter';
import DuaJournal from './components/DuaJournal';
import AmeenWall from './components/AmeenWall';
import DuaCategories from './components/DuaCategories';
import SleepMode from './components/SleepMode';
import Sidebar from './components/Sidebar';
import { AppView, ZikrReminder } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.Home);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [reminder, setReminder] = useState('');

  const handleSetView = useCallback((view: AppView) => {
    setActiveView(view);
  }, []);
  
  const handleEnterSleepMode = useCallback(() => {
    setIsSleepMode(true);
  }, []);

  const handleExitSleepMode = useCallback(() => {
    setIsSleepMode(false);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let currentReminder = '';

    if (hour >= 4 && hour < 12) {
      currentReminder = "🌅 Morning Reminder: Start with 'Alhamdulillah' today.";
    } else if (hour >= 12 && hour < 17) {
      currentReminder = "☀️ Afternoon Reminder: Take a moment for a short Dua.";
    } else if (hour >= 17 && hour < 21) {
        currentReminder = "🌙 Evening Reminder: Reflect on your day and say 'Astaghfirullah'.";
    } else {
        currentReminder = "🌌 Night Reminder: Recite Ayatul Kursi before sleeping.";
    }
    
    setReminder(currentReminder);
    setHasNotification(true);
  }, []);

  // Check for Custom Zikr Reminder
  useEffect(() => {
    const checkZikrReminder = () => {
      try {
        const saved = localStorage.getItem('zikrReminder');
        if (saved) {
          const settings: ZikrReminder = JSON.parse(saved);
          if (settings.enabled && settings.time) {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const today = now.toDateString();

            if (settings.time === currentTime && settings.lastTriggered !== today) {
              setReminder(`🔔 It's time for your ${settings.zikrType} Zikr`);
              setHasNotification(true);
              
              const newSettings = { ...settings, lastTriggered: today };
              localStorage.setItem('zikrReminder', JSON.stringify(newSettings));
            }
          }
        }
      } catch (e) {
        console.error("Error checking zikr reminder:", e);
      }
    };

    const interval = setInterval(checkZikrReminder, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isSleepMode) {
    return <SleepMode onExit={handleExitSleepMode} />;
  }

  const renderView = () => {
    switch (activeView) {
      case AppView.Home:
        return <DailyDua onEnterSleepMode={handleEnterSleepMode} />;
      case AppView.Zikr:
        return <ZikrCounter />;
      case AppView.Journal:
        return <DuaJournal />;
      case AppView.Ameen:
        return <AmeenWall />;
      case AppView.Categories:
        return <DuaCategories />;
      default:
        return <DailyDua onEnterSleepMode={handleEnterSleepMode} />;
    }
  };

  const clearNotification = () => {
    if (hasNotification && reminder) {
      alert(reminder);
      setHasNotification(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col antialiased bg-[#0c1021]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <TopNav 
        title="Noor" 
        hasNotification={hasNotification} 
        onBellClick={clearNotification}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <main className="flex-grow w-full max-w-lg mx-auto px-4 pb-24">
        {renderView()}
      </main>
      
      <BottomNav activeView={activeView} setActiveView={handleSetView} />
      <audio id="global-audio-player" className="hidden"></audio>
    </div>
  );
};

export default App;
