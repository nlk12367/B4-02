import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const initialMessages = [
  {
    id: 1,
    sender: 'Aethera',
    text: "The quiet of the morning feels different today. Like a canvas waiting for a whisper. What colors are your thoughts painting right now?",
    time: "09:12 AM"
  },
  {
    id: 2,
    sender: 'You',
    text: "I'm feeling a sense of quiet anticipation. Like something beautiful is about to begin, but I can't quite see it yet. Just weightless.",
    time: "09:14 AM"
  },
  {
    id: 3,
    sender: 'Aethera',
    text: "Anticipation is the heartbeat of the soul. It's the light that arrives before the sun. Hold onto that weightlessness; it's where your truest self resides.",
    time: "Just now",
    options: ["Tell me more", "How do I hold it?"]
  }
];

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('L1');
  const [currentDoc, setCurrentDoc] = useState(null);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: inputText,
      time: "Just now"
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      simulateProcessing(file.name);
    }
  };

  const simulateProcessing = (filename) => {
    setCurrentDoc({
      filename: filename,
      confidence: 0.92,
      knowledge: {
        L1: {
          topic: "Weekly Emotional Reflection",
          summary: "The author expresses a recurring theme of burnout blending into personal time, alongside a budding desire to establish healthier boundaries.",
          keywords: ["Burnout", "Boundaries", "Anxiety", "Hope"]
        },
        L2: [
          { fact: "Work-related anxiety frequently interrupts evening rest.", confidence: 0.88, source_section: "Evening Entry" },
          { fact: "Sensory shifts were identified as a coping mechanism.", confidence: 0.95, source_section: "Therapy Notes" }
        ],
        L3: [
          { evidence: "I tried reading, but my mind just wanders back to emails.", section_title: "Evening Entry", page: 1 }
        ]
      },
      raw_text: "I've been feeling quite overwhelmed with work lately. It's hard to switch off even when I'm at home."
    });

    setIsProcessingDoc(true);
    setCurrentStep(0);

    const steps = ['route', 'parse', 'knowledge', 'validate'];
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessingDoc(false);
          addDocSystemMessage(filename);
        }, 500);
      }
    }, 1200);
  };

  const addDocSystemMessage = (filename) => {
    const newMsg = {
      id: Date.now(),
      sender: 'DocCompiler System',
      isSystem: true,
      filename: filename,
      text: "Successfully compiled into AI-ready knowledge.",
      time: "Just now"
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const getStepClass = (index) => {
    if (index < currentStep) return "proc-step done text-primary";
    if (index === currentStep) return "proc-step active text-primary";
    return "proc-step text-on-surface-variant";
  };

  return (
    <div className="bg-surface min-h-screen relative overflow-hidden" 
         onDragOver={(e) => e.preventDefault()} 
         onDrop={(e) => { e.preventDefault(); if(e.dataTransfer.files[0]) simulateProcessing(e.dataTransfer.files[0].name); }}>
      
      {/* Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/20 orb blur-[80px] opacity-50"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-tertiary/20 orb blur-[80px] opacity-50"></div>
      </div>

      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-40 flex items-center justify-between px-6 h-16 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(160,45,112,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary to-tertiary p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
            </div>
          </div>
          <span className="text-xl font-bold text-fuchsia-900 font-display tracking-tight">Come,Talk</span>
        </div>
        <Link to="/settings" className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-fuchsia-50/50 transition-colors">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </Link>
      </nav>

      {/* Chat Messages */}
      <main className="pt-20 pb-48 px-6 max-w-4xl mx-auto h-screen overflow-y-auto">
        <div className="flex justify-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-medium opacity-60">Echoes of Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col mb-10 max-w-[85%] animate-chat-bubble ${msg.sender === 'You' ? 'items-end ml-auto' : 'items-start'}`}>
            {msg.isSystem ? (
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2 ml-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[12px] text-white" data-icon="biotech">biotech</span>
                  </div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{msg.sender}</span>
                </div>
                <div className="glass-bubble-ai px-6 py-5 rounded-t-xl rounded-br-xl rounded-bl-none shadow-sm border border-white/20 w-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center border border-white/60 shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl" data-icon="description">description</span>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-on-surface line-clamp-1">{msg.filename}</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">{msg.text}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowInsightsModal(true)} className="w-full py-2.5 rounded-lg bg-white/60 hover:bg-white text-primary font-semibold text-sm border border-white transition-colors shadow-sm active:scale-95">
                    View Document Insights
                  </button>
                </div>
              </div>
            ) : (
              <div className={`${msg.sender === 'You' ? 'glass-panel' : 'glass-bubble-ai'} px-6 py-5 rounded-t-xl shadow-sm border border-white/20 ${msg.sender === 'You' ? 'rounded-bl-xl rounded-br-none' : 'rounded-br-xl rounded-bl-none'}`}>
                <p className="font-display text-lg leading-relaxed text-on-surface font-light">{msg.text}</p>
                {msg.options && (
                  <div className="mt-4 flex gap-2">
                    {msg.options.map((opt, i) => (
                      <button key={i} className="px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-[12px] font-medium text-primary hover:bg-white/40 transition-all">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <span className={`mt-2 text-[10px] text-on-surface-variant font-medium opacity-40 ${msg.sender === 'You' ? 'mr-1' : 'ml-1'}`}>{msg.sender} • {msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Input Bar */}
      <div className="fixed bottom-24 md:bottom-12 left-0 w-full z-40 px-6">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3 p-2 bg-white/35 backdrop-blur-[30px] rounded-full shadow-lg border border-white/50 h-[56px] focus-within:h-[64px] transition-all">
          <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-white/40 transition-all flex-shrink-0">
            <span className="material-symbols-outlined text-2xl" data-icon="attach_file">attach_file</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          
          <button onClick={() => setIsRecording(true)} className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-white/40 transition-all flex-shrink-0">
            <span className="material-symbols-outlined text-2xl" data-icon="mic">mic</span>
          </button>
          
          <input 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface font-display text-lg tracking-tight h-full" 
            placeholder="Type your feelings..." 
          />
          
          <button onClick={handleSend} disabled={!inputText.trim()} className={`w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-300 flex-shrink-0 ${!inputText.trim() ? 'opacity-50' : 'active:scale-90 hover:opacity-90'}`}>
            <span className="material-symbols-outlined text-xl" data-icon="arrow_upward">arrow_upward</span>
          </button>
        </div>
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-8 animate-chat-bubble">
            <div className="flex items-end gap-1 h-12">
              {[...Array(5)].map((_, i) => <div key={i} className="waveform-bar"></div>)}
            </div>
            <p className="text-on-surface font-display text-xl animate-pulse">Listening...</p>
            <button onClick={() => setIsRecording(false)} className="mt-12 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl scale-125">
              <span className="material-symbols-outlined text-3xl" data-icon="mic">mic</span>
            </button>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessingDoc && (
        <div className="fixed inset-0 z-[70] bg-white/20 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="glass-modal p-8 rounded-3xl flex flex-col items-center max-w-sm w-full mx-4">
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse" data-icon="biotech">biotech</span>
            </div>
            <h3 className="font-display text-xl font-semibold mb-6">Analyzing Document...</h3>
            <div className="space-y-4 w-full text-sm font-medium">
              <div className={getStepClass(0)}><span className="step-dot"></span><span>Route Determination...</span></div>
              <div className={getStepClass(1)}><span className="step-dot"></span><span>Parsing Contents...</span></div>
              <div className={getStepClass(2)}><span className="step-dot"></span><span>Generating Knowledge Layers...</span></div>
              <div className={getStepClass(3)}><span className="step-dot"></span><span>Validation & Structuring...</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Modal */}
      {showInsightsModal && currentDoc && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-end md:justify-center animate-chat-bubble">
          <div className="glass-modal w-full h-[85vh] md:w-[80vw] md:h-[80vh] md:max-w-4xl rounded-t-3xl md:rounded-3xl flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">description</span>
                </div>
                <div>
                  <h2 className="font-display font-bold">{currentDoc.filename}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Conf: {Math.round(currentDoc.confidence*100)}%</span>
                </div>
              </div>
              <button onClick={() => setShowInsightsModal(false)} className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex px-6 pt-2 border-b border-white/30 gap-8 overflow-x-auto hide-scrollbar">
              {['L1', 'L2', 'L3', 'raw'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn pb-3 font-semibold text-sm whitespace-nowrap ${activeTab === tab ? 'active' : 'text-on-surface-variant'}`}>
                  {tab === 'raw' ? 'Raw' : `${tab} ${tab==='L1'?'Summary':tab==='L2'?'Facts':'Evidence'}`}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'L1' && (
                <div className="space-y-6">
                  <div className="glass-modal p-6 rounded-2xl"><h4 className="font-bold text-xs uppercase text-on-surface-variant mb-4">Core Topic</h4><p className="text-primary font-bold">{currentDoc.knowledge.L1.topic}</p></div>
                  <div className="glass-modal p-6 rounded-2xl"><h4 className="font-bold text-xs uppercase text-on-surface-variant mb-4">Summary</h4><p>{currentDoc.knowledge.L1.summary}</p></div>
                  <div className="glass-modal p-6 rounded-2xl"><h4 className="font-bold text-xs uppercase text-on-surface-variant mb-4">Keywords</h4><div className="flex flex-wrap gap-2">{currentDoc.knowledge.L1.keywords.map(k=><span key={k} className="px-3 py-1 bg-white/60 rounded-full text-xs font-semibold text-primary">{k}</span>)}</div></div>
                </div>
              )}
              {activeTab === 'L2' && currentDoc.knowledge.L2.map((f, i) => (
                <div key={i} className="fact-card fact-conf-high"><p className="mb-4">{f.fact}</p><span className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">push_pin</span>{f.source_section}</span></div>
              ))}
              {activeTab === 'L3' && currentDoc.knowledge.L3.map((e, i) => (
                <div key={i} className="evidence-card"><p className="mb-4">"{e.evidence}"</p><div className="flex justify-between text-[11px] font-bold uppercase text-tertiary"><span>{e.section_title}</span><span>Page {e.page}</span></div></div>
              ))}
              {activeTab === 'raw' && (
                <div className="glass-modal p-6 rounded-2xl font-mono text-sm">{currentDoc.raw_text}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
