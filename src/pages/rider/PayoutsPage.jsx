import { useState, useMemo } from 'react';
import { usePayouts } from '../../hooks/usePayouts';
import { PayoutCard } from '../../components/cards/index';
import { EmptyState } from '../../components/ui/EmptyState';
import SectionHeader from '../../components/ui/SectionHeader';
import { formatINR } from '../../utils/currencyHelpers';
import { MOCK_PAYOUTS } from '../../mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { List, GitBranch, TrendingUp } from 'lucide-react';
import toast from "react-hot-toast";

const FILTERS = ['All','Completed','Pending','Flagged'];
const EVT_COLORS = { rain:'#3B82F6', aqi:'#F59E0B', curfew:'#EF4444' };
const EVT_LABELS = { rain:'Rain', aqi:'AQI', curfew:'Curfew' };

const DarkTooltip = ({ active, payload }) => {
  if (!active||!payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
      <p className="font-bold" style={{ color:'var(--text)' }}>{EVT_LABELS[payload[0].name]||payload[0].name}</p>
      <p style={{ color:'var(--text2)' }}>{formatINR(payload[0].value)}</p>
    </div>
  );
};

function groupByMonth(payouts) {
  const g = {};
  payouts.forEach(p=>{
    const d = p.paidAt?.toDate?.() || new Date();
    const k = d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
    if(!g[k]) g[k]=[];
    g[k].push(p);
  });
  return Object.entries(g);
}

export default function PayoutsPage() {
  const checkPayoutAPI = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/payout/check");
    const data = await res.json();
    alert(data.message); // simple popup
  } catch (err) {
    alert("API error");
  }
};
  const { payouts } = usePayouts();
  const [filter,  setFilter]  = useState('All');
  const [viewMode,setViewMode]= useState('list');

  const filtered = payouts.filter(p=>{
    if(filter==='All')       return true;
    if(filter==='Completed') return p.status==='completed';
    if(filter==='Pending')   return p.status==='pending'||p.status==='processing';
    if(filter==='Flagged')   return p.status==='flagged';
    return true;
  });

  const totalPaid = payouts.filter(p=>p.status==='completed').reduce((s,p)=>s+(p.payoutAmount||0),0);
  const donutData = useMemo(()=>{
    const g={};
    MOCK_PAYOUTS.forEach(p=>{ if(!g[p.eventType]) g[p.eventType]=0; g[p.eventType]+=p.payoutAmount||0; });
    return Object.entries(g).map(([name,value])=>({name,value}));
  },[]);
  const timelineGroups = useMemo(()=>groupByMonth(filtered),[filtered]);

  return (
    <div className="page-enter">
      {/* Desktop 2-col */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start' }}>

        {/* Left: List */}
        <div>
          {/* Summary bar */}


  <button
    onClick={checkPayoutAPI}
    style={{
      marginBottom: "16px",
      padding: "10px 16px",
      borderRadius: "10px",
      background: "#3B82F6",
      color: "white",
      fontWeight: "600",
      border: "none"
    }}
  >
    Trigger Payout 💸
  </button>

  <div className="rounded-2xl p-5 mb-4 flex items-center justify-between"
            style={{ background:'linear-gradient(135deg,#052e16,#166534)', border:'1px solid rgba(16,185,129,0.2)' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color:'rgba(52,211,153,0.6)' }}>Total Received</p>
              <p className="text-4xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', color:'var(--green-bright)' }}>{formatINR(totalPaid)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color:'rgba(52,211,153,0.6)' }}>{payouts.length} total payouts</p>
              <p className="text-sm" style={{ color:'rgba(52,211,153,0.6)' }}>{payouts.filter(p=>p.status==='completed').length} paid out</p>
            </div>
          </div>

          {/* Filter + toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {FILTERS.map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={filter===f
                    ?{background:'var(--blue)',color:'white',boxShadow:'0 2px 12px rgba(59,130,246,0.3)'}
                    :{background:'rgba(255,255,255,0.05)',color:'var(--text3)',border:'1px solid var(--border)'}}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={()=>setViewMode(v=>v==='list'?'timeline':'list')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background:viewMode==='timeline'?'rgba(59,130,246,0.15)':'rgba(255,255,255,0.05)', color:viewMode==='timeline'?'var(--blue-bright)':'var(--text3)', border:'1px solid var(--border)' }}>
              {viewMode==='list'?<><GitBranch size={14}/>Timeline</>:<><List size={14}/>List</>}
            </button>
          </div>

          {filtered.length===0
            ?<EmptyState title="No payouts" message="Protection payouts will appear here."/>
            :viewMode==='list'
              ?<div className="space-y-3">{filtered.map(p=><PayoutCard key={p.id} payout={p}/>)}</div>
              :<div>
                {timelineGroups.map(([month,items])=>(
                  <div key={month} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1" style={{ background:'var(--border)' }}/>
                      <div className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background:'rgba(59,130,246,0.1)',color:'var(--blue-bright)',border:'1px solid rgba(59,130,246,0.2)' }}>
                        {month} · {items.length} payouts · {formatINR(items.reduce((s,p)=>s+p.payoutAmount,0))}
                      </div>
                      <div className="h-px flex-1" style={{ background:'var(--border)' }}/>
                    </div>
                    <div className="space-y-3">{items.map(p=><PayoutCard key={p.id} payout={p}/>)}</div>
                  </div>
                ))}
              </div>}
        </div>

        {/* Right: Donut + stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="glass-card">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:'var(--text3)' }}>By Event Type</p>
            <div style={{ height:140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={42} outerRadius={60}
                    dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                    {donutData.map(e=><Cell key={e.name} fill={EVT_COLORS[e.name]||'#64748B'} stroke="transparent"/>)}
                  </Pie>
                  <Tooltip content={<DarkTooltip/>}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-2">
              {donutData.map(d=>(
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background:EVT_COLORS[d.name]||'#64748B' }}/>
                  <p className="text-sm font-medium flex-1" style={{ color:'var(--text)' }}>{EVT_LABELS[d.name]||d.name}</p>
                  <p className="text-sm font-bold font-mono" style={{ color:'var(--green-bright)' }}>{formatINR(d.value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          {[
            { label:'Completed', value:payouts.filter(p=>p.status==='completed').length, color:'var(--green-bright)' },
            { label:'Processing', value:payouts.filter(p=>p.status==='processing').length, color:'var(--amber)' },
            { label:'Flagged', value:payouts.filter(p=>p.status==='flagged').length, color:'var(--red)' },
          ].map(s=>(
            <div key={s.label} className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
              <span className="text-sm" style={{ color:'var(--text2)' }}>{s.label}</span>
              <span className="text-lg font-bold" style={{ color:s.color, fontFamily:'Syne,sans-serif' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
