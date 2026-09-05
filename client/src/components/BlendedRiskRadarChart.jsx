import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

/**
 * BlendedRiskRadarChart - Enterprise 5-Axis Radar Visualization
 * Refined for maximum readability, zero clipping, and Phase 5 theme harmony.
 * 
 * @param {Object} props
 * @param {Object} props.riskData
 * @param {number} props.riskData.blendedRiskScore - Score from 0 to 20+
 * @param {number} props.riskData.grossMarginPercent - Current margin %
 * @param {number} props.riskData.maxDiscountPercent - Deepest discount in lines
 * @param {string} props.riskData.escalationTier - 'SalesRep' | 'SalesManager' | 'Finance'
 * @param {boolean} [props.compact=false]
 */
export function BlendedRiskRadarChart({ riskData = {}, compact = false }) {
  const {
    blendedRiskScore = 0,
    grossMarginPercent = 25,
    maxDiscountPercent = 5,
    escalationTier = 'SalesRep',
  } = riskData;

  // 5 normalized risk dimensions (0.1 = minimal risk, 1.0 = maximum risk)
  const marginRisk = grossMarginPercent < 18 ? 1.0 : Math.max(0.1, Math.min(1.0, (28 - grossMarginPercent) / 10));
  const discountRisk = Math.max(0.1, Math.min(1.0, maxDiscountPercent / 30));
  const escalationRisk = escalationTier === 'Finance' ? 0.95 : escalationTier === 'SalesManager' ? 0.6 : 0.2;
  const scoreRisk = Math.max(0.1, Math.min(1.0, blendedRiskScore / 15));
  const fulfillmentRisk = 0.35;

  const dimensions = [
    { label: 'Margin Risk', value: marginRisk, display: `${grossMarginPercent.toFixed(1)}%` },
    { label: 'Discount Depth', value: discountRisk, display: `${maxDiscountPercent}% max` },
    { label: 'Escalation Tier', value: escalationRisk, display: escalationTier },
    { label: 'Composite Score', value: scoreRisk, display: `${blendedRiskScore.toFixed(1)}/15` },
    { label: 'Fulfillment Split', value: fulfillmentRisk, display: 'Standard' },
  ];

  // Wide dimensions to guarantee ZERO label clipping
  const svgWidth = 320;
  const svgHeight = 270;
  const cx = svgWidth / 2; // 160
  const cy = 138;
  const radius = 78;
  const numAxes = dimensions.length;

  // Projection helper
  const getPoint = (axisIndex, magnitude) => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    return {
      x: cx + radius * magnitude * Math.cos(angle),
      y: cy + radius * magnitude * Math.sin(angle),
    };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];

  // Polygon paths
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const safePoints = dimensions.map((_, i) => getPoint(i, 0.4));
  const safePath = safePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const isHighRisk = blendedRiskScore > 12 || grossMarginPercent < 18;
  const isMediumRisk = blendedRiskScore > 0 || grossMarginPercent < 25;

  const riskColor = isHighRisk
    ? 'var(--danger, #dc2626)'
    : isMediumRisk
    ? 'var(--warning, #d97706)'
    : 'var(--primary, #0284c7)';

  const riskBg = isHighRisk
    ? 'var(--danger-light, #fef2f2)'
    : isMediumRisk
    ? 'var(--warning-light, #fffbeb)'
    : 'var(--primary-light, #e0f2fe)';

  const riskBorder = isHighRisk
    ? 'var(--danger-border, #fecaca)'
    : isMediumRisk
    ? 'var(--warning-border, #fde68a)'
    : '#bae6fd';

  return (
    <div
      className="risk-radar-widget"
      style={{
        padding: '16px 14px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-canvas, #f8fafc)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        boxShadow: 'var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
        <span style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
          Blended Risk Radar
        </span>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '999px',
            backgroundColor: riskBg,
            color: riskColor,
            border: `1px solid ${riskBorder}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {isHighRisk ? <ShieldAlert size={13} /> : isMediumRisk ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
          <span>Score: {Number(blendedRiskScore).toFixed(1)}</span>
        </span>
      </div>

      {/* SVG Radar Chart with wide breathing room */}
      <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id="radarShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Concentric Grid Rings */}
        {rings.map((ring) => {
          const pts = dimensions.map((_, i) => getPoint(i, ring));
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={ring}
              d={path}
              fill={ring === 1.0 ? 'rgba(241, 245, 249, 0.45)' : 'none'}
              stroke="#cbd5e1"
              strokeWidth={ring === 1.0 ? '1.5' : '1'}
              strokeDasharray={ring === 1.0 ? 'none' : '3,3'}
            />
          );
        })}

        {/* Axis Spokes */}
        {dimensions.map((_, i) => {
          const pt = getPoint(i, 1.0);
          return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#cbd5e1" strokeWidth="1.2" />;
        })}

        {/* Safe Benchmark Boundary (Green Dashed) */}
        <path
          d={safePath}
          fill="rgba(5, 150, 105, 0.07)"
          stroke="#059669"
          strokeWidth="1.6"
          strokeDasharray="3,3"
        />

        {/* Current Deal Risk Polygon */}
        <path
          d={dataPath}
          fill={isHighRisk ? 'rgba(220, 38, 38, 0.18)' : isMediumRisk ? 'rgba(217, 119, 6, 0.18)' : 'rgba(2, 132, 199, 0.18)'}
          stroke={riskColor}
          strokeWidth="2.5"
          filter="url(#radarShadow)"
          style={{ transition: 'all 350ms ease' }}
        />

        {/* Data Vertices */}
        {dataPoints.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke={riskColor} strokeWidth="2.5" />
            <circle cx={pt.x} cy={pt.y} r="2" fill={riskColor} />
          </g>
        ))}

        {/* Axis Labels with Adaptive Anchoring & Subtext */}
        {dimensions.map((d, i) => {
          // Compute placement for label outside ring
          const pt = getPoint(i, 1.0);
          let textX = pt.x;
          let textY = pt.y;
          let anchor = 'middle';

          if (i === 0) {
            // Top axis: Margin Risk
            textY = pt.y - 12;
            anchor = 'middle';
          } else if (i === 1) {
            // Top Right: Discount Depth
            textX = pt.x + 10;
            textY = pt.y - 4;
            anchor = 'start';
          } else if (i === 2) {
            // Bottom Right: Escalation Tier
            textX = pt.x + 10;
            textY = pt.y + 10;
            anchor = 'start';
          } else if (i === 3) {
            // Bottom Left: Composite Score
            textX = pt.x - 10;
            textY = pt.y + 10;
            anchor = 'end';
          } else if (i === 4) {
            // Top Left: Fulfillment Split
            textX = pt.x - 10;
            textY = pt.y - 4;
            anchor = 'end';
          }

          return (
            <g key={i}>
              <text
                x={textX}
                y={textY}
                fill="#0f172a"
                fontSize="11"
                fontWeight="700"
                textAnchor={anchor}
                dominantBaseline="central"
                style={{ letterSpacing: '-0.01em' }}
              >
                {d.label}
              </text>
              <text
                x={textX}
                y={textY + 12}
                fill="#64748b"
                fontSize="9.5"
                fontWeight="600"
                textAnchor={anchor}
                dominantBaseline="central"
              >
                {d.display}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', textAlign: 'center', marginTop: '2px' }}>
        <span style={{ color: '#059669', fontWeight: 700 }}>Green dashed boundary</span> indicates safe deal profile (&le; 4.0)
      </div>
    </div>
  );
}

export default BlendedRiskRadarChart;
