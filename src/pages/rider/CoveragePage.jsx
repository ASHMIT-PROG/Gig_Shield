import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ScoreGauge from '../../components/ui/ScoreGauge';
import SectionHeader from '../../components/ui/SectionHeader';
import { ScoreBreakdownCard } from '../../components/cards/index';
import { getLoanEligibility, getScoreLabel, getScoreColor } from '../../utils/scoreHelpers';
import { formatINR } from '../../utils/currencyHelpers';
import { MOCK_SCORE_HISTORY } from '../../mockData';
import { TrendingUp, Star, Info, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';

function useCountUp(target, duration=1200) {
  const [val, setVal] = useState(0);
  useEffect(()=>{
    let start=null;
    const step=(ts)=>{ if(!start) start=ts; const p=Math.min((ts-start)/duration,1); setVal(Math.round(target*(1-Math.pow(1-p,3)))); if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  },[target,duration]);
  return val;
}

const ScoreTooltip = ({ active, payload, label }) => {
  if(!active||!payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
      <p style={{ color:'var(--text3)' }}>{label}</p>
      <p className="font-bold" style={{ color:'var(--text)' }}>{payload[0].value} pts</p>
    </div>
  );
};

export default function CoveragePage() {
  const { riderProfile } = useAuth();
  const actualScore = riderProfile?.insuranceScore || 0;
  const score  = useCountUp(actualScore, 1200);
  const loan   = getLoanEligibility(actualScore);
  const color  = getScoreColor(actualScore);
  const label  = getScoreLabel(actualScore);
  const improvement = actualScore - (MOCK_SCORE_HISTORY[0]?.score||0);

  const milestones = [
    { score:40,  label:'Fair',      locked:actualScore<40  },
    { score:60,  label:'Loan',      locked:actualScore<60  },
    { score:80,  label:'Excellent', locked:actualScore<80  },
    { score:100, label:'Elite',     locked:actualScore<100 },
  ];

  return (
    <div className="page-enter stagger">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' }}>

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Score hero */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-20"
              style={{ background:`radial-gradient(circle,${color},transparent)`, filter:'blur(40px)', transform:'translate(20%,-20%)' }}/>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color:'var(--text3)' }}>Insurance Score</p>
            <div className="flex items-center gap-6 overflow-hidden">
              <div className="shrink-0">
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-7xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', color }}>{score}</span>
                  <span className="text-3xl mb-2" style={{ color:'var(--text3)' }}>/100</span>
                </div>
                <span className="tag" style={{ background:`${color}20`, color }}>{label} Level</span>
                <p className="text-xs mt-3" style={{ color:'var(--text3)' }}>Updated nightly by GigShield AI</p>
              </div>
              <div className="shrink-0">
                <ScoreGauge score={score} size="large"/>
              </div>
            </div>
          </div>

          {/* Loan */}
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={loan.eligible
              ?{background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)'}
              :{background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)'}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:loan.eligible?'rgba(16,185,129,0.15)':'rgba(255,255,255,0.05)' }}>
              {loan.eligible?<TrendingUp size={22} style={{ color:'var(--green)' }}/>:<Lock size={22} style={{ color:'var(--text3)' }}/>}
            </div>
            <div className="flex-1">
              <p className="text-base font-bold" style={{ color:loan.eligible?'var(--green-bright)':'var(--text2)' }}>{loan.message}</p>
              <p className="text-sm mt-0.5" style={{ color:loan.eligible?'rgba(52,211,153,0.7)':'var(--text3)' }}>
                {loan.eligible?`Emergency loan up to ${formatINR(loan.limit)}`:'Reach score 60 to unlock loans'}
              </p>
            </div>
            {loan.eligible&&<Star size={22} style={{ color:'var(--green)', fill:'var(--green)' }}/>}
          </div>

          {/* Milestones */}
          <div className="glass-card">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color:'var(--text3)' }}>Milestones</p>
            <div className="flex items-center justify-between">
              {milestones.map(m=>(
                <div key={m.score} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:!m.locked?`${color}20`:'rgba(255,255,255,0.04)', border:`1px solid ${!m.locked?color:'var(--border)'}` }}>
                    {m.locked?<Lock size={14} style={{ color:'var(--text3)' }}/>:<Star size={14} style={{ color, fill:color }}/>}
                  </div>
                  <span className="text-xs font-bold" style={{ color:m.locked?'var(--text3)':color }}>{m.label}</span>
                  <span className="text-xs" style={{ color:'var(--text3)' }}>{m.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <ScoreBreakdownCard activityScore={riderProfile?.activityScore} stabilityScore={riderProfile?.stabilityScore} claimScore={riderProfile?.claimScore}/>

          {/* Score history chart */}
          <div className="glass-card">
            <SectionHeader title="Score History" subtitle="Past 8 weeks" badge={`+${improvement} pts`} badgeColor={color}/>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={MOCK_SCORE_HISTORY} margin={{ top:8, right:8, left:-28, bottom:0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--text3)' }} axisLine={false} tickLine={false}/>
                <YAxis domain={[30,100]} hide/>
                <Tooltip content={<ScoreTooltip/>}/>
                <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2.5} fill="url(#scoreGrad)" dot={false}
                  activeDot={{ r:4, fill:color, stroke:'#fff', strokeWidth:2 }}/>
                <ReferenceDot x={MOCK_SCORE_HISTORY[MOCK_SCORE_HISTORY.length-1].week} y={actualScore} r={6} fill={color} stroke="#fff" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* How it's calculated */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-4">
              <Info size={15} style={{ color:'var(--text3)' }}/>
              <h3 className="text-sm font-semibold" style={{ color:'var(--text2)' }}>How it's calculated</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon:'📦', title:'Activity (40 pts)',      desc:'Deliveries completed & active days on platform' },
                { icon:'📈', title:'Stability (30 pts)',     desc:'Earnings consistency over rolling 90 days' },
                { icon:'🛡️', title:'Claim History (30 pts)', desc:'Accurate claims & low fraud indicators' },
              ].map(item=>(
                <div key={item.title} className="flex gap-3">
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color:'var(--text)' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
