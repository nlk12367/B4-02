import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="relative w-full h-full min-h-screen flex flex-col items-center overflow-hidden pb-24">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-slate-50/50 backdrop-blur-xl shadow-[0_40px_40px_rgba(160,45,112,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border border-white/40 shadow-sm overflow-hidden">
              <span className="material-symbols-outlined text-primary-dim opacity-70 text-xl" data-icon="person">person</span>
            </div>
            <h1 className="font-headline tracking-tight text-on-surface-variant font-semibold text-sm">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">Name</span>.
              Your sanctuary awaits
            </h1>
          </div>
          <Link to="/settings" className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:opacity-80 transition-all active:scale-95 hover:scale-105">
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </Link>
        </div>
      </header>

      {/* The Sole Main Subject: Pristine Iridescent Sphere */}
      <div className="relative flex-1 flex flex-col items-center justify-center mt-20 w-full">
        <div className="relative flex flex-col items-center">
          <div className="iridescent-sphere w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-all duration-700 animate-breathing active:scale-95 shadow-[inset_-10px_-10px_40px_rgba(255,255,255,0.5),0_0_60px_rgba(216,180,254,0.2)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8)_0%,rgba(246,115,183,0.4)_40%,rgba(186,163,255,0.3)_70%,rgba(159,198,255,0.2)_100%)] backdrop-blur-md">
            {/* Engraved Name */}
            <span className="font-label font-medium text-primary tracking-[0.2em] opacity-40 text-sm md:text-base">Aria</span>
          </div>
          {/* Shadow projection for depth */}
          <div className="w-32 h-4 bg-black/5 blur-xl rounded-full mt-12 opacity-30"></div>
        </div>
      </div>

      {/* Floating Start Chat Bubble */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center z-40">
        <Link to="/chat" className="group relative flex items-center justify-center p-5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_0_30px_rgba(160,45,112,0.1)] active:scale-95 transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="material-symbols-outlined text-primary-dim opacity-70" data-icon="bubble_chart">bubble_chart</span>
        </Link>
      </div>
      
      {/* Decorative Subtle Grain Layer for Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" type="fractalNoise"></feTurbulence>
          </filter>
          <rect filter="url(#noiseFilter)" height="100%" width="100%"></rect>
        </svg>
      </div>
    </main>
  );
}
