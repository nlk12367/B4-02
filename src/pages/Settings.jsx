import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="bg-surface min-h-screen relative overflow-y-auto pb-32 font-body text-on-surface">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-tertiary-container/30 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-primary-container/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Top Navigation Anchor */}
      <header className="sticky top-0 w-full z-50 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_20px_40px_rgba(160,45,112,0.05)] flex items-center justify-between px-6 pb-4 pt-12">
        <div className="flex items-center gap-4">
          <Link to="/home" className="material-symbols-outlined text-pink-600 cursor-pointer hover:opacity-80 transition-opacity">
            arrow_back
          </Link>
        </div>
        <h1 className="font-display text-lg tracking-tight font-semibold text-pink-700">Mindful Sanctuary</h1>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-pink-600 cursor-pointer hover:opacity-80 transition-opacity">
            settings
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-6 space-y-8">
        {/* Header Section */}
        <section className="space-y-1">
          <h2 className="font-display text-4xl font-extrabold tracking-tighter text-on-surface">Your Space</h2>
          <p className="text-on-surface-variant font-medium">Shape how Aria supports you</p>
        </section>

        {/* Profile Card */}
        <section className="bg-white/45 backdrop-blur-2xl rounded-lg p-6 shadow-[0_8px_32px_rgba(160,45,112,0.04)] flex items-center gap-5 border border-white/40">
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary shadow-lg">
              <img alt="User Profile Avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ui5pD12ZphZxag0e1ZT8I0yUWdBsuyWWcJ2lxkKJ6260mNHfflk7-IyKbR_UUF5I9aKdmlJbDJOUqson2J31HHQqoGX9JRxf7_eTlC-QOWsr_nFBJbR7m0oICJjLoVSOORM6BzmOG71W3UO3JnlBUdwnR-KP2rBFCCjCTcKx3lAsuHoL0Tp7JY-ZG0_wrzCNwtmdbCc96ZrPwV6eBJQAUeU3bIXXj94Nwreli87QQ2kS6kh8dXZMzDvoA" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-bold text-on-surface">LAN</h3>
            <p className="text-on-surface-variant text-sm font-medium">Currently attending university in Taichung.</p>
          </div>
        </section>

        {/* AI Companion Style */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>colors_spark</span>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">AI Style</h4>
          </div>
          <div className="bg-white/45 backdrop-blur-2xl rounded-[2.5rem] p-2 flex items-center justify-between border border-white/30 shadow-sm">
            <button className="flex-1 py-3 px-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm shadow-md transition-transform active:scale-95">
              Gentle 🌙
            </button>
            <button className="flex-1 py-3 px-4 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-white/40 transition-all">
              Balanced
            </button>
            <button className="flex-1 py-3 px-4 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-white/40 transition-all">
              Rational ☀️
            </button>
          </div>
        </section>

        {/* Interaction Style Chips */}
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

        {/* Personal Settings */}
        <section className="space-y-4">
          <h4 className="px-1 font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">Personal</h4>
          <div className="bg-white/45 backdrop-blur-2xl rounded-lg divide-y divide-white/10 overflow-hidden border border-white/20 shadow-sm">
            <div className="flex items-center justify-between p-5 hover:bg-white/40 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Name</p>
                  <p className="font-semibold text-on-surface">Xiao Lan</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div className="flex items-center justify-between p-5 hover:bg-white/40 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Email</p>
                  <p className="font-semibold text-on-surface">aria@gmail.com</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h4 className="px-1 font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">Notifications</h4>
          <div className="bg-white/45 backdrop-blur-2xl rounded-lg p-5 space-y-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <span className="font-semibold text-on-surface">Daily check-in</span>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-container/40 transition-colors duration-200 ease-in-out focus:outline-none">
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">edit_note</span>
                </div>
                <span className="font-semibold text-on-surface">Reflection prompts</span>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none">
                <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="space-y-4">
          <h4 className="px-1 font-display font-bold text-sm uppercase tracking-widest text-on-surface-variant">Privacy &amp; Safety</h4>
          <div className="bg-white/45 backdrop-blur-2xl rounded-lg p-5 space-y-6 border border-white/20 shadow-sm">
            <div className="flex items-start gap-4 cursor-pointer hover:bg-white/20 p-2 -m-2 rounded-xl transition-all">
              <div className="w-10 h-10 rounded-full bg-on-surface-variant/10 flex items-center justify-center text-on-surface-variant shrink-0">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-on-surface">Data usage</p>
                <p className="text-xs text-on-surface-variant">Manage how your interaction history is used to improve Aria's empathy.</p>
              </div>
            </div>
            {/* Conversation privacy REMOVED per user request */}
          </div>
        </section>

        {/* Decorative Ambient Visual */}
        <section className="relative h-64 rounded-xl overflow-hidden mt-12 mb-8 group">
          <img alt="Ambient Background" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida/ADBb0uj6h0osfC6NsDdFiKGUg80F8T1SdLjqoH37mplFezXBCjWMIaS4Gi_xV5DOTH5Mup5yhB9EzK4ZmdKS2voZFqGBg-1Xgb9uErHN8P5J-3J5UM89WXDIsGk8av8MCHdF89DdJzBF_ZwkPeKjeSFWmM_vXDYhFbJb8tFyghBcQgj9HRJyN-5qkPxmc48ru7O_GvN98GvEJe237aYAEF9cHFL-Lvk2FZko8BsJs9anxWtFY7FhcpvEGRQTsqI" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-on-surface max-w-[200px]">
            <p className="font-display font-bold text-lg leading-tight">Your privacy is our foundation.</p>
            <p className="text-xs font-medium opacity-70 mt-1">Always secure, always yours.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
