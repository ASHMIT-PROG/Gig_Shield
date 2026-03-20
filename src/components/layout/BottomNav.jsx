import { NavLink } from 'react-router-dom';
import { Home, Wallet, Shield, FileText, User } from 'lucide-react';

const TABS = [
  { path:'/', label:'Home', Icon:Home },
  { path:'/payouts', label:'Payouts', Icon:Wallet },
  { path:'/coverage', label:'Shield', Icon:Shield },
  { path:'/tax', label:'Tax', Icon:FileText },
  { path:'/profile', label:'Profile', Icon:User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="w-full max-w-md safe-bottom"
        style={{ background:'rgba(10,15,30,0.95)', backdropFilter:'blur(20px)', borderTop:'1px solid var(--border)' }}>
        <div className="flex items-center justify-around px-1 h-16">
          {TABS.map(({ path, label, Icon }) => (
            <NavLink key={path} to={path} end={path==='/'} className="flex-1">
              {({ isActive }) => (
                <div className={`flex flex-col items-center gap-0.5 py-2 mx-1 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-500/10' : ''}`}>
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8}
                      style={{ color: isActive ? 'var(--blue-bright)' : 'var(--text3)' }} />
                    {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background:'var(--blue)' }} />}
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: isActive ? 'var(--blue-bright)' : 'var(--text3)' }}>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
