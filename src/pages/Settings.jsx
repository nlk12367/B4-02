import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="bg-surface min-h-screen relative overflow-y-auto pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-container/20 rounded-full blur-[80px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-80 h-80 bg-tertiary-container/20 rounded-full blur-[80px]"></div>
      </div>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 glass-panel shadow-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link to="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-fuchsia-50/50 transition-colors">
            <span className="material-symbols-outlined text-fuchsia-600" data-icon="arrow_back">arrow_back</span>
          </Link>
          <h1 className="font-display text-xl font-bold text-on-surface">Settings</h1>
        </div>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-sm">psychology</span>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">AI Persona</h4>
          </div>
          <div className="flex bg-surface-container-low rounded-full p-1.5 shadow-inner">
            <button className="flex-1 py-3 px-4 rounded-full bg-white text-primary font-bold text-sm shadow-sm">
              Empathetic ☁️
            </button>
            <button className="flex-1 py-3 px-4 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-white/40 transition-all">
              Balanced
            </button>
            <button className="flex-1 py-3 px-4 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-white/40 transition-all">
              Rational ☀️
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-sm">chat_bubble</span>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">Interaction Style</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-5 py-2.5 rounded-full bg-white/60 border border-white/20 text-on-surface font-medium text-sm shadow-sm cursor-pointer hover:bg-white transition-all">
              More listening
            </div>
            <div className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm shadow-sm cursor-pointer ring-2 ring-primary/20">
              More guidance
            </div>
            <div className="px-5 py-2.5 rounded-full bg-white/60 border border-white/20 text-on-surface font-medium text-sm shadow-sm cursor-pointer hover:bg-white transition-all">
              Reflective questioning
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
