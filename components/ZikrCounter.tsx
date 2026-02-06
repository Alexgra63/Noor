
import React, { useState, useEffect } from 'react';
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

  // Sync temp settings when modal opens
  useEffect(() => {
    if (showReminderModal) {
      setTempSettings(reminderSettings);
    }
  }, [showReminderModal, reminderSettings]);

  const handleCount = () => {
    const newCount = currentCount + 1;
    setCurrentCount(newCount);
    setSavedCount(newCount);
    setDailyTotal(prev => prev + 1);
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
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
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 relative">
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-3xl font-bold text-white">Zikr Counter</h1>
        <button 
          onClick={() => setShowReminderModal(true)}
          className={`p-2 rounded-full transition-colors ${reminderSettings.enabled ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          <BellIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-800/60 rounded-full">
        {zikrOptions.map(option => (
          <button 
            key={option.type}
            onClick={() => setSelectedZikr(option.type)}
            className={`px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
                selectedZikr === option.type 
                ? 'bg-yellow-400 text-gray-900 font-semibold' 
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {option.type}
          </button>
        ))}
      </div>
      
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-800/50 rounded-full border-4 border-gray-700/50"></div>
        <div className="absolute inset-2 bg-gradient-to-br from-gray-900 to-[#1b1b2f] rounded-full shadow-inner"></div>
        <button
          onClick={handleCount}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`relative z-10 w-56 h-56 md:w-72 md:h-72 flex flex-col items-center justify-center bg-gray-800/80 rounded-full cursor-pointer select-none transition-transform duration-100 ${isPressed ? 'transform scale-95' : ''}`}
        >
          <span className="font-arabic text-4xl text-yellow-400">{zikrOptions.find(z => z.type === selectedZikr)?.arabic}</span>
          <span className="text-7xl font-bold text-white tracking-tighter">{currentCount}</span>
        </button>
      </div>

      <div className="w-full text-center">
        <p className="text-gray-400">Today's Total Zikr: <span className="font-bold text-white">{dailyTotal}</span></p>
        <button
            onClick={resetCount}
            className="mt-4 text-sm text-yellow-400/80 hover:text-yellow-300"
        >
            Reset Current
        </button>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowReminderModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-yellow-400" />
                Daily Reminder
              </h2>
              <button onClick={() => setShowReminderModal(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-200">Enable Reminder</span>
                <button 
                  onClick={() => setTempSettings({...tempSettings, enabled: !tempSettings.enabled})}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${tempSettings.enabled ? 'bg-yellow-400' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${tempSettings.enabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className={`space-y-4 transition-opacity duration-300 ${tempSettings.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Reminder Time</label>
                  <input 
                    type="time" 
                    value={tempSettings.time}
                    onChange={e => setTempSettings({...tempSettings, time: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Zikr to Recite</label>
                  <select 
                    value={tempSettings.zikrType}
                    onChange={e => setTempSettings({...tempSettings, zikrType: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 appearance-none"
                  >
                    {zikrOptions.map(opt => (
                      <option key={opt.type} value={opt.type}>{opt.type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={saveReminder}
              className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZikrCounter;
