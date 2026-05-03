import { Link } from 'react-router-dom';
import { useEmotion } from '../utils/useEmotion';
import PixelEgg from '../components/PixelEgg';

export default function Home() {
  const { emotion, hasChatHistory, isAnalyzing } = useEmotion();

  // Emotion mapped properties
  const emotionConfig = {
    'Joyful': {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      pos: '0% 0%',
      weather: 'sunbeams'
    },
    'Anxious': {
      bg: 'bg-red-50 dark:bg-red-900/20',
      pos: '100% 0%',
      weather: 'particles'
    },
    'Sad': {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      pos: '0% 100%',
      weather: 'rain'
    },
    'Calm': {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      pos: '100% 100%',
      weather: 'particles'
    },
    'Neutral': {
      bg: 'bg-slate-50 dark:bg-slate-900/20',
      pos: '100% 100%',
      weather: 'none'
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
          <Link to="/settings" className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:opacity-80 transition-opacity active:scale-95 transition-calm">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </Link>
        </div>
      </header>

      {/* Dynamic Island Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center z-10 -mt-12" style={{ perspective: '1000px' }}>
        
        {/* Floating Wrapper prevents animation from overriding 3D transforms */}
        <div className="animate-float" style={{ transformStyle: 'preserve-3d' }}>
          {/* Floating Isometric Island Platform */}
          <div className="iso-container">
            {/* Shadow Base */}
            <div className="iso-face iso-shadow"></div>
            
            {/* Walls rendered first so they correctly appear below the top face in 2D fallback */}
            <div className="iso-face iso-left"></div>
            <div className="iso-face iso-right"></div>
            
            {/* Top Face rendered last */}
            <div className="iso-face iso-top"></div>

            {/* The Subject on the Island (Rendered as a 3D sibling) */}
            <div className="iso-billboard">
              {!hasChatHistory ? (
                /* Undeveloped Island: The Egg */
                <PixelEgg className="w-20 h-20 animate-egg-wobble drop-shadow-2xl" />
              ) : (
                /* Developed Island: The Mascot */
                <div 
                  className="mascot-sprite-island" 
                  style={{ backgroundPosition: currentConfig.pos }} 
                />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Start Chat Bubble */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center z-40">
        <Link to="/chat" className="group relative flex items-center justify-center p-5 rounded-full bg-surface-container-lowest/80 backdrop-blur-2xl border border-white/40 shadow-[0_10px_30px_rgba(160,45,112,0.15)] active:scale-95 transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="material-symbols-outlined text-primary text-2xl" data-icon="chat_bubble">chat_bubble</span>
        </Link>
      </div>

    </main>
  );
}
