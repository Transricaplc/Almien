import { memo, useEffect, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface Props {
  score: number;       // 0-100
  location?: string;   // e.g. "Cape Town Central · Ward 57"
  onChangeLocation?: () => void;
}

const SIZE = 200;
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16,
        position: 'relative',
        background: 'rgba(255,0,255,0.15)', // DEBUG
        zIndex: 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: SIZE,
          height: SIZE,
          flex: '0 0 auto',
          background: 'rgba(0,255,255,0.15)', // DEBUG
        }}
      >
        {/* Ring outer labels */}
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#555',
            letterSpacing: '0.2em',
          }}
        >
          GUARDIAN
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            right: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#555',
            letterSpacing: '0.2em',
          }}
        >
          DARK ZONE
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            left: 0,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#555',
            letterSpacing: '0.2em',
          }}
        >
          COMMUNITY
        </span>

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ display: 'block', position: 'absolute', inset: 0, background: 'rgba(255,255,0,0.2)' }}
        >
          {/* Track */}
          <circle cx="100" cy="100" r={RADIUS} stroke="#FF00FF" strokeWidth="6" fill="none" />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={animate ? offset : CIRC}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>

        {/* Inner content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 52,
                lineHeight: 1,
                color: '#fff',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </span>
            <span style={{ marginLeft: 4, fontSize: 13, color: '#555' }}>/ 100</span>
          </div>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              color,
              marginTop: 8,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Location pill */}
      <button
        onClick={onChangeLocation}
        style={{
          marginTop: 12,
          fontSize: 12,
          color: '#555',
          background: 'transparent',
          border: 'none',
          cursor: onChangeLocation ? 'pointer' : 'default',
        }}
      >
        {location}
      </button>
    </div>
  );
});

ScoreRing.displayName = 'ScoreRing';
export default ScoreRing;
