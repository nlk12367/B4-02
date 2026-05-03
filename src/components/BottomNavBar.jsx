import { Link, useLocation } from 'react-router-dom';

export default function BottomNavBar() {
  const location = useLocation();
  const path = location.pathname;

  const getNavClass = (isActive) => {
    if (isActive) {
      return "flex flex-col items-center justify-center bg-white/80 text-fuchsia-700 rounded-full px-5 py-2 font-label text-[11px] font-medium scale-95 shadow-sm ripple-effect cursor-pointer";
    }
    return "flex flex-col items-center justify-center text-slate-500/70 font-label text-[11px] font-medium ripple-effect cursor-pointer hover:text-fuchsia-500 transition-all active:scale-90";
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/70 backdrop-blur-2xl rounded-t-[3rem] shadow-[0_-10px_40px_rgba(186,163,255,0.1)]">
      <Link to="/home" className={getNavClass(path === '/home')}>
        <span className="material-symbols-outlined mb-1" style={path === '/home' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
        <span className="uppercase tracking-wide">Home</span>
      </Link>
      
      <Link to="/chat" className={getNavClass(path === '/chat')}>
        <span className="material-symbols-outlined mb-1" style={path === '/chat' ? { fontVariationSettings: "'FILL' 1" } : {}}>bubble_chart</span>
        <span className="uppercase tracking-wide">Aethera</span>
      </Link>
      
      <Link to="/insights" className={getNavClass(path === '/insights')}>
        <span className="material-symbols-outlined mb-1" style={path === '/insights' ? { fontVariationSettings: "'FILL' 1" } : {}}>insights</span>
        <span className="uppercase tracking-wide">Insights</span>
      </Link>
      
      <Link to="/settings" className={getNavClass(path === '/settings')}>
        <span className="material-symbols-outlined mb-1" style={path === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
        <span className="uppercase tracking-wide">Profile</span>
      </Link>
    </nav>
  );
}
