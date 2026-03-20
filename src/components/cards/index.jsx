import { Droplets, Wind, Lock, TrendingUp, Package, Coins, Activity } from 'lucide-react';
import { formatINR } from '../../utils/currencyHelpers';
import { formatDate, formatTimestamp } from '../../utils/dateHelpers';
import StatusBadge from '../ui/StatusBadge';

/* ── EarningsCard ────────────────────────────────────────── */
export function EarningsCard({ totalEarnings, deliveryCount, poolContribution, loading }) {
  if (loading) return (
    <div className="mx-4 mt-3 glass-card">
      <div className="skeleton h-4 w-24 mb-3" /><div className="skeleton h-10 w-40 mb-4" />
      <div className="flex gap-3"><div className="skeleton h-16 flex-1 rounded-xl"/><div className="skeleton h-16 flex-1 rounded-xl"/></div>
    </div>
  );
  return (
    <div className="mx-4 mt-3 rounded-2xl p-4 relative overflow-hidden noise animate-slide-up"
      style={{ background:'linear-gradient(135deg,#1E3A5F,#1D4ED8)', boxShadow:'0 8px 32px rgba(29,78,216,0.35)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background:'radial-gradient(circle,#60A5FA,transparent)', transform:'translate(30%,-30%)' }} />
      <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-blue-200/70">Today's Earnings</p>
      <p className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily:'Syne,sans-serif' }}>{formatINR(totalEarnings)}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Package size={12} className="text-blue-200" /><span className="text-xs text-blue-200/70">Deliveries</span>
          </div>
          <span className="text-xl font-bold text-white">{deliveryCount}</span>
        </div>
        <div className="rounded-xl p-3" style={{ background:'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Coins size={12} className="text-blue-200" /><span className="text-xs text-blue-200/70">Pool</span>
          </div>
          <span className="text-xl font-bold text-white">-{formatINR(poolContribution)}</span>
        </div>
      </div>
    </div>
  );
}

/* ── PayoutCard ──────────────────────────────────────────── */
const EVT_ICONS = { rain:<Droplets size={16}/>, aqi:<Wind size={16}/>, curfew:<Lock size={16}/> };
const EVT_LABELS = { rain:'Rain Protection', aqi:'AQI Protection', curfew:'Curfew Protection' };
const EVT_COLORS = { rain:'rgba(59,130,246,0.15)', aqi:'rgba(245,158,11,0.15)', curfew:'rgba(239,68,68,0.15)' };
const EVT_TXT = { rain:'var(--blue-bright)', aqi:'var(--amber)', curfew:'var(--red)' };

export function PayoutCard({ payout }) {
  const { eventType, expectedIncome, actualIncome, payoutAmount, status, paidAt } = payout;
  return (
    <div className="mx-4 mb-3 rounded-2xl p-4 animate-slide-up"
      style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:EVT_COLORS[eventType]||'rgba(255,255,255,0.05)', color:EVT_TXT[eventType]||'var(--text2)' }}>
            {EVT_ICONS[eventType]||<TrendingUp size={16}/>}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color:'var(--text)' }}>{EVT_LABELS[eventType]||'Payout'}</p>
            <p className="text-xs" style={{ color:'var(--text3)' }}>{formatDate(paidAt)}</p>
          </div>
        </div>
        <StatusBadge status={status}/>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop:'1px solid var(--border)' }}>
        {[['Expected',formatINR(expectedIncome),'var(--text2)'],['Actual',formatINR(actualIncome),'var(--text2)'],['Payout',formatINR(payoutAmount),'var(--green-bright)']].map(([k,v,c])=>(
          <div key={k}>
            <span className="text-[10px] uppercase tracking-wide block mb-0.5" style={{ color:'var(--text3)' }}>{k}</span>
            <span className="text-sm font-bold" style={{ color:c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ScoreBreakdownCard ──────────────────────────────────── */
function ScoreBar({ label, value, max, description, color }) {
  const pct = Math.min(100,(value/max)*100);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color:'var(--text)' }}>{label}</span>
        <span className="text-sm font-bold font-mono" style={{ color }}>{value}<span style={{ color:'var(--text3)' }}>/{max}</span></span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color}88,${color})` }}/>
      </div>
      <p className="text-xs mt-1.5" style={{ color:'var(--text3)' }}>{description}</p>
    </div>
  );
}

export function ScoreBreakdownCard({ activityScore, stabilityScore, claimScore }) {
  return (
    <div className="glass-card mx-4 mt-3">
      <h3 className="text-sm font-semibold mb-4" style={{ color:'var(--text2)' }}>Score Breakdown</h3>
      <ScoreBar label="Activity" value={activityScore||0} max={40} description="Deliveries completed & active days" color="var(--blue)"/>
      <ScoreBar label="Stability" value={stabilityScore||0} max={30} description="Earnings consistency over 90 days" color="#8B5CF6"/>
      <ScoreBar label="Claim History" value={claimScore||0} max={30} description="Accurate claims & low fraud signals" color="var(--green)"/>
    </div>
  );
}

/* ── TriggerEventRow ─────────────────────────────────────── */
const SEV_TAG = { mild:'tag-blue', moderate:'tag-amber', severe:'tag-red', partial:'tag-amber', full:'tag-red' };

export function TriggerEventRow({ event }) {
  const { city, eventType, severity, payoutPercent, isActive, startedAt } = event;
  return (
    <tr style={{ borderBottom:'1px solid var(--border)' }} className="hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-sm font-medium" style={{ color:'var(--text)' }}>{city}</td>
      <td className="px-4 py-3 text-sm capitalize" style={{ color:'var(--text2)' }}>{eventType}</td>
      <td className="px-4 py-3"><span className={`tag ${SEV_TAG[severity]||'tag-slate'} capitalize`}>{severity}</span></td>
      <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color:'var(--blue-bright)' }}>{payoutPercent}%</td>
      <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{formatTimestamp(startedAt)}</td>
      <td className="px-4 py-3">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${isActive?'text-green-400':'text-slate-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive?'bg-green-400 animate-pulse':'bg-slate-600'}`}/>
          {isActive?'Active':'Ended'}
        </span>
      </td>
    </tr>
  );
}

/* ── RiderRow ────────────────────────────────────────────── */
export function RiderRow({ rider, onClick }) {
  const { name, phone, city, platform, insuranceScore, isActive } = rider;
  const sc = insuranceScore>=60?'var(--green)':insuranceScore>=40?'var(--amber)':'var(--red)';
  const initials = name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return (
    <tr style={{ borderBottom:'1px solid var(--border)' }} className="cursor-pointer hover:bg-white/[0.03] transition-colors" onClick={onClick}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#1D4ED8,#3B82F6)' }}>
            <span className="text-[10px] font-bold text-white">{initials}</span>
          </div>
          <span className="text-sm font-medium" style={{ color:'var(--text)' }}>{name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-mono" style={{ color:'var(--text3)' }}>{phone}</td>
      <td className="px-4 py-3 text-sm" style={{ color:'var(--text2)' }}>{city}</td>
      <td className="px-4 py-3 text-sm capitalize" style={{ color:'var(--text2)' }}>{platform}</td>
      <td className="px-4 py-3"><span className="text-sm font-bold font-mono" style={{ color:sc }}>{insuranceScore}</span></td>
      <td className="px-4 py-3">
        <span className={`tag ${isActive?'tag-green':'tag-slate'}`}>{isActive?'Active':'Inactive'}</span>
      </td>
    </tr>
  );
}
