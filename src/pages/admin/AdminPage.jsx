import { useState } from 'react';
import {
  MOCK_ALL_TRIGGER_EVENTS, MOCK_ALL_RIDERS,
  MOCK_POOL_LEDGER, MOCK_PAYOUTS,
} from '../../mockData';
import { TriggerEventRow, RiderRow } from '../../components/cards/index';
import { EmptyState } from '../../components/ui/EmptyState';
import SectionHeader from '../../components/ui/SectionHeader';
import { formatINR } from '../../utils/currencyHelpers';
import { Shield, Users, Activity, Search, X } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Cell,
} from 'recharts';

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'var(--surface2)', border: '1px solid var(--border-bright)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--text2)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' ? formatINR(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// CHART-7: Score distribution buckets
const SCORE_BUCKETS = ['0-20','21-40','41-60','61-80','81-100'];
const BUCKET_COLORS = ['#EF4444','#EF4444','#F59E0B','#3B82F6','#10B981'];
function getScoreDistribution(riders) {
  const counts = [0, 0, 0, 0, 0];
  riders.forEach(r => {
    const s = r.insuranceScore || 0;
    if (s <= 20) counts[0]++;
    else if (s <= 40) counts[1]++;
    else if (s <= 60) counts[2]++;
    else if (s <= 80) counts[3]++;
    else counts[4]++;
  });
  return SCORE_BUCKETS.map((b, i) => ({ bucket: b, count: counts[i], color: BUCKET_COLORS[i] }));
}

export default function AdminPage() {
  const [tab,           setTab]           = useState('events');
  const [search,        setSearch]        = useState('');
  const [selectedRider, setSelectedRider] = useState(null);

  const poolBalance    = MOCK_POOL_LEDGER.reduce((s, d) => s + d.balance, 0);
  const pendingPayouts = MOCK_PAYOUTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.payoutAmount, 0);
  const reserveRatio   = pendingPayouts > 0 ? poolBalance / pendingPayouts : Infinity;
  const ratioGood      = reserveRatio >= 3;
  const ratioOk        = reserveRatio >= 1 && reserveRatio < 3;

  const filteredRiders = MOCK_ALL_RIDERS.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase())
  );

  const scoreDistData = getScoreDistribution(MOCK_ALL_RIDERS);
  const activeEvents  = MOCK_ALL_TRIGGER_EVENTS.filter(e => e.isActive).length;

  const tabs = [
    { key: 'events', label: 'Events',  icon: Activity, count: activeEvents },
    { key: 'pool',   label: 'Pool',    icon: Shield,   count: null },
    { key: 'riders', label: 'Riders',  icon: Users,    count: MOCK_ALL_RIDERS.length },
  ];

  return (
    <div className="page-enter">
      <div >

        {/* Admin header */}
        <div className="px-6 py-5 relative overflow-hidden" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-10"
            style={{ background: 'radial-gradient(circle,#3B82F6,transparent)', transform: 'translate(30%,-30%)', filter: 'blur(40px)' }} />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
              <Shield size={17} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold" style={{ fontFamily: 'Syne,sans-serif', color: 'var(--text)' }}>GigShield Admin</h1>
                {/* UX-5: LIVE badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
                  <span className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--green-bright)' }}>LIVE</span>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>Operations Dashboard</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Active Events', value: activeEvents,          color: 'var(--red)' },
              { label: 'Pool Balance',  value: formatINR(poolBalance), color: 'var(--green-bright)' },
              { label: 'Total Riders',  value: MOCK_ALL_RIDERS.length, color: 'var(--blue-bright)' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>{s.label}</p>
                <p className="text-base font-extrabold" style={{ fontFamily: 'Syne,sans-serif', color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={tab === key
                  ? { background: 'var(--blue)', color: 'white', boxShadow: '0 2px 12px rgba(59,130,246,0.3)' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
                <Icon size={12} /> {label}
                {count !== null && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: tab === key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* ── Events tab ── */}
          {tab === 'events' && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>Trigger Events</h2>
                {/* UX-5: live indicator */}
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {['City','Type','Severity','Payout %','Started','Status'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: 'var(--text3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{MOCK_ALL_TRIGGER_EVENTS.map(e => <TriggerEventRow key={e.id} event={e} />)}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Pool tab ── */}
          {tab === 'pool' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Pool Balance',    value: formatINR(poolBalance),    color: 'var(--green-bright)', sub: 'Total reserves' },
                  { label: 'Pending Payouts', value: formatINR(pendingPayouts), color: 'var(--red)',          sub: 'To be disbursed' },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>{c.label}</p>
                    <p className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'Syne,sans-serif', color: c.color }}>{c.value}</p>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Reserve ratio */}
              <div className="rounded-2xl p-5" style={{
                background: ratioGood ? 'rgba(16,185,129,0.08)' : ratioOk ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${ratioGood ? 'rgba(16,185,129,0.2)' : ratioOk ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>Reserve Ratio</p>
                <p className="text-5xl font-extrabold mb-1" style={{ fontFamily: 'Syne,sans-serif', color: ratioGood ? 'var(--green-bright)' : ratioOk ? 'var(--amber)' : 'var(--red)' }}>
                  {reserveRatio === Infinity ? '∞' : reserveRatio.toFixed(2) + '×'}
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>
                  {ratioGood ? '✅ Healthy — Pool well-funded' : ratioOk ? '⚠️ Moderate — Monitor closely' : '🚨 Critical — Top up needed'}
                </p>
              </div>

              {/* CHART-6: Pool flow ComposedChart */}
              <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <SectionHeader title="Pool Flow by City" />
                <ResponsiveContainer width="100%" height={180}>
                  <ComposedChart data={MOCK_POOL_LEDGER} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="city" tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false}
                      tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="totalInflow"  name="Inflow"   fill="rgba(59,130,246,0.6)"  radius={[4,4,0,0]} maxBarSize={24} />
                    <Bar dataKey="totalOutflow" name="Outflow"  fill="rgba(239,68,68,0.6)"   radius={[4,4,0,0]} maxBarSize={24} />
                    <Line dataKey="balance"     name="Balance"  stroke="var(--green-bright)"  strokeWidth={2.5} dot={{ fill: 'var(--green)', r: 4, stroke: '#fff', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center">
                  {[['Inflow','rgba(59,130,246,0.6)'],['Outflow','rgba(239,68,68,0.6)'],['Balance','var(--green-bright)']].map(([l,c])=>(
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                      <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* City breakdown */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text2)' }}>City Breakdown</p>
                </div>
                {MOCK_POOL_LEDGER.map((l, i, arr) => (
                  <div key={l.city} className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{l.city}</p>
                      <p className="text-xs" style={{ color: 'var(--text3)' }}>In {formatINR(l.totalInflow)} · Out {formatINR(l.totalOutflow)}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: 'var(--green-bright)' }}>{formatINR(l.balance)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Riders tab ── */}
          {tab === 'riders' && (
            <div className="space-y-3">
              {/* CHART-7: Score distribution histogram */}
              <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <SectionHeader title="Score Distribution" subtitle={`${MOCK_ALL_RIDERS.length} riders`} />
                <ResponsiveContainer width="100%" height={90}>
                  <BarChart data={scoreDistData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" name="Riders" radius={[4,4,0,0]} maxBarSize={36}>
                      {scoreDistData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Riders table */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }} />
                    <input type="text" placeholder="Search riders…" value={search} onChange={e => setSearch(e.target.value)}
                      className="input-field pl-8 py-2 text-sm" />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text3)' }}>{filteredRiders.length} results</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {['Name','Phone','City','Platform','Score','Status'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: 'var(--text3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{filteredRiders.map(r => <RiderRow key={r.id} rider={r} onClick={() => setSelectedRider(r)} />)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BUG-9 fix: modal max-w-[90vw], nominee fallback */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedRider(null); }}>
          <div className="rounded-2xl w-full max-w-[90vw] p-5 shadow-2xl"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border-bright)', maxWidth: 380 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)' }}>
                  <span className="text-sm font-bold text-white">
                    {selectedRider.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'Syne,sans-serif', color: 'var(--text)' }}>{selectedRider.name}</h3>
                  <p className="text-xs capitalize" style={{ color: 'var(--text3)' }}>{selectedRider.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRider(null)} className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X size={14} style={{ color: 'var(--text2)' }} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                ['City',       selectedRider.city],
                ['Platform',   selectedRider.platform],
                ['Score',      selectedRider.insuranceScore],
                ['Activity',   `${selectedRider.activityScore}/40`],
                ['Stability',  `${selectedRider.stabilityScore}/30`],
                ['Claim',      `${selectedRider.claimScore}/30`],
                ['Days Active',selectedRider.daysActive],
                ['Nominee',    selectedRider.nomineeName   || '—'],
                ['Nominee Ph.',selectedRider.nomineePhone  || '—'],  // BUG-9 fix
                ['Status',     selectedRider.isActive ? 'Active' : 'Inactive'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>{k}</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{v ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
