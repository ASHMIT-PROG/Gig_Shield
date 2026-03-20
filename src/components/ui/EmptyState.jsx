import { RefreshCw } from 'lucide-react';

export function EmptyState({ icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)' }}>
        {icon || <span className="text-2xl opacity-50">📭</span>}
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color:'var(--text2)' }}>{title||'Nothing here yet'}</h3>
      {message && <p className="text-xs max-w-xs" style={{ color:'var(--text3)' }}>{message}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)' }}>
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-sm font-semibold mb-1" style={{ color:'var(--text2)' }}>Something went wrong</h3>
      <p className="text-xs mb-4" style={{ color:'var(--text3)' }}>{message||'Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background:'rgba(255,255,255,0.05)', color:'var(--text2)', border:'1px solid var(--border)' }}>
          <RefreshCw size={13}/> Retry
        </button>
      )}
    </div>
  );
}
