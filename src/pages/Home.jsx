import { Link } from 'react-router-dom';
import { useEmotion } from '../utils/useEmotion';
import { useGameLogic } from '../utils/useGameLogic';
import IsometricGrid from '../components/IsometricGrid';

export default function Home() {
  const { emotion, hasChatHistory, isAnalyzing } = useEmotion();
  const { daysPassed, islandLevel, petState, simulateChat, resetGame } = useGameLogic();

  // Emotion mapped properties (Normal, Depressed, Positive)
  const emotionConfig = {
    'Joyful': {
      bg: 'bg-amber-50 dark:bg-amber-900/20 saturate-125 brightness-110 contrast-105',
      pos: '0% 0%',
      weather: 'sunbeams'
    },
    'Anxious': {
      bg: 'bg-blue-100 dark:bg-blue-900/30 saturate-50 brightness-90 hue-rotate-15',
      pos: '100% 0%',
      weather: 'rain'
    },
    'Sad': {
      bg: 'bg-blue-100 dark:bg-blue-900/30 saturate-50 brightness-90 hue-rotate-15',
      pos: '0% 100%',
      weather: 'rain'
    },
    'Calm': {
      bg: 'bg-slate-50 dark:bg-slate-900/20',
      pos: '100% 100%',
      weather: 'particles'
    },
    'Neutral': {
      bg: 'bg-slate-50 dark:bg-slate-900/20',
      pos: '100% 100%',
      weather: 'particles'
    }
  };

  const currentConfig = emotionConfig[emotion] || emotionConfig['Calm'];

  return (
    <main className={`absolute inset-0 w-full h-full flex flex-col overflow-hidden transition-colors duration-1000 ${currentConfig.bg}`}>
      
      {/* Weather Effects Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {currentConfig.weather === 'rain' && (
          [...Array(20)].map((_, i) => (
            <div key={`rain-${i}`} className="weather-rain" style={{ 
              left: `${Math.random() * 100}%`, 
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 2}s`
            }}></div>
          ))
        )}
        {currentConfig.weather === 'sunbeams' && (
          [...Array(5)].map((_, i) => (
            <div key={`beam-${i}`} className="weather-sunbeam" style={{ 
              left: `${10 + i * 20}%`, 
              animationDelay: `${i * -1.5}s`
            }}></div>
          ))
        )}
        {currentConfig.weather === 'particles' && (
          [...Array(15)].map((_, i) => (
            <div key={`particle-${i}`} className="weather-particle" style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`
            }}></div>
          ))
        )}
      </div>

      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 pb-4 pt-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border border-white/40 shadow-sm overflow-hidden">
              <span className="material-symbols-outlined text-primary-dim opacity-70 text-xl" data-icon="person">person</span>
            </div>
            <h1 className="font-headline tracking-tight text-on-surface-variant font-semibold text-sm">
              {isAnalyzing ? (
                <span className="animate-pulse">Sensing your aura...</span>
              ) : (
                <>Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold">Aria</span>.</>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* 孵化進度條 (Hatching Progress Bar) */}
            <div className="h-10 w-28 bg-white/30 dark:bg-slate-800/50 rounded-full overflow-hidden border border-white/40 shadow-inner relative flex items-center backdrop-blur-sm">
              {/* 填滿進度 */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out opacity-80"
                style={{ width: `${Math.min((daysPassed / 3) * 100, 100)}%` }}
              ></div>
              {/* 百分比文字 */}
              <span className="relative z-10 w-full text-center text-[11px] font-bold text-slate-800 dark:text-white drop-shadow-md">
                {petState === 'egg' ? `孵化 ${Math.min(Math.round((daysPassed / 3) * 100), 100)}%` : '🐣 已孵化'}
              </span>
            </div>

            {/* Settings Icon */}
            <Link to="/settings" className="w-10 h-10 flex items-center justify-center text-on-surface-variant/70 hover:opacity-100 active:scale-95 transition-all bg-white/20 dark:bg-white/5 rounded-full border border-white/30 shadow-sm">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Dynamic Island Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center z-10" style={{ perspective: '1000px' }}>
        
        {/* God Rays (Minecraft Shader Effect) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-center overflow-hidden mix-blend-overlay">
           <div className="absolute top-[-10%] left-[10%] w-[150%] h-[150%] bg-gradient-to-br from-white/50 via-white/10 to-transparent origin-top-left -rotate-[30deg] blur-2xl animate-pulse"></div>
           <div className="absolute top-[-20%] left-[30%] w-[60%] h-[150%] bg-gradient-to-br from-yellow-100/40 to-transparent origin-top-left -rotate-[25deg] blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>

        {/* Floating Wrapper prevents animation from overriding 3D transforms */}
        <div className="animate-float w-full h-full">
          <IsometricGrid level={islandLevel} petState={petState} emotion={emotion} />
        </div>

      </div>

      {/* 開發測試用面板 (Debug Panel) */}
      <div className="absolute top-24 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/20 z-50 flex flex-col gap-2">
        <div className="text-white text-xs font-mono mb-1">
          <div>對話天數: {daysPassed} | 島嶼 Lv: {islandLevel}</div>
          <div>吉祥物: {petState === 'egg' ? '孵化中 (蛋)' : '已誕生'}</div>
        </div>
        <button onClick={() => simulateChat(emotion)} className="bg-primary hover:bg-primary-dim text-white text-xs py-1.5 px-3 rounded-lg active:scale-95 transition-transform shadow-md">
          + 模擬對話 (經過一天)
        </button>
        <button onClick={resetGame} className="bg-slate-700 hover:bg-slate-600 text-white text-xs py-1 px-3 rounded-lg active:scale-95 transition-transform shadow-md">
          重置狀態
        </button>
      </div>

      {/* UI Integration Dialog Container (Z-index ensures it sits above the island) */}
      <div className="absolute inset-x-6 bottom-[140px] z-30 pointer-events-none">
        <div className="glass-modal rounded-3xl p-6 relative overflow-hidden backdrop-blur-2xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/50 shadow-2xl pointer-events-auto transition-transform active:scale-[0.98]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/5 opacity-50 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(160,45,112,0.6)]"></span>
                <h3 className="text-[17px] font-headline font-bold text-on-surface tracking-tight">
                  {emotion === 'Sad' || emotion === 'Anxious' ? '低落的氣息' : emotion === 'Joyful' ? '陽光普照' : '平靜的日常'}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/50 dark:bg-black/20 text-on-surface-variant">Lv. {islandLevel} 島嶼</span>
            </div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed opacity-90">
              {islandLevel === 1 && petState === 'egg' ? '您的島嶼目前處於未開發的狀態。這顆蛋正安靜地吸收著周圍的能量，隨時準備迎接變化。' :
               petState === 'mascot' ? `經過 ${daysPassed} 天的累積，吉祥物順利孵化了！島嶼也擴張到了 Lv.${islandLevel}。` :
               `經過了 ${daysPassed} 天的對話，島嶼逐漸產生變化。這顆蛋吸收了更多情緒，期待它的孵化！`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Floating Start Chat Bubble */}
      <div className="absolute bottom-6 right-6 flex justify-end z-40">
        <Link to="/chat" className="group relative flex items-center justify-center p-4 rounded-full bg-surface-container-lowest/90 backdrop-blur-2xl border border-white/40 shadow-[0_10px_30px_rgba(160,45,112,0.15)] active:scale-95 transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="material-symbols-outlined text-primary text-2xl" data-icon="chat_bubble">chat_bubble</span>
        </Link>
      </div>

    </main>
  );
}
