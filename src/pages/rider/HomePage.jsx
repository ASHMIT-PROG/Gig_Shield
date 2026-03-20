import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTriggerEvents } from '../../hooks/useTriggerEvents';
import { useDeliveries } from '../../hooks/useDeliveries';
import { usePayouts } from '../../hooks/usePayouts';
import { getTodayStart, formatDate } from '../../utils/dateHelpers';
import { formatINR, calculatePoolContribution } from '../../utils/currencyHelpers';
import { getScoreColor } from '../../utils/scoreHelpers';
import { MOCK_WEEKLY_EARNINGS, MOCK_HOURLY_DELIVERIES } from '../../mockData';
import TriggerBanner from '../../components/ui/TriggerBanner';
import ScoreGauge from '../../components/ui/ScoreGauge';
import StatusBadge from '../../components/ui/StatusBadge';
import SectionHeader from '../../components/ui/SectionHeader';
import WeeklyAreaChart from '../../components/charts/WeeklyAreaChart';
import {
  Plus, X, ChevronRight, Droplets, Wind, Lock, TrendingUp,
  Zap, Shield, FileText, RefreshCw, Package, Coins, Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EVT_ICONS  = { rain: Droplets, aqi: Wind, curfew: Lock };
const EVT_LABELS = { rain: 'Rain Protection', aqi: 'AQI Protection', curfew: 'Curfew Protection' };

const HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
const HOUR_LABEL = { 6:'6A', 9:'9A', 12:'12P', 15:'3P', 18:'6P', 21:'9P' };
function heatColor(n) {
  if (n===0) return 'rgba(255,255,255,0.04)';
  if (n<=2)  return 'rgba(59,130,246,0.2)';
  if (n<=4)  return 'rgba(59,130,246,0.5)';
  return '#3B82F6';
}

export default function HomePage() {
  const navigate = useNavigate();
  const { riderProfile } = useAuth();
  const { events }  = useTriggerEvents(riderProfile?.city);
  const todayStart  = useMemo(() => getTodayStart(), []);
  const { totalEarnings, deliveryCount, addDelivery } = useDeliveries(null, todayStart, null);
  const { payouts } = usePayouts();
  const [showModal,  setShowModal]  = useState(false);
  const [amount,     setAmount]     = useState('');
  const [recording,  setRecording]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated,setLastUpdated]= useState(new Date());
  const [earningsFlash, setEarningsFlash] = useState(false);

  const score      = riderProfile?.insuranceScore || 0;
  const scoreColor = getScoreColor(score);
  const poolContrib = calculatePoolContribution(deliveryCount);

  const weeklyData = MOCK_WEEKLY_EARNINGS.map(w => ({ label: w.day, value: w.earnings }));
  const weekTotal  = MOCK_WEEKLY_EARNINGS.reduce((s,w) => s+w.earnings, 0);
  const weekDelta  = (((weekTotal - weekTotal*0.89)/(weekTotal*0.89))*100).toFixed(1);
  const deltaPos   = parseFloat(weekDelta) >= 0;

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise(r=>setTimeout(r,800));
    setLastUpdated(new Date());
    setRefreshing(false);
    toast.success('Data refreshed');
  }

  async function recordDelivery() {
    const val = parseFloat(amount);
    if (!val || val<=0) { toast.error('Enter a valid amount'); return; }
    setRecording(true);
    await new Promise(r=>setTimeout(r,500));
    addDelivery({
      id: `d-${Date.now()}`,
      riderId: riderProfile?.uid,
      city: riderProfile?.city,
      amount: val,
      deductedPool: 1,
      completedAt: { toDate: () => new Date() },
    });
    // Flash earnings card to show update
    setEarningsFlash(true);
    setTimeout(() => setEarningsFlash(false), 800);
    toast.success(`+${formatINR(val)} recorded! ₹1 pool deducted.`);
    setShowModal(false); setAmount(''); setRecording(false);
  }

  return (
    <div className="page-enter">
      {/* Trigger banner — full width */}
      <TriggerBanner events={events} />

      {/* Greeting row */}
      <div className="flex items-center justify-between mt-5 mb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color:'var(--text3)' }}>
            {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
          </p>
          <h2 className="text-3xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>
            Hey, {riderProfile?.name?.split(' ')[0] || 'Rider'} 👋
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick actions */}
          {[
            { icon: Shield, label:'Coverage', action:()=>navigate('/coverage'), color:'#8B5CF6' },
            { icon: FileText,label:'Tax',     action:()=>navigate('/tax'),      color:'var(--green)' },
          ].map(({ icon:Icon, label, action, color }) => (
            <button key={label} onClick={action}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background:`${color}15`, color, border:`1px solid ${color}30` }}>
              <Icon size={14}/> {label}
            </button>
          ))}
          <button onClick={handleRefresh}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background:'rgba(255,255,255,0.05)', color:'var(--text3)', border:'1px solid var(--border)' }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button onClick={()=>setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', color:'white', boxShadow:'0 4px 20px rgba(59,130,246,0.4)' }}>
            <Plus size={15}/> Record Delivery
          </button>
        </div>
      </div>

      {/* ── DESKTOP GRID ───────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Earnings Card — flashes on update */}
          <div className={`rounded-2xl p-5 relative overflow-hidden transition-all ${earningsFlash ? 'animate-flash' : ''}`}
            style={{ background:'linear-gradient(135deg,#1E3A5F,#1D4ED8)', boxShadow:'0 8px 32px rgba(29,78,216,0.35)' }}>
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-20"
              style={{ background:'radial-gradient(circle,#60A5FA,transparent)', transform:'translate(30%,-30%)' }}/>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-blue-200/70">Today's Earnings</p>
                <p className="text-5xl font-extrabold text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                  {formatINR(totalEarnings)}
                </p>
                <p className="text-sm text-blue-200/60 mt-1">
                  Updated {lastUpdated.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl px-4 py-3 text-center" style={{ background:'rgba(255,255,255,0.12)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Package size={12} className="text-blue-200"/>
                    <span className="text-xs text-blue-200/70">Deliveries</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{deliveryCount}</p>
                </div>
                <div className="rounded-xl px-4 py-3 text-center" style={{ background:'rgba(255,255,255,0.12)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins size={12} className="text-blue-200"/>
                    <span className="text-xs text-blue-200/70">Pool</span>
                  </div>
                  <p className="text-2xl font-bold text-white">-{formatINR(poolContrib)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-day sparkline */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color:'var(--text3)' }}>7-Day Trend</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background:deltaPos?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color:deltaPos?'var(--green-bright)':'var(--red)' }}>
                {deltaPos?'+':''}{weekDelta}% vs last week
              </span>
            </div>
            <WeeklyAreaChart data={weeklyData} color="#3B82F6" height={100} formatValue={formatINR} id="home-weekly"/>
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color:'var(--text3)' }}>{MOCK_WEEKLY_EARNINGS[0]?.day}</span>
              <span className="text-xs font-semibold" style={{ color:'var(--text2)' }}>Total: {formatINR(weekTotal)}</span>
              <span className="text-[10px]" style={{ color:'var(--text3)' }}>{MOCK_WEEKLY_EARNINGS[6]?.day}</span>
            </div>
          </div>

          {/* Hourly heatmap */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} style={{ color:'var(--text3)' }}/>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color:'var(--text3)' }}>Activity by Hour</p>
            </div>
            <div className="flex gap-1.5">
              {HOURS.map(h => (
                <div key={h} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-lg transition-all hover:opacity-80 cursor-default"
                    style={{ height:28, background:heatColor(MOCK_HOURLY_DELIVERIES[h]||0) }}
                    title={`${h}:00 — ${MOCK_HOURLY_DELIVERIES[h]||0} deliveries`} />
                  <span className="text-[9px]" style={{ color:HOUR_LABEL[h]?'var(--text3)':'transparent' }}>
                    {HOUR_LABEL[h]||'.'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 justify-end">
              {[['None','rgba(255,255,255,0.04)'],['Low','rgba(59,130,246,0.2)'],['Med','rgba(59,130,246,0.5)'],['High','#3B82F6']].map(([l,c])=>(
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background:c }}/>
                  <span className="text-[10px]" style={{ color:'var(--text3)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Score Card */}
          <div className="rounded-2xl p-5 cursor-pointer hover:border-blue-500/30 transition-all"
            style={{ background:'var(--surface)', border:'1px solid var(--border)' }}
            onClick={()=>navigate('/coverage')}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:'var(--text3)' }}>Protection Score</p>
            <div className="flex items-center gap-4">
              <ScoreGauge score={score} size="small"/>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', color:scoreColor }}>{score}</span>
                  <span className="text-lg mb-1" style={{ color:'var(--text3)' }}>/100</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)', width:120 }}>
                  <div className="h-full rounded-full" style={{ width:`${score}%`, background:`linear-gradient(90deg,${scoreColor}66,${scoreColor})`, transition:'width 1s ease' }}/>
                </div>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color:'var(--blue-bright)' }}>
                  View details <ChevronRight size={11}/>
                </p>
              </div>
            </div>
          </div>

          {/* Platform card */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:'var(--text3)' }}>Platform</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold capitalize mb-0.5" style={{ color:'var(--text)' }}>{riderProfile?.platform}</p>
                <p className="text-sm mb-2" style={{ color:'var(--text3)' }}>{riderProfile?.city}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:'var(--green)' }}/>
                  <span className="text-xs font-bold" style={{ color:'var(--green-bright)' }}>Protected</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs mb-1" style={{ color:'var(--text3)' }}>Avg/Day</p>
                <p className="text-xl font-bold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>
                  {formatINR(riderProfile?.avgDailyEarnings||820)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'Active Days', value:riderProfile?.daysActive||148 },
              { label:'Claims',      value:riderProfile?.totalClaims||3 },
              { label:'Score',       value:score },
            ].map(s=>(
              <div key={s.label} className="stat-pill">
                <span className="text-[10px] uppercase tracking-widest" style={{ color:'var(--text3)' }}>{s.label}</span>
                <span className="text-xl font-bold" style={{ color:'var(--text)', fontFamily:'Syne,sans-serif' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Recent Payouts */}
          <div>
            <SectionHeader title="Recent Payouts"
              action={
                <button onClick={()=>navigate('/payouts')} className="flex items-center gap-1 text-xs font-semibold" style={{ color:'var(--blue-bright)' }}>
                  See all <ChevronRight size={11}/>
                </button>
              }
            />
            {payouts.length===0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
                <p className="text-2xl mb-2">🛡️</p>
                <p className="text-sm" style={{ color:'var(--text3)' }}>No payouts yet — you're covered!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {payouts.slice(0,3).map(p=>{
                  const Icon = EVT_ICONS[p.eventType]||TrendingUp;
                  return (
                    <div key={p.id} className="rounded-2xl px-4 py-3 flex items-center justify-between transition-colors hover:border-white/10"
                      style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(59,130,246,0.1)' }}>
                          <Icon size={15} style={{ color:'var(--blue-bright)' }}/>
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color:'var(--text)' }}>{EVT_LABELS[p.eventType]||'Payout'}</p>
                          <p className="text-xs" style={{ color:'var(--text3)' }}>{formatDate(p.paidAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold mb-0.5" style={{ color:'var(--green-bright)' }}>{formatINR(p.payoutAmount)}</p>
                        <StatusBadge status={p.status}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
          style={{ background:'rgba(0,0,0,0.6)' }}
          onClick={e=>{ if(e.target===e.currentTarget) setShowModal(false); }}>
          <div className="rounded-2xl px-8 py-7 w-full max-w-md animate-slide-up"
            style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>Record Delivery</h3>
                <p className="text-sm mt-0.5" style={{ color:'var(--text3)' }}>₹1 pool contribution per delivery</p>
              </div>
              <button onClick={()=>setShowModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:'rgba(255,255,255,0.05)', color:'var(--text2)' }}>
                <X size={15}/>
              </button>
            </div>
            <label className="label">Delivery Earnings (₹)</label>
            <input type="number" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)}
              placeholder="0" className="input-field text-4xl font-extrabold font-mono text-center mb-4" autoFocus
              style={{ fontSize:36, height:80 }}/>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[50,80,120,200].map(v=>(
                <button key={v} onClick={()=>setAmount(String(v))}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background:amount===String(v)?'var(--blue)':'rgba(255,255,255,0.05)',
                    color:amount===String(v)?'white':'var(--text3)',
                    border:'1px solid var(--border)',
                    boxShadow:amount===String(v)?'0 4px 12px rgba(59,130,246,0.3)':'none',
                  }}>
                  ₹{v}
                </button>
              ))}
            </div>
            {amount && parseFloat(amount)>0 && (
              <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl"
                style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)' }}>
                <span className="text-sm" style={{ color:'var(--text2)' }}>You'll earn</span>
                <span className="text-lg font-bold" style={{ color:'var(--green-bright)' }}>
                  {formatINR(parseFloat(amount)-1)} <span className="text-xs text-gray-500">(after ₹1 pool)</span>
                </span>
              </div>
            )}
            <button onClick={recordDelivery} disabled={recording||!amount||parseFloat(amount)<=0} className="btn-primary flex items-center justify-center gap-2">
              {recording
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Recording…</>
                : <><Zap size={15} className="fill-white"/>Confirm Delivery</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
