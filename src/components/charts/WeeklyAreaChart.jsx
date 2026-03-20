import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DarkTooltip = ({ active, payload, label, formatValue }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs"
      style={{ background: 'var(--surface2)', border: '1px solid var(--border-bright)', color: 'var(--text)' }}>
      <p style={{ color: 'var(--text3)' }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color: 'var(--blue-bright)' }}>
        {formatValue ? formatValue(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
};

export default function WeeklyAreaChart({ data, color = '#3B82F6', height = 100, showTooltip = true, formatValue, id = 'wac' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        {showTooltip && (
          <Tooltip content={<DarkTooltip formatValue={formatValue} />}
            cursor={{ stroke: `${color}40`, strokeWidth: 1 }} />
        )}
        <Area
          type="monotone" dataKey="value"
          stroke={color} strokeWidth={2}
          fill={`url(#grad-${id})`}
          dot={false} activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
