import { useState, useRef, useEffect } from 'react';
import { Bell, X, Zap, Droplets, Wind, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTriggerEvents } from '../../hooks/useTriggerEvents';
import { TRIGGER_CONFIG } from '../../constants/triggerConfig';

const EVT_ICONS = { rain: Droplets, aqi: Wind, curfew: Lock };

export default function TopBar({ title }) {
  const { riderProfile } = useAuth();
  const { events } = useTriggerEvents(riderProfile?.city);
  const hasAlert = events.length > 0;
  const initials = riderProfile?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || '?';
  const [notifOpen, setNotifOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false); }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="topbar">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-bold" style={{ fontFamily: 'Syne,sans-serif', color: 'var(--text)' }}>
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text3)', minWidth: 200 }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 opacity-40" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Search…</span>
        </div>

        {/* Notification bell — FIXED: clickable with dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{
              background: notifOpen ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${notifOpen ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
            }}>
            <Bell size={16} style={{ color: notifOpen ? 'var(--blue-bright)' : 'var(--text2)' }} />
            {hasAlert && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pulse-ring"
                style={{ background: 'var(--red)' }} />
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="notif-dropdown animate-slide-down">
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Notifications</p>
                <button onClick={() => setNotifOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ color: 'var(--text3)', background: 'rgba(255,255,255,0.05)' }}>
                  <X size={12} />
                </button>
              </div>
              {events.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>All Clear</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>No active events in {riderProfile?.city}</p>
                </div>
              ) : (
                <div>
                  {events.map(evt => {
                    const Icon = EVT_ICONS[evt.eventType] || Zap;
                    const cfg  = TRIGGER_CONFIG[evt.eventType]?.[evt.severity];
                    return (
                      <div key={evt.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: 'rgba(239,68,68,0.12)' }}>
                          <Icon size={14} style={{ color: 'var(--red)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                            {evt.eventType.charAt(0).toUpperCase() + evt.eventType.slice(1)} Alert
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
                            {cfg?.message || 'Protection active'}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="tag tag-red text-[10px] px-2 py-0.5">{evt.severity}</span>
                            <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{evt.payoutPercent}% coverage</span>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
                              <span className="text-[10px] font-bold" style={{ color: 'var(--green-bright)' }}>LIVE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-center" style={{ color: 'var(--text3)' }}>
                      You are protected during this event
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 2px 12px rgba(59,130,246,0.3)' }}>
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
      </div>
    </header>
  );
}
