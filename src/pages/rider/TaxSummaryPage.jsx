import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDeliveries } from '../../hooks/useDeliveries';
import { usePayouts } from '../../hooks/usePayouts';
import SectionHeader from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { getFinancialYearStart, getFinancialYearEnd, getCurrentFinancialYear, getFinancialYearLabel } from '../../utils/dateHelpers';
import { formatINR, calculateNetTaxable, calculatePoolContribution } from '../../utils/currencyHelpers';
import { generateTaxPDF } from '../../utils/pdfGenerator';
import { MOCK_MONTHLY_PAYOUTS } from '../../mockData';
import { Download, ChevronDown, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const DarkTooltip = ({ active, payload, label }) => {
  if(!active||!payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
      <p className="font-semibold mb-1" style={{ color:'var(--text2)' }}>{label}</p>
      {payload.map(p=><p key={p.dataKey} className="font-bold" style={{ color:p.color||p.fill }}>{p.name}: {formatINR(p.value)}</p>)}
    </div>
  );
};

export default function TaxSummaryPage() {
  const { riderProfile } = useAuth();
  const curFY = getCurrentFinancialYear();
  const [selFY, setSelFY] = useState(curFY);
  const fyStart = useMemo(()=>getFinancialYearStart(selFY),[selFY]);
  const fyEnd   = useMemo(()=>getFinancialYearEnd(selFY),[selFY]);
  const { totalEarnings, deliveryCount } = useDeliveries(null, fyStart, fyEnd);
  const { payouts } = usePayouts();
  const completedPayouts = useMemo(()=>payouts.filter(p=>{ if(p.status!=='completed') return false; const d=p.paidAt?.toDate?.()||new Date(p.paidAt); return d>=fyStart&&d<=fyEnd; }),[payouts,fyStart,fyEnd]);
  const totalPayouts   = completedPayouts.reduce((s,p)=>s+(p.payoutAmount||0),0);
  const poolDeductions = calculatePoolContribution(deliveryCount);
  const netTaxable     = calculateNetTaxable(totalEarnings, totalPayouts, poolDeductions);
  const fyLabel        = getFinancialYearLabel(selFY);
  const avgEarnings    = Math.round(MOCK_MONTHLY_PAYOUTS.reduce((s,m)=>s+m.earnings,0)/12);
  const curFiscalMonth = new Date().getMonth()>=3?new Date().getMonth()-3:new Date().getMonth()+9;

  function downloadPDF() {
    generateTaxPDF({ riderName:riderProfile?.name, phone:riderProfile?.phone, financialYear:fyLabel, totalEarnings, poolDeductions, payoutsReceived:totalPayouts, netTaxable });
  }

  return (
    <div className="page-enter">
      {/* FY selector row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:'var(--text3)' }}>Financial Year</p>
          <h2 className="text-3xl font-extrabold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>{fyLabel}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={selFY} onChange={e=>setSelFY(Number(e.target.value))}
              className="input-field pr-8 text-sm" style={{ minWidth:160 }}>
              {[curFY,curFY-1,curFY-2].map(y=><option key={y} value={y}>{getFinancialYearLabel(y)}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:'var(--text3)' }}/>
          </div>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
            style={{ background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', color:'white', boxShadow:'0 4px 16px rgba(59,130,246,0.35)' }}>
            <Download size={15}/> Download PDF
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
        {/* Left: Chart */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Net taxable hero */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background:'linear-gradient(135deg,#0c1445,#1D4ED8)', boxShadow:'0 8px 32px rgba(29,78,216,0.3)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{ background:'radial-gradient(circle,rgba(96,165,250,0.3),transparent)', transform:'translate(20%,-20%)', filter:'blur(20px)' }}/>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-blue-200/60">Net Taxable Income</p>
            <p className="text-5xl font-extrabold text-white mb-1" style={{ fontFamily:'Syne,sans-serif' }}>{formatINR(netTaxable)}</p>
            <p className="text-sm text-blue-200/50">{fyLabel} estimate</p>
          </div>

          {/* Monthly chart */}
          <div className="glass-card">
            <SectionHeader title="Monthly Breakdown" subtitle={`Avg earnings: ${formatINR(avgEarnings)}/mo`}/>
            <div className="flex gap-4 mb-4">
              {[['Earnings','rgba(59,130,246,0.7)'],['Payouts','var(--green-bright)']].map(([l,c])=>(
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background:c }}/>
                  <span className="text-xs" style={{ color:'var(--text3)' }}>{l}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-px" style={{ background:'rgba(255,255,255,0.2)', borderTop:'1px dashed rgba(255,255,255,0.2)' }}/>
                <span className="text-xs" style={{ color:'var(--text3)' }}>Average</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MOCK_MONTHLY_PAYOUTS} margin={{ top:8,right:4,left:-16,bottom:0 }} barGap={2} barCategoryGap="25%">
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'var(--text3)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:9, fill:'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v}/>
                <Tooltip content={<DarkTooltip/>} cursor={{ fill:'rgba(255,255,255,0.03)' }}/>
                <ReferenceLine y={avgEarnings} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4"/>
                <Bar dataKey="earnings" name="Earnings" radius={[4,4,0,0]} maxBarSize={18}>
                  {MOCK_MONTHLY_PAYOUTS.map((_,i)=><Cell key={i} fill={i===curFiscalMonth?'#60A5FA':'rgba(59,130,246,0.4)'}/>)}
                </Bar>
                <Bar dataKey="payouts" name="Payouts" radius={[4,4,0,0]} maxBarSize={18}>
                  {MOCK_MONTHLY_PAYOUTS.map((e,i)=><Cell key={i} fill={e.payouts>0?'var(--green)':'rgba(16,185,129,0.15)'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-center mt-2" style={{ color:'var(--text3)' }}>Bright bar = current month · Dashed = monthly average</p>
          </div>
        </div>

        {/* Right: Breakdown + disclaimer */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="rounded-2xl overflow-hidden" style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
            <div className="px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
              <p className="text-sm font-bold" style={{ color:'var(--text)' }}>Income Breakdown</p>
            </div>
            {[
              { label:'Gross Earnings',   value:totalEarnings, color:'var(--text)', Icon:TrendingUp,  iconColor:'var(--blue)',  prefix:'' },
              { label:'Pool Deductions',  value:poolDeductions,color:'var(--red)',  Icon:TrendingDown,iconColor:'var(--red)',   prefix:'-' },
              { label:'Payouts Received', value:totalPayouts,  color:'var(--green-bright)',Icon:TrendingUp,iconColor:'var(--green)',prefix:'+' },
            ].map(({ label, value, color, Icon, iconColor, prefix })=>(
              <div key={label} className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:`${iconColor}15` }}>
                    <Icon size={14} style={{ color:iconColor }}/>
                  </div>
                  <span className="text-sm" style={{ color:'var(--text2)' }}>{label}</span>
                </div>
                <span className="text-sm font-bold font-mono" style={{ color }}>{prefix}{formatINR(value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4" style={{ background:'rgba(59,130,246,0.06)' }}>
              <span className="text-base font-bold" style={{ color:'var(--text)' }}>Net Taxable</span>
              <span className="text-lg font-extrabold font-mono" style={{ color:'var(--blue-bright)' }}>{formatINR(netTaxable)}</span>
            </div>
          </div>

          <div className="rounded-2xl px-5 py-4 flex gap-3"
            style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle size={16} style={{ color:'var(--amber)' }} className="shrink-0 mt-0.5"/>
            <p className="text-sm" style={{ color:'rgba(251,191,36,0.8)' }}>
              This is an estimate for reference only. Consult a qualified tax professional before filing your ITR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
