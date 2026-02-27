
import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { BellIcon, XMarkIcon } from './Icons';
import { ZikrReminder } from '../types';

type ZikrType = 'SubhanAllah' | 'Alhamdulillah' | 'Allahu Akbar' | 'Astaghfirullah';

const zikrOptions: { type: ZikrType; arabic: string }[] = [
  { type: 'SubhanAllah', arabic: 'سُبْحَانَ الله' },
  { type: 'Alhamdulillah', arabic: 'اَلْحَمْدُ لِلّٰه' },
  { type: 'Allahu Akbar', arabic: 'اللهُ أَكْبَر' },
  { type: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ الله' },
];

const ZikrCounter: React.FC = () => {
  const [selectedZikr, setSelectedZikr] = useState<ZikrType>('SubhanAllah');
  const [currentCount, setCurrentCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [dailyTotal, setDailyTotal] = useLocalStorage('zikrDailyTotal', 0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Reminder State
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSettings, setReminderSettings] = useLocalStorage<ZikrReminder>('zikrReminder', {
    enabled: false,
    time: '09:00',
    zikrType: 'SubhanAllah',
    lastTriggered: ''
  });
  const [tempSettings, setTempSettings] = useState<ZikrReminder>(reminderSettings);

  const getTodayKey = () => `zikr_${selectedZikr}_${new Date().toDateString()}`;
  const [savedCount, setSavedCount] = useLocalStorage(getTodayKey(), 0);

  useEffect(() => {
    setCurrentCount(savedCount);
  }, [selectedZikr, savedCount]);

  useEffect(() => {
    if (showReminderModal) {
      setTempSettings(reminderSettings);
    }
  }, [showReminderModal, reminderSettings]);

  // Tactile sound synthesizer
  const playTick = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const handleCount = () => {
    playTick();
    const newCount = currentCount + 1;
    setCurrentCount(newCount);
    setSavedCount(newCount);
    setDailyTotal(prev => prev + 1);
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 80);
    
    // Haptic feedback if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };
  
  const resetCount = () => {
      setDailyTotal(prev => Math.max(0, prev - currentCount));
      setCurrentCount(0);
      setSavedCount(0);
  }

  const saveReminder = () => {
    setReminderSettings(tempSettings);
    setShowReminderModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 relative py-2">
      <div className="flex items-center justify-center gap-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Zikr <span className="text-yellow-400">Counter</span></h1>
        <button 
          onClick={() => setShowReminderModal(true)}
          className={`p-2 rounded-2xl transition-all duration-300 shadow-lg ${reminderSettings.enabled ? 'bg-yellow-400 text-gray-900 shadow-yellow-400/20' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          <BellIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-900/60 rounded-[1.5rem] border border-white/5 shadow-inner">
        {zikrOptions.map(option => (
          <button 
            key={option.type}
            onClick={() => setSelectedZikr(option.type)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-500 uppercase tracking-widest ${
                selectedZikr === option.type 
                ? 'bg-yellow-400 text-gray-900 shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {option.type}
          </button>
        ))}
      </div>
      
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group">
        {/* Ambient Glow */}
        <div className={`absolute inset-0 bg-yellow-400/5 rounded-full blur-[60px] transition-opacity duration-500 ${isPressed ? 'opacity-100' : 'opacity-40'}`}></div>
        
        {/* Outer Ring */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-[12px] border-gray-800/80 shadow-2xl"></div>
        
        {/* Inner Counter Area */}
        <button
          onClick={handleCount}
          className={`relative z-10 w-56 h-56 md:w-72 md:h-72 flex flex-col items-center justify-center bg-gray-900 rounded-full cursor-pointer select-none transition-all duration-75 border border-white/5 active:scale-95 shadow-inner ${isPressed ? 'bg-gray-800' : ''}`}
        >
          <div className="absolute top-1/4">
            <span className="font-arabic text-3xl text-yellow-400/60 transition-colors group-hover:text-yellow-400">{zikrOptions.find(z => z.type === selectedZikr)?.arabic}</span>
          </div>
          <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-lg">{currentCount}</span>
          <div className="absolute bottom-1/4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Tap to count</span>
          </div>
        </button>
      </div>

      <div className="w-full space-y-4">
        <div className="inline-flex flex-col items-center">
            <span className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black mb-1">Today's Total Remembrance</span>
            <div className="bg-white/5 px-6 py-2 rounded-full border border-white/5">
                <span className="text-xl font-bold text-white tracking-tight">{dailyTotal}</span>
            </div>
        </div>
        <div>
            <button
                onClick={resetCount}
                className="text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-400 transition-colors p-2"
            >
                Reset Daily Count
            </button>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowReminderModal(false)}>
          <div className="bg-[#0c1021] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm space-y-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/10 rounded-xl">
                    <BellIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Reminder</h2>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="text-gray-500 hover:text-white p-2">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                <span className="text-sm font-bold text-gray-300">Active</span>
                <button 
                  onClick={() => setTempSettings({...tempSettings, enabled: !tempSettings.enabled})}
                  className={`w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner ${tempSettings.enabled ? 'bg-yellow-400' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 ${tempSettings.enabled ? 'left-8' : 'left-1'}`}></div>
                </button>
              </div>

              <div className={`space-y-6 transition-all duration-500 ${tempSettings.enabled ? 'opacity-100 scale-100' : 'opacity-40 scale-95 pointer-events-none'}`}>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Reminder Time</label>
                  <input 
                    type="time" 
                    value={tempSettings.time}
                    onChange={e => setTempSettings({...tempSettings, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Type of Zikr</label>
                  <div className="relative">
                    <select 
                        value={tempSettings.zikrType}
                        onChange={e => setTempSettings({...tempSettings, zikrType: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-400/50 transition-colors appearance-none"
                    >
                        {zikrOptions.map(opt => (
                        <option key={opt.type} value={opt.type}>{opt.type}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={saveReminder}
              className="w-full bg-yellow-400 text-gray-900 font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 uppercase tracking-widest text-xs"
            >
              Set Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZikrCounter;
