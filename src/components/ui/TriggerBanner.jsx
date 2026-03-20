import { TRIGGER_CONFIG, SEVERITY_ORDER, EVENT_TYPE_PRIORITY } from '../../constants/triggerConfig';
import { Zap } from 'lucide-react';

function pickMostSevere(events) {
  if (!events.length) return null;
  return [...events].sort((a, b) => {
    const td = (EVENT_TYPE_PRIORITY[b.eventType] || 0) - (EVENT_TYPE_PRIORITY[a.eventType] || 0);
    if (td !== 0) return td;
    return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
  })[0];
}

const EVENT_COLORS = {
  rain:   { from: '#1D4ED8', to: '#3B82F6', glow: 'rgba(59,130,246,0.3)' },
  aqi:    { from: '#92400E', to: '#D97706', glow: 'rgba(217,119,6,0.3)' },
  curfew: { from: '#991B1B', to: '#EF4444', glow: 'rgba(239,68,68,0.3)' },
};

export default function TriggerBanner({ events = [] }) {
  if (!events.length) {
    return (
      <div className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
          <span className="text-sm">✅</span>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--green-bright)' }}>All clear today</p>
          <p className="text-xs" style={{ color: 'rgba(52,211,153,0.6)' }}>Income protection is active</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
      </div>
    );
  }

  const top = pickMostSevere(events);
  if (!top) return null;
  const cfg = TRIGGER_CONFIG[top.eventType]?.[top.severity];
  const clr = EVENT_COLORS[top.eventType] || EVENT_COLORS.rain;

  return (
    <div className="mx-4 mt-3 px-4 py-3 rounded-2xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg,${clr.from},${clr.to})`,
        boxShadow: `0 4px 24px ${clr.glow}`,
        /* BUG-8 fix: use CSS repeating-radial-gradient instead of broken SVG data URI */
        backgroundImage: `repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(135deg,${clr.from},${clr.to})`,
        backgroundSize: '18px 18px, 100% 100%',
      }}>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Zap size={15} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{cfg?.message || 'Protection active'}</p>
            <p className="text-xs text-white/70">{top.payoutPercent}% income protection triggered</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-[9px] text-white/60 font-bold tracking-widest">LIVE</span>
        </div>
      </div>
    </div>
  );
}
