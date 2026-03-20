export default function LoadingSpinner({ fullScreen=true }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-2xl relative" style={{ background:'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow:'0 4px 20px rgba(59,130,246,0.4)' }}>
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white absolute inset-0 m-auto"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg>
      </div>
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:'var(--blue)', animation:`pulse .9s ${i*.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
  if (!fullScreen) return spinner;
  return <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background:'var(--bg)' }}>{spinner}</div>;
}
