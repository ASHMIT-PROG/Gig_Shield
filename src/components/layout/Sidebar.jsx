import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTriggerEvents } from '../../hooks/useTriggerEvents';
import { PLATFORMS } from '../../constants/platforms';
import {
  Home, Wallet, Shield, FileText, User,
  LogOut, Settings, Zap,
} from 'lucide-react';

const NAV = [
  { path: '/',         label: 'Dashboard',  Icon: Home    },
  { path: '/payouts',  label: 'Payouts',    Icon: Wallet  },
  { path: '/coverage', label: 'Coverage',   Icon: Shield  },
  { path: '/tax',      label: 'Tax Report', Icon: FileText },
  { path: '/profile',  label: 'Profile',    Icon: User    },
];

export default function Sidebar() {
  const { riderProfile, setCurrentUser, setRiderProfile, isAdmin } = useAuth();
  const { events } = useTriggerEvents(riderProfile?.city);
  const navigate = useNavigate();
  const platform = PLATFORMS.find(p => p.value === riderProfile?.platform);
  const initials = riderProfile?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '?';
  const hasEvent = events.length > 0;

  function handleLogout() {
    setCurrentUser(null);
    setRiderProfile(null);
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 4px 16px rgba(59,130,246,0.35)' }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg>
        </div>
        <div>
          <p className="font-extrabold text-base leading-none" style={{ fontFamily: 'Syne,sans-serif', color: 'var(--text)' }}>GigShield</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>Income Protection</p>
        </div>
      </div>

      {/* Active Event Banner */}
      {hasEvent && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Zap size={13} style={{ color: 'var(--red)', fill: 'var(--red)' }} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold truncate" style={{ color: 'var(--red)' }}>Protection Active</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(239,68,68,0.7)' }}>
              {events[0]?.eventType} in {riderProfile?.city}
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--red)' }} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: 'var(--text3)' }}>Menu</p>
        {NAV.map(({ path, label, Icon }) => (
          <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={16} className="nav-icon shrink-0" />
            {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={16} className="nav-icon shrink-0" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User card at bottom */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)' }}>
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{riderProfile?.name || 'Rider'}</p>
            {platform && (
              <p className="text-xs truncate" style={{ color: 'var(--text3)' }}>
                <span className="font-medium" style={{ color: platform.color }}>{platform.label}</span>
                {' · '}{riderProfile?.city}
              </p>
            )}
          </div>
          <button onClick={handleLogout} title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-red-500/10"
            style={{ color: 'var(--text3)' }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
