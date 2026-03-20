export default function SectionHeader({ title, subtitle, badge, badgeColor = 'var(--blue)', action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: `${badgeColor}20`, color: badgeColor }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
