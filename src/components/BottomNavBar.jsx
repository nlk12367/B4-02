import { Link, useLocation } from 'react-router-dom';

export default function BottomNavBar() {
  const location = useLocation();
  const path = location.pathname;

  const getNavClass = (isActive) => {
    if (isActive) {
      return "flex items-center justify-center bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-300 rounded-full p-3 shadow-inner hover:scale-110 active:scale-90 transition-all duration-300";
    }
    return "flex items-center justify-center text-slate-400 dark:text-slate-500 p-3 hover:scale-110 active:scale-90 transition-all duration-300";
  };

  const getIconStyle = (isActive) => {
    return isActive ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  return (
    <nav className="absolute bottom-4 left-0 right-0 mx-auto w-[92%] z-50 flex justify-around items-center h-[68px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-full shadow-[0_10px_40px_rgba(186,163,255,0.2)]">
      {/* Home */}
      <Link to="/home" className={getNavClass(path === '/home')}>
        <span className="material-symbols-outlined" style={getIconStyle(path === '/home')} data-icon="home">home</span>
      </Link>
      
      {/* Aethera (Chat) */}
      <Link to="/chat" className={getNavClass(path === '/chat')}>
        <span className="material-symbols-outlined" style={getIconStyle(path === '/chat')} data-icon="bubble_chart">bubble_chart</span>
      </Link>
      
      {/* Insights */}
      <Link to="/insights" className={getNavClass(path === '/insights')}>
        <span className="material-symbols-outlined" style={getIconStyle(path === '/insights')} data-icon="insights">insights</span>
      </Link>
      
      {/* Profile / Settings */}
      <Link to="/settings" className={getNavClass(path === '/settings')}>
        <span className="material-symbols-outlined" style={getIconStyle(path === '/settings')} data-icon="person">person</span>
      </Link>
    </nav>
  );
}
