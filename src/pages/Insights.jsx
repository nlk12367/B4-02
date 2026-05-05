import { useState, useEffect, useMemo } from 'react';
import { analyzeEmotion } from '../utils/aiService';

// ── 工具函式 ────────────────────────────────────────────────
const EMOTION_SCORE = { Joyful: 90, Calm: 65, Anxious: 35, Sad: 15 };
const EMOTION_LABEL = { Joyful: '開心', Calm: '平靜', Anxious: '焦慮', Sad: '低落' };
const EMOTION_COLOR = {
  Joyful:  { dot: 'bg-amber-400',  bar: 'bg-amber-400',  text: 'text-amber-600'  },
  Calm:    { dot: 'bg-teal-400',   bar: 'bg-teal-400',   text: 'text-teal-600'   },
  Anxious: { dot: 'bg-violet-500', bar: 'bg-violet-500', text: 'text-violet-600' },
  Sad:     { dot: 'bg-blue-400',   bar: 'bg-blue-400',   text: 'text-blue-600'   },
};

/** 從訊息陣列中，依對話輪次抽出使用者訊息並分組為「每日」 */
function groupByDay(messages) {
  const days = {};
  messages
    .filter(m => m.role === 'user')
    .forEach(m => {
      const day = m.time ? m.time.slice(0, 10) : 'unknown';
      if (!days[day]) days[day] = [];
      days[day].push(m);
    });
  return days;
}

/** 計算字串中是否含有負面關鍵字，粗估壓力分 */
function estimateStressFromMessages(messages) {
  const negativeWords = ['壓力', '焦慮', '害怕', '擔心', '好累', '很累', '崩潰', '不行', '好難', '睡不著', '失眠'];
  const userTexts = messages.filter(m => m.role === 'user').map(m => m.content || '').join(' ');
  const hits = negativeWords.filter(w => userTexts.includes(w)).length;
  return Math.min(100, hits * 12 + 10);
}

/** 計算各情緒比例 */
function calcEmotionStats(emotionHistory) {
  const counts = { Joyful: 0, Calm: 0, Anxious: 0, Sad: 0 };
  emotionHistory.forEach(e => { if (counts[e] !== undefined) counts[e]++; });
  const total = emotionHistory.length || 1;
  return Object.entries(counts).map(([key, count]) => ({
    key, count, pct: Math.round(count / total * 100)
  })).sort((a, b) => b.count - a.count);
}

