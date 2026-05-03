import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import NebulaBackground from './components/NebulaBackground';
import BottomNavBar from './components/BottomNavBar';
import UnityGame from './components/UnityGame';
import Insights from './pages/Insights';

function App() {
  return (
    <BrowserRouter>
      {/* Desktop Background simulating a phone context */}
      <div className="min-h-screen bg-slate-200/50 dark:bg-slate-900 flex justify-center items-center">
        {/* Mobile Device Wrapper */}
        <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 bg-surface relative overflow-hidden shadow-2xl flex flex-col font-manrope text-on-surface selection:bg-primary-container selection:text-on-primary-container z-0" style={{ transform: 'translateZ(0)' }}>
          <NebulaBackground />
          
          {/* Unity Game Background Layer */}
          <UnityGame currentEmotion="Neutral" />
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 hide-scrollbar">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          <BottomNavBar />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
