import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

/**
 * MarginSpeedometerGauge - Bespoke SVG Radial Arc Gauge
 * Visual deal margin indicator enforcing the 18.0% red-line floor and 25.0% target.
 * 
 * @param {Object} props
 * @param {number} props.margin - Current deal gross margin percentage (e.g. 22.4)
 * @param {boolean} [props.compact=false] - Compact rendering mode
 */
export function MarginSpeedometerGauge({ margin = 0, compact = false }) {
  const numericMargin = Number(margin) || 0;
  
  // Angle mapping: -10% to 50% mapped to -90 deg to +90 deg (180 deg total sweep)
  const minRange = -10;
  const maxRange = 50;
  const clampedMargin = Math.min(maxRange, Math.max(minRange, numericMargin));
  const normalized = (clampedMargin - minRange) / (maxRange - minRange); // 0.0 to 1.0
  const needleAngle = -90 + normalized * 180; // -90 deg (left) to +90 deg (right)

  // Status classification
  const isFloorBreached = numericMargin < 18.0;
  const isTargetAchieved = numericMargin >= 25.0;
  const isManagerRequired = !isFloorBreached && !isTargetAchieved;

  const statusColor = isFloorBreached
    ? 'var(--danger, #ef4444)'
    : isTargetAchieved
    ? 'var(--success, #10b981)'
    : 'var(--warning, #f59e0b)';

  const statusBg = isFloorBreached
    ? 'rgba(239, 68, 68, 0.12)'
    : isTargetAchieved
    ? 'rgba(16, 185, 129, 0.12)'
    : 'rgba(245, 158, 11, 0.12)';

  const statusBorder = isFloorBreached
    ? 'rgba(239, 68, 68, 0.3)'
    : isTargetAchieved
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(245, 158, 11, 0.3)';

  // SVG dimensions
  const width = compact ? 180 : 240;
  const height = compact ? 110 : 145;
  const cx = width / 2;
  const cy = compact ? 95 : 125;
  const r = compact ? 70 : 95;
  const strokeWidth = compact ? 12 : 16;

  // Arc path generator helper
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Convert margin thresholds (-10 to 50) to arc angles (-90 to +90)
  const marginToAngle = (m) => -90 + ((m - minRange) / (maxRange - minRange)) * 180;

  // Track arc paths
  const dangerArc = describeArc(cx, cy, r, marginToAngle(-10), marginToAngle(18));
  const warningArc = describeArc(cx, cy, r, marginToAngle(18), marginToAngle(25));
  const successArc = describeArc(cx, cy, r, marginToAngle(25), marginToAngle(50));

  return (
    <div
      className="margin-gauge-widget"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: compact ? '8px' : '16px 12px',
        borderRadius: '10px',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
          Gross Margin Gauge
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: statusBg,
            color: statusColor,
            border: `1px solid ${statusBorder}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isFloorBreached ? (
            <>
              <AlertOctagon size={11} />
              <span>Floor Breach</span>
            </>
          ) : isTargetAchieved ? (
            <>
              <CheckCircle size={11} />
              <span>Target Met</span>
            </>
          ) : (
            <>
              <AlertTriangle size={11} />
              <span>Manager Gate</span>
            </>
          )}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Track */}
        <path
          d={describeArc(cx, cy, r, -90, 90)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Danger Sector (-10% to 18%) */}
        <path
          d={dangerArc}
          fill="none"
          stroke="rgba(239, 68, 68, 0.85)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Warning Sector (18% to 25%) */}
        <path
          d={warningArc}
          fill="none"
          stroke="rgba(245, 158, 11, 0.85)"
          strokeWidth={strokeWidth}
        />

        {/* Success Sector (25% to 50%) */}
        <path
          d={successArc}
          fill="none"
          stroke="rgba(16, 185, 129, 0.85)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 18% Floor Indicator Line */}
        {(() => {
          const floorPt = polarToCartesian(cx, cy, r + strokeWidth / 2 + 3, marginToAngle(18));
          const floorInner = polarToCartesian(cx, cy, r - strokeWidth / 2 - 3, marginToAngle(18));
          return (
            <line
              x1={floorInner.x}
              y1={floorInner.y}
              x2={floorPt.x}
              y2={floorPt.y}
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="2,2"
            />
          );
        })()}

        {/* 25% Target Indicator Line */}
        {(() => {
          const targetPt = polarToCartesian(cx, cy, r + strokeWidth / 2 + 3, marginToAngle(25));
          const targetInner = polarToCartesian(cx, cy, r - strokeWidth / 2 - 3, marginToAngle(25));
          return (
            <line
              x1={targetInner.x}
              y1={targetInner.y}
              x2={targetPt.x}
              y2={targetPt.y}
              stroke="#10b981"
              strokeWidth="2"
            />
          );
        })()}

        {/* Gauge Needle */}
        <g transform={`translate(${cx}, ${cy}) rotate(${needleAngle})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-(r - 8)}
            stroke={statusColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          <circle cx="0" cy="0" r="6" fill="#1e293b" stroke={statusColor} strokeWidth="2.5" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>

        {/* Scale Labels */}
        <text x={cx - r - 2} y={cy + 14} fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">
          -10%
        </text>
        <text x={cx} y={cy - r + strokeWidth + 14} fill="#f59e0b" fontSize="8" fontWeight="700" textAnchor="middle">
          18% Floor
        </text>
        <text x={cx + r + 2} y={cy + 14} fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">
          50%
        </text>
      </svg>

      {/* Numerical Margin Display */}
      <div style={{ textAlign: 'center', marginTop: '-12px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading, "Inter", sans-serif)',
            fontSize: compact ? '22px' : '28px',
            fontWeight: 800,
            color: statusColor,
            letterSpacing: '-0.02em',
            textShadow: `0 0 16px ${statusBg}`,
            transition: 'color 300ms ease',
          }}
        >
          {numericMargin.toFixed(1)}%
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
          {isFloorBreached
            ? 'Below 18.0% Floor — Finalization Locked'
            : isTargetAchieved
            ? 'Optimal Margin — Rep Self-Approved'
            : '18.0% - 24.9% — Requires Manager Approval'}
        </div>
      </div>
    </div>
  );
}

export default MarginSpeedometerGauge;
