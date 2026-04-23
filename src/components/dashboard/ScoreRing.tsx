import { memo, useEffect, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface Props {
  score: number;       // 0-100
  location?: string;   // e.g. "Cape Town Central · Ward 57"
  onChangeLocation?: () => void;
}

const RADIUS = 88;
const CIRC = 2 * Math.PI * RADIUS; // ≈ 553

function tier(score: number) {
  if (score >= 80) return { label: 'SECURE',    color: '#00FF85' };
  if (score >= 60) return { label: 'MODERATE',  color: '#FF9500' };
  if (score >= 40) return { label: 'ELEVATED',  color: '#FF9500' };
  return              { label: 'HIGH RISK', color: '#FF3B30' };
}

const ScoreRing = memo(({ score, location = 'Cape Town Central · Ward 57', onChangeLocation }: Props) => {
  const value = useCountUp(score, 1100);
  const { label, color } = tier(score);
  const offset = CIRC - (score / 100) * CIRC;

  // Trigger draw animation after mount
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center mt-4 relative">
      {/* Ring outer labels */}
      <div className="relative w-[200px] h-[200px]">
        <span className="label-micro absolute -top-1 right-0 text-[9px]">GUARDIAN</span>
        <span className="label-micro absolute -bottom-1 right-0 text-[9px]">DARK ZONE</span>
        <span className="label-micro absolute -bottom-1 left-0 text-[9px]">COMMUNITY</span>

        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r={RADIUS} stroke="#111" strokeWidth="6" fill="none" />
          {/* Progress arc */}
          <circle
            cx="100" cy="100" r={RADIUS}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={animate ? offset : CIRC}
            transform="rotate(-90 100 100)"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </svg>

        {/* Inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-baseline">
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }} className="text-[52px] leading-none text-white tabular-nums">
              {value}
            </span>
            <span className="ml-1 text-[13px] text-[#555]">/ 100</span>
          </div>
          <span
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color }}
            className="mt-2 text-[11px] uppercase"
            // letter-spacing inline since arbitrary tracking is fine here
          >
            <span style={{ letterSpacing: '0.15em' }}>{label}</span>
          </span>
        </div>
      </div>

      {/* Location pill */}
      <button
        onClick={onChangeLocation}
        className="mt-3 text-[12px] text-[#555] hover:text-white transition-colors"
      >
        {location}
      </button>
    </div>
  );
});

ScoreRing.displayName = 'ScoreRing';
export default ScoreRing;
