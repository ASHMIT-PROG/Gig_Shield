import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CITIES } from '../../constants/cities';
import { PLATFORMS } from '../../constants/platforms';
import toast from 'react-hot-toast';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { currentUser, setRiderProfile } = useAuth();
  const [form, setForm] = useState({ name:'', city:'', platform:'', nomineeName:'', nomineePhone:'' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0); // 0=personal, 1=nominee

  function validate(s) {
    const e = {};
    if (s===0||s===99) {
      if (!form.name.trim()) e.name='Name is required';
      if (!form.city) e.city='Select your city';
      if (!form.platform) e.platform='Select your platform';
    }
    if (s===1||s===99) {
      if (!form.nomineeName.trim()) e.nomineeName='Nominee name is required';
      if (!/^\d{10}$/.test(form.nomineePhone)) e.nomineePhone='Enter valid 10-digit number';
    }
    setErrors(e);
    return Object.keys(e).filter(k=>(s===0?['name','city','platform'].includes(k):['nomineeName','nomineePhone'].includes(k))).length===0;
  }

  function nextStep() { if(validate(0)) setStep(1); }

  async function handleSubmit() {
    if (!validate(1)) return;
    setSaving(true); await new Promise(r=>setTimeout(r,600));
    setRiderProfile({ uid:currentUser?.uid||'mock-uid', name:form.name.trim(), phone:currentUser?.phoneNumber?.replace('+91','')||'', city:form.city, platform:form.platform, nomineeName:form.nomineeName.trim(), nomineePhone:form.nomineePhone, isActive:true, insuranceScore:0, activityScore:0, stabilityScore:0, claimScore:0, avgDailyEarnings:0, totalClaims:0, daysActive:0, role:'rider', createdAt:{ toDate:()=>new Date() } });
    toast.success('Welcome to GigShield! 🎉');
    navigate('/', { replace:true });
    setSaving(false);
  }

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div className="min-h-screen" style={{ background:'var(--bg)' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 px-4 h-14 flex items-center gap-3 z-10" style={{ background:'rgba(10,15,30,0.9)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
          <button onClick={()=>step===0?navigate(-1):setStep(0)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)' }}>
            <ArrowLeft size={15} style={{ color:'var(--text2)' }}/>
          </button>
          <h1 className="font-bold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>
            {step===0?'Personal Info':'Nominee Details'}
          </h1>
          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-1.5">
            {[0,1].map(i=>(
              <div key={i} className="rounded-full transition-all" style={{ width:i===step?20:6, height:6, background:i<=step?'var(--blue)':'rgba(255,255,255,0.1)' }}/>
            ))}
          </div>
        </div>

        <div className="px-4 py-6">
          {step===0 ? (
            <div className="stagger">
              <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(59,130,246,0.15)' }}>
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color:'var(--text)' }}>One-time setup</p>
                  <p className="text-xs" style={{ color:'var(--text3)' }}>Takes under 2 minutes to activate protection</p>
                </div>
              </div>

              <label className="label">Full Name</label>
              <input type="text" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ravi Kumar" className="input-field mb-1"/>
              {errors.name && <p className="text-xs mb-3" style={{ color:'var(--red)' }}>{errors.name}</p>}
              {!errors.name && <div className="mb-3"/>}

              <label className="label">City</label>
              <div className="relative mb-1">
                <select value={form.city} onChange={e=>set('city',e.target.value)} className="input-field appearance-none pr-10">
                  <option value="">Select city…</option>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:'var(--text3)' }}/>
              </div>
              {errors.city && <p className="text-xs mb-3" style={{ color:'var(--red)' }}>{errors.city}</p>}
              {!errors.city && <div className="mb-3"/>}

              <label className="label">Platform</label>
              <div className="flex gap-2 mb-1">
                {PLATFORMS.map(p=>(
                  <button key={p.value} onClick={()=>set('platform',p.value)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1"
                    style={form.platform===p.value
                      ? { background:p.color, color:'white', boxShadow:`0 4px 16px ${p.color}40` }
                      : { background:'rgba(255,255,255,0.04)', color:'var(--text3)', border:'1px solid var(--border)' }}>
                    {form.platform===p.value && <Check size={12}/>}
                    {p.label}
                  </button>
                ))}
              </div>
              {errors.platform && <p className="text-xs mb-3" style={{ color:'var(--red)' }}>{errors.platform}</p>}

              <button onClick={nextStep} className="btn-primary mt-5">
                Continue →
              </button>
            </div>
          ) : (
            <div className="stagger">
              <div className="rounded-2xl p-4 mb-6 flex gap-3" style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)' }}>
                <span className="text-lg">🔒</span>
                <p className="text-sm" style={{ color:'rgba(251,191,36,0.8)' }}>
                  If you're unable to work, payouts automatically go to your nominee.
                </p>
              </div>

              <label className="label">Nominee Full Name</label>
              <input type="text" value={form.nomineeName} onChange={e=>set('nomineeName',e.target.value)} placeholder="Priya Kumar" className="input-field mb-1"/>
              {errors.nomineeName && <p className="text-xs mb-3" style={{ color:'var(--red)' }}>{errors.nomineeName}</p>}
              {!errors.nomineeName && <div className="mb-3"/>}

              <label className="label">Nominee Phone</label>
              <input type="tel" inputMode="numeric" maxLength={10} value={form.nomineePhone}
                onChange={e=>set('nomineePhone',e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder="9876543211" className="input-field font-mono mb-1"/>
              {errors.nomineePhone && <p className="text-xs mb-3" style={{ color:'var(--red)' }}>{errors.nomineePhone}</p>}

              <button onClick={handleSubmit} disabled={saving} className="btn-primary mt-5 flex items-center justify-center gap-2">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Creating profile…</>
                  : '🎉 Activate Protection'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
