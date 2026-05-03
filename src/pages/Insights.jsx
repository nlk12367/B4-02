import { useState, useEffect } from 'react';

export default function Insights() {
  const [emotionIndex, setEmotionIndex] = useState(0);

  useEffect(() => {
    // 每 3 秒自動切換一次吉祥物心情
    const interval = setInterval(() => {
      setEmotionIndex((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 計算 2x2 sprite sheet 的 background-position
  const positions = [
    '0% 0%',      // Top-Left: 開心(黃)
    '100% 0%',    // Top-Right: 生氣(紅)
    '0% 100%',    // Bottom-Left: 難過(藍)
    '100% 100%'   // Bottom-Right: 平靜(紫)
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
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30">
            <img alt="Profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0uj6h0osfC6NsDdFiKGUg80F8T1SdLjqoH37mplFezXBCjWMIaS4Gi_xV5DOTH5Mup5yhB9EzK4ZmdKS2voZFqGBg-1Xgb9uErHN8P5J-3J5UM89WXDIsGk8av8MCHdF89DdJzBF_ZwkPeKjeSFWmM_vXDYhFbJb8tFyghBcQgj9HRJyN-5qkPxmc48ru7O_GvN98GvEJe237aYAEF9cHFL-Lvk2FZko8BsJs9anxWtFY7FhcpvEGRQTsqI"/>
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
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary-container/20 animate-[spin_20s_linear_infinite]"></div>
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl relative animate-float bg-white/80 backdrop-blur-sm">
                <div 
                  className="w-full h-full bg-no-repeat transition-all duration-700 ease-in-out" 
                  style={{ 
                    backgroundImage: "url('/mascots.png')", 
                    backgroundSize: '200% 200%',
                    backgroundPosition: currentPosition
                  }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-body text-on-surface leading-relaxed text-center italic">
                "Your emotional landscape is blooming with increased resilience and evening tranquility."
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
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-100/50">
                <img alt="Calming abstract art" className="w-full h-full object-cover" src="https://placeholder.pics/svg/300"/>
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
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-red-100/50">
                <img alt="Video preview" className="w-full h-full object-cover" src="https://placeholder.pics/svg/300"/>
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
              <img className="w-10 h-10 object-contain" src="https://lh3.googleusercontent.com/aida/ADBb0ui7VNu30Ys35HlEeUHEGD76E50YCmF6cl2xttAfnq3K_DjUjU44PnvnSfPfAIk0ySkR3vDE-kxN_Ctrpy0dQSfSSzXslQmtohpL7DmU77hLa8tkigZ1Xsf4CjON3B4OxWGPlSi_RatjZpj9H5gCU5HbavWRKMJxD0XBFuCaVTEQFkGJk1uetAIbGgW06-c8O2Q7xQQl09nbA6Izcah5sCBfEafoa5lgTkP48N34E1SbgLYYyw4lU4IUt_K7_xDjuGTXDmlB-C-HQQ"/>
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
