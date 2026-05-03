import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateChatResponse } from '../utils/aiService';

const initialMessages = [
  {
    id: 1,
    sender: 'Aethera',
    text: "The quiet of the morning feels different today. Like a canvas waiting for a whisper. What colors are your thoughts painting right now?",
    time: "09:12 AM"
  }
];

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('come_talk_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('come_talk_messages', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend = inputText, imageBase64 = null) => {
    if (typeof textToSend !== 'string') textToSend = inputText;
    if (!textToSend.trim() && !imageBase64) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: textToSend,
      image: imageBase64,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    if (textToSend === inputText) {
      setInputText("");
    }

    setIsTyping(true);
    try {
      const aiResponse = await generateChatResponse(updatedMessages);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Aethera',
        text: aiResponse.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: aiResponse.options
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'System',
        text: 'Sorry, connection failed. Please check your API key.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleSend("傳送了一張照片", base64String);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = null;
  };

  return (
    <div className="bg-surface flex flex-col min-h-full relative font-body text-on-surface">
      {/* Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-primary/20 orb blur-[80px] opacity-50"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-tertiary/20 orb blur-[80px] opacity-50"></div>
      </div>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 pb-4 pt-12">
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
      </header>

      {/* Chat Messages */}
      <main className="px-6 flex-1 pt-6 flex flex-col pb-32">
        <div className="flex justify-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-medium opacity-60">Echoes of Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col mb-10 max-w-[85%] animate-chat-bubble ${msg.sender === 'You' ? 'items-end ml-auto' : 'items-start'}`}>
            <div className={`${msg.sender === 'You' ? 'glass-panel' : 'glass-bubble-ai'} px-6 py-5 rounded-t-xl shadow-sm border border-white/20 ${msg.sender === 'You' ? 'rounded-bl-xl rounded-br-none' : 'rounded-br-xl rounded-bl-none'}`}>
              
              {/* Display Image if present */}
              {msg.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-white/30 shadow-sm max-w-[200px]">
                  <img src={msg.image} alt="Uploaded content" className="w-full h-auto object-cover" />
                </div>
              )}

              <p className="font-display text-lg leading-relaxed text-on-surface font-light">{msg.text}</p>
              
              {msg.options && msg.options.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.options.map((opt, i) => (
                    <button key={i} onClick={() => handleSend(opt)} className="px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-[12px] font-medium text-primary hover:bg-white/40 active:scale-95 transition-all text-left">
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className={`mt-2 text-[10px] text-on-surface-variant font-medium opacity-40 ${msg.sender === 'You' ? 'mr-1' : 'ml-1'}`}>{msg.sender} • {msg.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col mb-10 max-w-[85%] items-start animate-fade-in">
            <div className="glass-bubble-ai px-6 py-4 rounded-t-xl rounded-br-xl rounded-bl-none shadow-sm border border-white/20 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="mt-2 ml-1 text-[10px] text-on-surface-variant font-medium opacity-40">Aethera is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Bar */}
      <div className="sticky bottom-[88px] w-full z-40 px-6 mt-auto">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3 p-2 bg-white/35 backdrop-blur-[30px] rounded-full shadow-lg border border-white/50 h-[56px] focus-within:h-[64px] transition-all">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-white/40 transition-all flex-shrink-0">
            <span className="material-symbols-outlined text-2xl" data-icon="image">image</span>
          </button>
          
          <button onClick={() => setIsRecording(true)} className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-white/40 transition-all flex-shrink-0">
            <span className="material-symbols-outlined text-2xl" data-icon="mic">mic</span>
          </button>
          
          <input 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface font-display text-lg tracking-tight h-full" 
            placeholder="Type a message..." 
          />
          
          <button onClick={() => handleSend()} disabled={!inputText.trim()} className={`w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-300 flex-shrink-0 ${!inputText.trim() ? 'opacity-50' : 'active:scale-90 hover:opacity-90'}`}>
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

    </div>
  );
}
