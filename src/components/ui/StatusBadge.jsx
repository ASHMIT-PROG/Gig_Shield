const STATUS_MAP = {
  completed: { label:'Paid', cls:'tag-green' },
  processing: { label:'Processing', cls:'tag-amber' },
  pending:    { label:'Pending', cls:'tag-amber' },
  flagged:    { label:'Under Review', cls:'tag-red' },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label:status, cls:'tag-slate' };
  return (
    <span className={`tag ${s.cls} gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />{s.label}
    </span>
  );
}
