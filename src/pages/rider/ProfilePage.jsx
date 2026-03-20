import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateHelpers';
import { PLATFORMS } from '../../constants/platforms';
import toast from 'react-hot-toast';
import { Pencil, X, LogOut, User, MapPin, Smartphone, Calendar, Shield } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      style={{ background:'rgba(0,0,0,0.6)' }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="rounded-2xl px-8 py-7 w-full max-w-md animate-slide-up"
        style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.05)', color:'var(--text2)' }}>
            <X size={15}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { riderProfile, setRiderProfile, setCurrentUser } = useAuth();
  const [nameModal,   setNameModal]   = useState(false);
  const [nomineeModal,setNomineeModal]= useState(false);
  const [newName,     setNewName]     = useState('');
  const [nominee,     setNominee]     = useState({ name:'', phone:'' });
  const [saving,      setSaving]      = useState(false);

  const initials  = riderProfile?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()||'?';
  const platform  = PLATFORMS.find(p=>p.value===riderProfile?.platform);

  async function saveName() {
    if(!newName.trim()) return;
    setSaving(true); await new Promise(r=>setTimeout(r,400));
    setRiderProfile(p=>({...p,name:newName.trim()}));
    toast.success('Name updated!'); setNameModal(false); setSaving(false);
  }
  async function saveNominee() {
    if(!nominee.name.trim()||!/^\d{10}$/.test(nominee.phone)){ toast.error('Check details'); return; }
    setSaving(true); await new Promise(r=>setTimeout(r,400));
    setRiderProfile(p=>({...p,nomineeName:nominee.name.trim(),nomineePhone:nominee.phone}));
    toast.success('Nominee updated!'); setNomineeModal(false); setSaving(false);
  }
  function handleLogout() { setCurrentUser(null); setRiderProfile(null); navigate('/login',{replace:true}); }

  return (
    <div className="page-enter">
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:24, alignItems:'start' }}>

        {/* Left: Avatar card */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{ background:'var(--surface2)', border:'1px solid var(--border-bright)' }}>
            <div className="absolute top-0 left-0 right-0 h-24 opacity-20 pointer-events-none"
              style={{ background:'linear-gradient(180deg,#3B82F6,transparent)' }}/>
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 relative"
              style={{ background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow:'0 8px 24px rgba(59,130,246,0.4)' }}>
              <span className="text-3xl font-extrabold text-white" style={{ fontFamily:'Syne,sans-serif' }}>{initials}</span>
            </div>
            <h2 className="text-xl font-extrabold mb-1" style={{ fontFamily:'Syne,sans-serif', color:'var(--text)' }}>{riderProfile?.name}</h2>
            <p className="text-sm mb-3" style={{ color:'var(--text3)' }}>+91 {riderProfile?.phone}</p>
            {platform&&(
              <span className="tag text-xs font-bold text-white" style={{ background:platform.color }}>{platform.label} Partner</span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'Score',  value:riderProfile?.insuranceScore||0 },
              { label:'Days',   value:riderProfile?.daysActive||148 },
              { label:'Claims', value:riderProfile?.totalClaims||3 },
            ].map(s=>(
              <div key={s.label} className="stat-pill text-center">
                <span className="text-[10px] uppercase tracking-widest" style={{ color:'var(--text3)' }}>{s.label}</span>
                <span className="text-xl font-bold" style={{ color:'var(--text)', fontFamily:'Syne,sans-serif' }}>{s.value}</span>
              </div>
            ))}
          </div>

          <button onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{ background:'rgba(239,68,68,0.08)', color:'var(--red)', border:'1px solid rgba(239,68,68,0.2)' }}>
            <LogOut size={15}/> Sign Out
          </button>
        </div>

        {/* Right: Details */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Personal */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color:'var(--text)' }}>Personal Details</h3>
              <button onClick={()=>{ setNewName(riderProfile?.name||''); setNameModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background:'rgba(59,130,246,0.1)', color:'var(--blue-bright)', border:'1px solid rgba(59,130,246,0.2)' }}>
                <Pencil size={12}/> Edit Name
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon:User,     label:'Full Name',    value:riderProfile?.name },
                { icon:Smartphone,label:'Phone',       value:riderProfile?.phone?`+91 ${riderProfile.phone}`:'—' },
                { icon:MapPin,   label:'City',         value:riderProfile?.city },
                { icon:Calendar, label:'Member Since', value:formatDate(riderProfile?.createdAt) },
              ].map(({ icon:Icon, label, value })=>(
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:'rgba(255,255,255,0.04)' }}>
                    <Icon size={14} style={{ color:'var(--text3)' }}/>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium mb-0.5" style={{ color:'var(--text3)' }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color:'var(--text)' }}>{value||'—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nominee */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color:'var(--text)' }}>Nominee Details</h3>
                <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>Receives payouts if you're unavailable</p>
              </div>
              <button onClick={()=>{ setNominee({ name:riderProfile?.nomineeName||'', phone:riderProfile?.nomineePhone||'' }); setNomineeModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background:'rgba(59,130,246,0.1)', color:'var(--blue-bright)', border:'1px solid rgba(59,130,246,0.2)' }}>
                <Pencil size={12}/> Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon:Shield,     label:'Name',  value:riderProfile?.nomineeName },
                { icon:Smartphone, label:'Phone', value:riderProfile?.nomineePhone },
              ].map(({ icon:Icon, label, value })=>(
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:'rgba(255,255,255,0.04)' }}>
                    <Icon size={14} style={{ color:'var(--text3)' }}/>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium mb-0.5" style={{ color:'var(--text3)' }}>{label}</p>
                    <p className="text-sm font-semibold font-mono" style={{ color:'var(--text)' }}>{value||'—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {nameModal&&(
        <Modal title="Edit Name" onClose={()=>setNameModal(false)}>
          <label className="label">Full Name</label>
          <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} className="input-field mb-6" autoFocus/>
          <button onClick={saveName} disabled={saving} className="btn-primary">{saving?'Saving…':'Save Name'}</button>
        </Modal>
      )}
      {nomineeModal&&(
        <Modal title="Edit Nominee" onClose={()=>setNomineeModal(false)}>
          <label className="label">Nominee Name</label>
          <input type="text" value={nominee.name} onChange={e=>setNominee(n=>({...n,name:e.target.value}))} className="input-field mb-4"/>
          <label className="label">Nominee Phone</label>
          <input type="tel" inputMode="numeric" maxLength={10} value={nominee.phone}
            onChange={e=>setNominee(n=>({...n,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))}
            className="input-field font-mono mb-6"/>
          <button onClick={saveNominee} disabled={saving} className="btn-primary">{saving?'Saving…':'Save Nominee'}</button>
        </Modal>
      )}
    </div>
  );
}
