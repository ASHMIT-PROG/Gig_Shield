import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_RIDER, MOCK_ADMIN } from '../../mockData';
import toast from 'react-hot-toast';
import { ArrowRight, Phone } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser, setRiderProfile } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  async function handleSendOTP() {
    setError('');
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit number'); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setStep('otp');
    toast.success('OTP sent! Use 123456');
    setSending(false);
  }

  async function handleVerifyOTP() {
    setError('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    if (otp !== '123456') { setError('Wrong OTP — use 123456 for demo'); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 700));
    const isAdmin = phone === '0000000000';
    const profile = isAdmin ? { ...MOCK_ADMIN, phone } : { ...MOCK_RIDER, phone };
    setCurrentUser({ uid: profile.uid, phoneNumber: '+91' + phone });
    setRiderProfile(profile);
    toast.success(isAdmin ? 'Admin logged in 🔐' : 'Welcome back! 🎉');
    navigate('/', { replace: true });
    setVerifying(false);
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-40 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12 relative z-10">

        {/* Logo mark */}
        <div className="relative mb-8 animate-float">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', boxShadow: '0 8px 32px rgba(59,130,246,0.4)' }}>
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
              <path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/>
            </svg>
          </div>
          {/* Orbit ring */}
          <div className="absolute inset-0 rounded-3xl border-2 opacity-30"
            style={{ borderColor: '#3B82F6', transform: 'scale(1.2)', animation: 'spin-slow 8s linear infinite' }} />
        </div>

        <h1 className="text-5xl font-extrabold mb-2 tracking-tight" style={{ fontFamily:'Syne,sans-serif' }}>
          <span className="grad-blue">Gig</span><span style={{ color:'var(--text)' }}>Shield</span>
        </h1>
        <p className="text-center text-sm mb-8" style={{ color:'var(--text2)' }}>
          AI-powered parametric income protection
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {[
            { icon:'🌧️', label:'Rain Coverage' },
            { icon:'🌫️', label:'AQI Protection' },
            { icon:'🚔', label:'Curfew Shield' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid var(--border-bright)', color:'var(--text2)' }}>
              {f.icon} {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="relative z-10 rounded-t-3xl px-6 pt-8 pb-12"
        style={{ background: 'var(--surface)', border:'1px solid var(--border)', borderBottom:'none' }}>

        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background:'var(--border-bright)' }} />

        <h2 className="text-xl font-bold mb-1" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>
          {step === 'phone' ? 'Sign In' : 'Verify OTP'}
        </h2>
        <p className="text-sm mb-6" style={{ color:'var(--text2)' }}>
          {step === 'phone' ? 'Enter any 10-digit number' : <>Code sent to <span style={{ color:'var(--blue-bright)' }}>+91 {phone}</span></>}
        </p>

        {step === 'phone' ? (
          <>
            <label className="label">Phone Number</label>
            <div className="flex gap-2 mb-1">
              <div className="flex items-center px-3 rounded-xl shrink-0"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border-bright)' }}>
                <Phone size={13} style={{ color:'var(--text3)' }} className="mr-1.5" />
                <span className="text-sm font-mono" style={{ color:'var(--text2)' }}>+91</span>
              </div>
              <input type="tel" inputMode="numeric" maxLength={10} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder="9876543210" className="input-field flex-1 font-mono text-base tracking-wider"
                onKeyDown={e => e.key==='Enter' && handleSendOTP()} />
            </div>
            {error && <p className="text-xs mt-1.5 mb-1" style={{ color:'var(--red)' }}>{error}</p>}
            <p className="text-xs mt-2 mb-5" style={{ color:'var(--text3)' }}>
              💡 Admin login: <span className="font-mono" style={{ color:'var(--text2)' }}>0000000000</span>
            </p>
            <button onClick={handleSendOTP} disabled={sending || phone.length!==10} className="btn-primary flex items-center justify-center gap-2">
              {sending
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                : <>Send OTP <ArrowRight size={16}/></>}
            </button>
          </>
        ) : (
          <>
            <label className="label">6-Digit Code</label>
            <input type="tel" inputMode="numeric" maxLength={6} value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
              placeholder="• • • • • •"
              className="input-field text-center text-3xl tracking-[0.6em] font-mono mb-1"
              onKeyDown={e => e.key==='Enter' && handleVerifyOTP()} autoFocus />
            {error && <p className="text-xs mt-1.5 mb-1" style={{ color:'var(--red)' }}>{error}</p>}
            <button onClick={handleVerifyOTP} disabled={verifying || otp.length!==6} className="btn-primary mt-4 flex items-center justify-center gap-2">
              {verifying
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</>
                : <>Verify & Enter <ArrowRight size={16}/></>}
            </button>
            <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
              className="w-full text-center text-sm mt-3" style={{ color:'var(--text3)' }}>
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
