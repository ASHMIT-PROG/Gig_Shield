import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { getScoreColor, getScoreLabel } from '../../utils/scoreHelpers';

export default function ScoreGauge({ score = 0, size = 'large' }) {
  const color   = getScoreColor(score);
  const label   = getScoreLabel(score);
  const isLarge = size === 'large';
  const dim     = isLarge ? 200 : 120;
  const innerR  = isLarge ? 62 : 38;
  const outerR  = isLarge ? 90 : 54;
  const data    = [{ value: score, fill: color }];

  return (
    <div className="flex flex-col items-center">
      {/* BUG-4 fix: use CSS filter instead of broken glow div */}
      <div className="relative" style={{ width: dim, height: dim, filter: `drop-shadow(0 0 ${isLarge ? 16 : 10}px ${color}66)` }}>
        <RadialBarChart
          width={dim} height={dim}
          cx={dim / 2} cy={dim / 2}
          innerRadius={innerR} outerRadius={outerR}
          barSize={isLarge ? 12 : 9}
          data={data} startAngle={225} endAngle={-45}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.05)' }}
            dataKey="value" angleAxisId={0} cornerRadius={6}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-extrabold leading-none"
            style={{ fontSize: isLarge ? 38 : 24, color, fontFamily: 'Syne, sans-serif' }}>
            {score}
          </span>
          {isLarge && (
            <span className="text-xs font-semibold mt-1" style={{ color }}>{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