export default function Insights() {
  const [emotionIndex, setEmotionIndex] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [messages, setMessages] = useState([]);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState('Calm');
  const [aiSummary, setAiSummary] = useState('');

  useEffect(() => {
    async function load() {
      const saved = localStorage.getItem('come_talk_messages');
      const rawMsgs = saved ? JSON.parse(saved) : [];
      setMessages(rawMsgs);

      // 讀取或計算情緒歷史
      const savedHistory = localStorage.getItem('come_talk_emotion_history');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      setEmotionHistory(history);

      if (rawMsgs.length > 1) {
        try {
          const emotion = await analyzeEmotion(rawMsgs);
          setCurrentEmotion(emotion);
          const map = { Joyful: 0, Anxious: 1, Sad: 2, Calm: 3 };
          setEmotionIndex(map[emotion] ?? 3);

          // 從 AI emotion 摘要建立 summary
          const summaryMap = {
            Joyful:  '您的對話記錄顯示出持續的正向能量。繼續保持這份活力！',
            Calm:    '您的情緒狀態穩定而平靜，這是很好的反思狀態。',
            Anxious: '近期對話中出現一些緊張的訊號，試著深呼吸放鬆。',
            Sad:     '您近期的情緒有些低落，記得給自己多一點時間和空間。',
          };
          setAiSummary(summaryMap[emotion] || summaryMap.Calm);
        } catch (e) {
          console.error(e);
        }
      }
      setIsAnalyzing(false);
    }
    load();
  }, []);

  // ── 衍生統計 ───────────────────────────────────────────────
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];

  // 每日情緒分數（折線圖用）
  const dailyData = useMemo(() => {
    const byDay = groupByDay(messages);
    const entries = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-7);
    if (entries.length === 0) return [];
    return entries.map(([day, msgs]) => {
      // 以訊息長度和存在情緒關鍵字來估算分數
      const negHits = msgs.filter(m => /害怕|壓力|崩潰|難過|焦慮/.test(m.content || '')).length;
      const posHits = msgs.filter(m => /開心|好棒|謝謝|不錯|愉快/.test(m.content || '')).length;
      const score = Math.max(5, Math.min(95, 60 + posHits * 10 - negHits * 12));
      const label = ['日', '一', '二', '三', '四', '五', '六'][new Date(day).getDay()];
      return { day, score, label };
    });
  }, [messages]);

  // 折線圖 SVG path
  const chartPath = useMemo(() => {
    if (dailyData.length < 2) return null;
    const W = 100, H = 40;
    const pts = dailyData.map((d, i) => ({
      x: (i / (dailyData.length - 1)) * W,
      y: H - (d.score / 100) * (H - 6) - 3,
    }));
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2;
      d += ` C${cp1x} ${pts[i - 1].y}, ${cp1x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    const lastPt = pts[pts.length - 1];
    return { d, lastPt };
  }, [dailyData]);

  const emotionStats = useMemo(() => calcEmotionStats(emotionHistory), [emotionHistory]);

  const stressLevel = useMemo(() => estimateStressFromMessages(messages), [messages]);
  const stressLabel = stressLevel < 30 ? 'Low' : stressLevel < 60 ? 'Moderate' : 'High';
  const stressColor = stressLevel < 30 ? 'text-teal-600' : stressLevel < 60 ? 'text-violet-600' : 'text-rose-600';
  const stressBarColor = stressLevel < 30 ? 'bg-teal-400' : stressLevel < 60 ? 'bg-violet-500' : 'bg-rose-500';

  const totalChats = messages.filter(m => m.role === 'user').length;
  const dominantEmotion = emotionStats[0]?.key ?? 'Calm';
  const trendLabel = { Joyful: 'Positive & Uplifted', Calm: 'Stable & Grounded', Anxious: 'Tense & Unsettled', Sad: 'Low & Reflective' }[dominantEmotion] ?? 'Stable & Uplifted';

  return (
    <div className="relative min-h-screen pb-24 overflow-x-hidden bg-surface z-10">
      <div className="orb w-64 h-64 bg-primary-container top-[-50px] right-[-50px]"></div>
      <div className="orb w-80 h-80 bg-tertiary-container bottom-[20%] left-[-100px]"></div>

      {/* TopAppBar */}
      <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(160,45,112,0.06)] px-6 pt-12 pb-4 w-full flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-pink-700 dark:text-pink-400">Insights</h1>
          <p className="text-on-surface-variant text-sm font-medium font-body opacity-80">Understand your emotional patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary-container/30 shadow-sm overflow-hidden">
            <span className="material-symbols-outlined text-primary-dim opacity-70 text-xl" data-icon="person">person</span>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-8 max-w-md mx-auto">

        {/* ── Hero Summary Card ── */}
        <section className="relative">
          <div className="glass rounded-xl p-6 shadow-[0_10px_40px_rgba(160,45,112,0.08)] border border-white/40">
            <div className="flex justify-between items-start mb-5">
              <h2 className="font-headline font-bold text-lg text-primary">Emotional Overview</h2>
              <span className="bg-tertiary-container/30 text-on-tertiary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                {totalChats} msgs
              </span>
            </div>

            {/* 吉祥物 */}
            <div className="relative w-36 h-36 mx-auto mb-5 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-4 border-dashed border-primary-container/20 ${isAnalyzing ? 'animate-spin' : 'animate-[spin_20s_linear_infinite]'}`}></div>
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl relative animate-float bg-white/80 backdrop-blur-sm">
                <div
                  className={`w-full h-full bg-no-repeat transition-all duration-700 ease-in-out ${isAnalyzing ? 'opacity-30 blur-sm scale-110' : 'opacity-100'}`}
                  style={{ backgroundImage: "url('/mascots.png')", backgroundSize: '200% 200%', backgroundPosition: positions[emotionIndex] }}
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 text-primary font-bold text-xs animate-pulse tracking-widest">ANALYZING</div>
                )}
              </div>
            </div>

            {/* 情緒摘要文字 */}
            <p className="text-sm font-body text-on-surface leading-relaxed text-center italic min-h-[36px] mb-4">
              {isAnalyzing ? 'AI is reviewing your recent reflections...' : (aiSummary || '暫無足夠的對話記錄進行分析。')}
            </p>

            {/* 真實統計數字 */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-outline-variant/10">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-primary">{totalChats}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">對話次數</span>
              </div>
              <div className="flex flex-col items-center border-x border-outline-variant/10">
                <span className="text-2xl font-black text-primary">{emotionStats.filter(e => e.count > 0).length}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">情緒種類</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-primary">{dailyData.length}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">對話天數</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Emotion Trend ── */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Emotion Trend</h3>
              <p className="text-sm text-secondary-dim font-medium">{trendLabel}</p>
            </div>
            <span className="text-primary text-xs font-bold">近 {dailyData.length} 天</span>
          </div>

          {/* 折線圖 */}
          <div className="h-40 w-full relative flex items-end justify-between px-2 pt-8">
            {dailyData.length >= 2 ? (
              <>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#a02d70', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6448b2', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#a02d70', stopOpacity: 0.15 }} />
                      <stop offset="100%" style={{ stopColor: '#a02d70', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  {/* 面積填色 */}
                  <path d={`${chartPath.d} L${chartPath.lastPt.x} 40 L0 40 Z`} fill="url(#areaGrad)" />
                  {/* 折線 */}
                  <path d={chartPath.d} fill="none" stroke="url(#lineGrad)" strokeLinecap="round" strokeWidth="2.5" />
                  {/* 最新點 */}
                  <circle cx={chartPath.lastPt.x} cy={chartPath.lastPt.y} r="2.5" fill="#6448b2" />
                </svg>
                {/* X 軸標籤 */}
                {dailyData.map((d, i) => (
                  <div key={i} className={`text-[10px] font-bold z-10 ${i === dailyData.length - 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {i === dailyData.length - 1 ? 'TODAY' : `週${d.label}`}
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full flex items-center justify-center text-sm text-on-surface-variant opacity-50">
                對話記錄不足，無法繪製趨勢圖
              </div>
            )}
          </div>

          {/* Stress Level */}
          <div className="glass p-5 rounded-lg border border-outline-variant/10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">bubble_chart</span>
                <span className="font-bold text-sm">Stress Level</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 bg-tertiary-container/20 rounded-full ${stressColor}`}>{stressLabel}</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full shadow-[0_0_10px_rgba(100,72,178,0.4)] transition-all duration-1000 ${stressBarColor}`}
                style={{ width: `${stressLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-1.5 font-medium">
              <span>Low</span><span>Moderate</span><span>High</span>
            </div>
          </div>
        </section>

        {/* ── 情緒分佈 ── */}
        {emotionStats.some(e => e.count > 0) && (
          <section className="space-y-3">
            <h3 className="font-headline font-bold text-lg text-on-surface">情緒分佈</h3>
            <div className="glass rounded-xl p-5 border border-outline-variant/10 space-y-3">
              {emotionStats.map(({ key, count, pct }) => {
                if (count === 0) return null;
                const c = EMOTION_COLOR[key] || EMOTION_COLOR.Calm;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                        <span>{EMOTION_LABEL[key]}</span>
                      </div>
                      <span className={`${c.text} font-bold`}>{pct}%  ({count}次)</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── AI Summary ── */}
        <section>
          <div className="bg-primary/5 p-6 rounded-xl border-l-4 border-primary relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">psychology</span>
            </div>
            <h4 className="font-headline font-bold text-sm text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Reflection
            </h4>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">
              {isAnalyzing
                ? '正在分析您的對話記錄...'
                : totalChats < 3
                ? '目前對話記錄尚少，請繼續與 AI 互動，系統將為您提供更深入的情緒分析。'
                : aiSummary || '您的情緒狀態整體穩定，繼續保持每日的對話習慣有助於更準確的分析。'
              }
            </p>
          </div>
        </section>

        {/* ── 快速連結 ── */}
        <section className="space-y-4">
          <h3 className="font-headline font-bold text-lg text-on-surface">Recommended for You</h3>
          <div className="space-y-3">
            <a className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-green-50/30 active:scale-[0.97] transition-all cursor-pointer" href="https://open.spotify.com/">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border-2 border-gray-100 shadow-sm">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </div>
              <div className="flex-grow flex flex-col">
                <h5 className="font-bold text-sm text-on-surface">Spotify</h5>
                <p className="text-xs text-on-surface-variant font-medium">Calm your nervous system in 3 min</p>
              </div>
              <div className="flex items-center gap-1 text-green-700/70 font-bold text-[10px] tracking-wider uppercase">
                <span>OPEN</span><span className="material-symbols-outlined text-sm">open_in_new</span>
              </div>
            </a>
            <a className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm hover:bg-red-50/30 active:scale-[0.97] transition-all cursor-pointer" href="https://www.youtube.com/">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white flex items-center justify-center border-2 border-red-100/50 shadow-sm">
                <img alt="YouTube" className="w-8 h-8 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"/>
              </div>
              <div className="flex-grow flex flex-col">
                <h5 className="font-bold text-sm text-on-surface">YouTube</h5>
                <p className="text-xs text-on-surface-variant font-medium">Navigate complex emotions gracefully</p>
              </div>
              <div className="text-on-surface-variant/40"><span className="material-symbols-outlined">chevron_right</span></div>
            </a>
          </div>
        </section>

        {/* ── 底部激勵語 ── */}
        <section className="pb-8">
          <div className="glass p-6 rounded-xl border border-primary/10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface leading-snug">
                {totalChats > 0
                  ? <>您已累積 <span className="text-primary font-bold">{totalChats}</span> 次對話，持續記錄有助於了解自己的情緒模式。</>
                  : '開始您的第一次對話，讓 AI 幫助您認識自己的情緒。'
                }
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1 font-medium italic">You're doing better than you think.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
