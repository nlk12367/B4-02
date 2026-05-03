import { useState, useEffect } from 'react';
import { analyzeEmotion } from '../utils/aiService';

export default function Insights() {
  const [emotionIndex, setEmotionIndex] = useState(3); // 預設 3 = 平靜
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    async function loadAndAnalyze() {
      const saved = localStorage.getItem('come_talk_messages');
      if (saved) {
        try {
          const messages = JSON.parse(saved);
          const emotion = await analyzeEmotion(messages);
          // 0: Joyful(開心), 1: Anxious(生氣/焦慮), 2: Sad(難過), 3: Calm(平靜)
          const map = {
            'Joyful': 0,
            'Anxious': 1,
            'Sad': 2,
            'Calm': 3
          };
          setEmotionIndex(map[emotion] !== undefined ? map[emotion] : 3);
        } catch (err) {
          console.error(err);
        }
      }
      setIsAnalyzing(false);
    }
    loadAndAnalyze();
  }, []);

  const positions = [
    '0% 0%',      // Top-Left: 開心(Joyful)
    '100% 0%',    // Top-Right: 生氣/焦慮(Anxious)
    '0% 100%',    // Bottom-Left: 難過(Sad)
    '100% 100%'   // Bottom-Right: 平靜(Calm)
  ];
  const currentPosition = positions[emotionIndex];

  return (
    <div className="relative min-h-screen pb-24 overflow-x-hidden bg-surface z-10">
      {/* Atmospheric Orbs */}
      <div className="orb w-64 h-64 bg-primary-container top-[-50px] right-[-50px]"></div>
      <div className="orb w-80 h-80 bg-tertiary-container bottom-[20%] left-[-100px]"></div>
      
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(160,45,112,0.06)] px-6 pt-12 pb-4 w-full flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-pink-700 dark:text-pink-400">Insights</h1>
          <p className="text-on-surface-variant text-sm font-medium font-body opacity-80">Understand your emotional patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-50/50 transition-colors">
            <span className="material-symbols-outlined text-pink-700">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary-container/30 shadow-sm overflow-hidden">
            <span className="material-symbols-outlined text-primary-dim opacity-70 text-xl" data-icon="person">person</span>
          </div>
        </div>
      </header>
      
      <main className="px-5 pt-6 space-y-8 max-w-md mx-auto">
        {/* Hero Summary Card */}
        <section className="relative">
          <div className="glass rounded-xl p-6 shadow-[0_10px_40px_rgba(160,45,112,0.08)] border border-white/40">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-headline font-bold text-lg text-primary">Healing Insights</h2>
              <span className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Tier IV</span>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-4 border-dashed border-primary-container/20 ${isAnalyzing ? 'animate-spin' : 'animate-[spin_20s_linear_infinite]'}`}></div>
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl relative animate-float bg-white/80 backdrop-blur-sm">
                <div 
                  className={`w-full h-full bg-no-repeat transition-all duration-700 ease-in-out ${isAnalyzing ? 'opacity-30 blur-sm scale-110' : 'opacity-100'}`} 
                  style={{ 
                    backgroundImage: "url('/mascots.png')", 
                    backgroundSize: '200% 200%',
                    backgroundPosition: currentPosition
                  }} 
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 text-primary font-bold text-sm animate-pulse tracking-widest">
                    ANALYZING
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-body text-on-surface leading-relaxed text-center italic min-h-[40px]">
                {isAnalyzing ? "AI is reviewing your recent reflections..." : 
                 emotionIndex === 0 ? "You're radiating warmth and positive energy today!" :
                 emotionIndex === 1 ? "Your dialogue suggests some tension. Take a deep breath." :
                 emotionIndex === 2 ? "It's okay to feel down. Healing takes time and patience." :
                 "Your emotional landscape is calm and grounded. A perfect state for reflection."}
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="">Morning focus improved by 22%</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="">Anxiety peaks are softening daily</span>
                </li>
              </ul>
              <div className="pt-4">
                <div className="flex justify-between text-[11px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">
                  <span className="">AI Accuracy</span>
                  <span className="">98.4%</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-tertiary w-[98%] rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  <span className="">Updated 24m 12s ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Emotion Trend Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Emotion Trend</h3>
              <p className="text-sm text-secondary-dim font-medium">Stable &amp; Uplifted</p>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              This Week <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
          <div className="h-40 w-full relative flex items-end justify-between px-2 pt-8">
            {/* Abstract Chart Representation */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#a02d70', stopOpacity: 1 }}></stop>
                  <stop offset="100%" style={{ stopColor: '#6448b2', stopOpacity: 1 }}></stop>
                </linearGradient>
              </defs>
              <path d="M0 30 Q 15 10, 30 25 T 60 15 T 100 5" fill="none" stroke="url(#lineGrad)" strokeLinecap="round" strokeWidth="2"></path>
              <circle cx="100" cy="5" fill="#6448b2" r="2"></circle>
            </svg>
            <div className="text-[10px] text-on-surface-variant font-bold z-10">MON</div>
            <div className="text-[10px] text-on-surface-variant font-bold z-10">WED</div>
            <div className="text-[10px] text-on-surface-variant font-bold z-10">FRI</div>
            <div className="text-[10px] text-primary font-black z-10">TODAY</div>
          </div>
          <div className="glass p-5 rounded-lg border border-outline-variant/10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">bubble_chart</span>
                <span className="font-bold text-sm">Stress Level</span>
              </div>
              <span className="text-xs font-bold text-tertiary-dim px-3 py-1 bg-tertiary-container/20 rounded-full">Moderate</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[45%] rounded-full shadow-[0_0_10px_rgba(100,72,178,0.4)]"></div>
            </div>
          </div>
        </section>
        
        {/* AI Analysis Card */}
        <section>
          <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">psychology</span>
            </div>
            <h4 className="font-headline font-bold text-sm text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Summary Analysis
            </h4>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              Consistent evening journaling has revealed a pattern of "anticipatory peace." You tend to feel most grounded after 8 PM when digital distractions fade. Focus on extending this window into your morning routine.
            </p>
          </div>
        </section>
        
        {/* Personalized Recommendations */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg text-on-surface">Recommended for You</h3>
          <div className="space-y-3">
            {/* Card 1: Spotify */}
            <a className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-green-50/30 active:scale-[0.97] active:opacity-90 transition-all cursor-pointer group" href="https://open.spotify.com/">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border-2 border-gray-100 shadow-sm">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div className="flex-grow flex flex-col">
                <h5 className="font-bold text-sm text-on-surface">Spotify</h5>
                <p className="text-xs text-on-surface-variant font-medium">Calm your nervous system in 3 min</p>
                <span className="text-[10px] text-on-surface-variant/60 font-medium">https://open.spotify.com/</span>
              </div>
              <div className="flex items-center gap-1 text-green-700/70 font-bold text-[10px] tracking-wider uppercase">
                <span>OPEN</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </div>
            </a>
            
            {/* Card 2: YouTube */}
            <a className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-red-50/30 active:scale-[0.97] active:opacity-90 transition-all cursor-pointer group" href="https://www.youtube.com/">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border-2 border-red-100/50 shadow-sm">
                <img alt="YouTube" className="w-8 h-8 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"/>
              </div>
              <div className="flex-grow flex flex-col">
                <h5 className="font-bold text-sm text-on-surface">YouTube</h5>
                <p className="text-xs text-on-surface-variant font-medium">Navigate complex emotions gracefully</p>
                <span className="text-[10px] text-on-surface-variant/60 font-medium">https://www.youtube.com/</span>
              </div>
              <div className="text-on-surface-variant/40">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </a>
            
            {/* Card 3: Resource */}
            <a className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-purple-50/30 active:scale-[0.97] active:opacity-90 transition-all cursor-pointer group" href="https://reurl.cc/aXX223">
              <div className="w-12 h-12 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0 border-2 border-purple-100">
                <span className="material-symbols-outlined text-purple-600">link</span>
              </div>
              <div className="flex-grow flex flex-col">
                <h5 className="font-bold text-sm text-on-surface">Resource</h5>
                <p className="text-xs text-on-surface-variant font-medium">short supporting text</p>
                <span className="text-[10px] text-on-surface-variant/60 font-medium">https://reurl.cc/aXX223</span>
              </div>
              <div className="flex items-center gap-1 text-purple-700/70 font-bold text-[10px] tracking-wider uppercase">
                <span>VIEW</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </div>
            </a>
          </div>
        </section>
        
        {/* Reflection Section */}
        <section className="pb-8">
          <div className="glass p-6 rounded-xl border border-primary/10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface leading-snug">
                Your resilience has increased by <span className="text-primary font-bold">12%</span> since last month.
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1 font-medium italic">You're doing better than you think.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
