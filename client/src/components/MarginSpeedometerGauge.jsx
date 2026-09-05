import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * MarginSpeedometerGauge - Enterprise Executive Radial Arc Gauge
 * High-visibility typography, prominent callout badges, and zero clipping.
 * 
 * @param {Object} props
 * @param {number} props.margin - Deal gross margin percentage (e.g. 24.5)
 * @param {boolean} [props.compact=false] - Compact rendering mode
 */
export function MarginSpeedometerGauge({ margin = 0, compact = false }) {
  const numericMargin = Number(margin) || 0;

  // Scale: -10% to +50% mapped to -90 deg to +90 deg (180 deg sweep)
  const minRange = -10;
  const maxRange = 50;
  const clampedMargin = Math.min(maxRange, Math.max(minRange, numericMargin));
  const normalized = (clampedMargin - minRange) / (maxRange - minRange);
  const needleAngle = -90 + normalized * 180;

  // Status classification strictly aligned with Phase 5 tokens
  const isFloorBreached = numericMargin < 18.0;
  const isTargetAchieved = numericMargin >= 25.0;
  const isManagerRequired = !isFloorBreached && !isTargetAchieved;

  const statusColor = isFloorBreached
    ? 'var(--danger, #dc2626)'
    : isTargetAchieved
    ? 'var(--success, #059669)'
    : 'var(--warning, #d97706)';

  const statusBg = isFloorBreached
    ? 'var(--danger-light, #fef2f2)'
    : isTargetAchieved
    ? 'var(--success-light, #ecfdf5)'
    : 'var(--warning-light, #fffbeb)';

  const statusBorder = isFloorBreached
    ? 'var(--danger-border, #fecaca)'
    : isTargetAchieved
    ? 'var(--success-border, #a7f3d0)'
    : 'var(--warning-border, #fde68a)';

  // Spacious SVG dimensions
  const svgWidth = 280;
  const svgHeight = 165;
  const cx = svgWidth / 2; // 140
  const cy = 135;
  const r = 90;
  const strokeWidth = 16;

  // Arc path generator
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

  const marginToAngle = (m) => -90 + ((m - minRange) / (maxRange - minRange)) * 180;

  // Arc sectors
  const dangerArc = describeArc(cx, cy, r, marginToAngle(-10), marginToAngle(18));
  const warningArc = describeArc(cx, cy, r, marginToAngle(18), marginToAngle(25));
  const successArc = describeArc(cx, cy, r, marginToAngle(25), marginToAngle(50));

  // Threshold coordinates
  const floorAngle = marginToAngle(18);
  const targetAngle = marginToAngle(25);
  const floorInner = polarToCartesian(cx, cy, r - strokeWidth / 2 - 4, floorAngle);
  const floorOuter = polarToCartesian(cx, cy, r + strokeWidth / 2 + 6, floorAngle);
  const targetInner = polarToCartesian(cx, cy, r - strokeWidth / 2 - 4, targetAngle);
  const targetOuter = polarToCartesian(cx, cy, r + strokeWidth / 2 + 6, targetAngle);

  // Callout positions above arc
  const floorLabelPos = polarToCartesian(cx, cy, r + strokeWidth / 2 + 18, floorAngle);
  const targetLabelPos = polarToCartesian(cx, cy, r + strokeWidth / 2 + 18, targetAngle);

  return (
    <div
      className="margin-gauge-widget"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 14px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-canvas, #f8fafc)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        boxShadow: 'var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
        <span style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
          Gross Margin Health
        </span>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '999px',
            backgroundColor: statusBg,
            color: statusColor,
            border: `1px solid ${statusBorder}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {isFloorBreached ? (
            <>
              <AlertOctagon size={13} />
              <span>Floor Breach</span>
            </>
          ) : isTargetAchieved ? (
            <>
              <CheckCircle size={13} />
              <span>Target Met</span>
            </>
          ) : (
            <>
              <AlertTriangle size={13} />
              <span>Manager Gate</span>
            </>
          )}
        </span>
      </div>

      {/* SVG Radial Arc Gauge */}
      <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id="gaugeDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
          <filter id="needleShadowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Outer subtle guide ring */}
        <path
          d={describeArc(cx, cy, r + strokeWidth / 2 + 2, -90, 90)}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeDasharray="2,3"
        />

        {/* Base Track */}
        <path
          d={describeArc(cx, cy, r, -90, 90)}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Danger Sector (-10% to 18%): Red #dc2626 */}
        <path
          d={dangerArc}
          fill="none"
          stroke="#dc2626"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#gaugeDropShadow)"
        />

        {/* Warning Sector (18% to 25%): Amber #d97706 */}
        <path
          d={warningArc}
          fill="none"
          stroke="#d97706"
          strokeWidth={strokeWidth}
          filter="url(#gaugeDropShadow)"
        />

        {/* Success Sector (25% to 50%): Emerald #059669 */}
        <path
          d={successArc}
          fill="none"
          stroke="#059669"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#gaugeDropShadow)"
        />

        {/* 18% Floor Tick Line */}
        <line
          x1={floorInner.x}
          y1={floorInner.y}
          x2={floorOuter.x}
          y2={floorOuter.y}
          stroke="#dc2626"
          strokeWidth="3"
        />

        {/* 25% Target Tick Line */}
        <line
          x1={targetInner.x}
          y1={targetInner.y}
          x2={targetOuter.x}
          y2={targetOuter.y}
          stroke="#059669"
          strokeWidth="3"
        />

        {/* 18% Floor Callout Label */}
        <g transform={`translate(${floorLabelPos.x - 42}, ${floorLabelPos.y - 12})`}>
          <rect width="48" height="18" rx="4" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
          <text x="24" y="12" fill="#b91c1c" fontSize="10" fontWeight="800" textAnchor="middle">
            18% Floor
          </text>
        </g>

        {/* 25% Target Callout Label */}
        <g transform={`translate(${targetLabelPos.x + 2}, ${targetLabelPos.y - 12})`}>
          <rect width="52" height="18" rx="4" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
          <text x="26" y="12" fill="#047857" fontSize="10" fontWeight="800" textAnchor="middle">
            25% Target
          </text>
        </g>

        {/* Gauge Needle */}
        <g transform={`translate(${cx}, ${cy}) rotate(${needleAngle})`} filter="url(#needleShadowFilter)">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-(r - 4)}
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          <line
            x1="0"
            y1={-(r - 22)}
            x2="0"
            y2={-(r - 4)}
            stroke={statusColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="8" fill="#0f172a" />
          <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
        </g>

        {/* Scale Endpoints Labels */}
        <text x={cx - r - 2} y={cy + 18} fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">
          -10%
        </text>
        <text x={cx + r + 2} y={cy + 18} fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">
          50%
        </text>
      </svg>

      {/* Digital Numeric Display */}
      <div style={{ textAlign: 'center', marginTop: '-6px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            fontSize: '32px',
            fontWeight: 800,
            color: statusColor,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            transition: 'color 300ms ease',
          }}
        >
          {numericMargin.toFixed(1)}%
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', fontWeight: 600, marginTop: '3px' }}>
          {isFloorBreached
            ? 'Below 18.0% Floor — Finalization Blocked'
            : isTargetAchieved
            ? 'Optimal Margin — Rep Self-Approval'
            : '18.0% - 24.9% — Requires Manager Review'}
        </div>
      </div>
    </div>
  );
}

export default MarginSpeedometerGauge;
