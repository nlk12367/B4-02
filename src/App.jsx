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
      <div className="font-manrope text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
        <NebulaBackground />
        
        {/* Unity Game Background Layer */}
        <UnityGame currentEmotion="Neutral" />
        
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        <BottomNavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
