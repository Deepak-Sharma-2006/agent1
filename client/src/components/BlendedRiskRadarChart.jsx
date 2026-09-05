import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

/**
 * BlendedRiskRadarChart - Bespoke React SVG 5-Axis Radar Chart
 * Maps multi-dimensional deal governance risk across:
 * 1. Margin Health
 * 2. Discount Severity
 * 3. Customer Credit Hygiene
 * 4. Inventory Complexity
 * 5. Escalation Severity
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

  // Derive 5 normalized risk dimensions (0.0 = minimal risk, 1.0 = maximum risk)
  // 1. Margin Risk (18% floor = 1.0, >= 28% = 0.1)
  const marginRisk = grossMarginPercent < 18 ? 1.0 : Math.max(0.1, Math.min(1.0, (28 - grossMarginPercent) / 10));

  // 2. Discount Risk (0% = 0.1, 15% = 0.5, >= 30% = 1.0)
  const discountRisk = Math.max(0.1, Math.min(1.0, maxDiscountPercent / 30));

  // 3. Escalation Risk (SalesRep = 0.15, SalesManager = 0.6, Finance = 0.95)
  const escalationRisk = escalationTier === 'Finance' ? 0.95 : escalationTier === 'SalesManager' ? 0.6 : 0.2;

  // 4. Score Risk (blended score / 15)
  const scoreRisk = Math.max(0.1, Math.min(1.0, blendedRiskScore / 15));

  // 5. Fulfillment / Allocation Risk (synthetic baseline 0.3)
  const fulfillmentRisk = 0.35;

  const dimensions = [
    { label: 'Margin Risk', value: marginRisk },
    { label: 'Discount Depth', value: discountRisk },
    { label: 'Escalation Tier', value: escalationRisk },
    { label: 'Composite Score', value: scoreRisk },
    { label: 'Fulfillment Split', value: fulfillmentRisk },
  ];

  const size = compact ? 190 : 230;
  const center = size / 2;
  const radius = compact ? 65 : 80;
  const numAxes = dimensions.length;

  // Helper to get coordinates on polygon for axis index and magnitude (0 to 1)
  const getPoint = (axisIndex, magnitude) => {
    const angle = (Math.PI * 2 * axisIndex) / numAxes - Math.PI / 2;
    return {
      x: center + radius * magnitude * Math.cos(angle),
      y: center + radius * magnitude * Math.sin(angle),
    };
  };

  // Concentric grid rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Polygon path for current deal
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Benchmark / safe operating perimeter (0.4 magnitude)
  const safePoints = dimensions.map((_, i) => getPoint(i, 0.4));
  const safePath = safePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const isHighRisk = blendedRiskScore > 12 || grossMarginPercent < 18;
  const isMediumRisk = blendedRiskScore > 0 || grossMarginPercent < 25;

  const riskColor = isHighRisk ? '#ef4444' : isMediumRisk ? '#f59e0b' : '#10b981';

  return (
    <div
      className="risk-radar-widget"
      style={{
        padding: '14px',
        borderRadius: '10px',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
          Blended Risk Radar
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : isMediumRisk ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: riskColor,
            border: `1px solid ${riskColor}40`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isHighRisk ? <ShieldAlert size={11} /> : isMediumRisk ? <AlertTriangle size={11} /> : <ShieldCheck size={11} />}
          <span>Score: {Number(blendedRiskScore).toFixed(1)}</span>
        </span>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric Grid Rings */}
        {rings.map((ring) => {
          const pts = dimensions.map((_, i) => getPoint(i, ring));
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={ring}
              d={path}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
              strokeDasharray={ring === 1.0 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Axis Spokes */}
        {dimensions.map((_, i) => {
          const pt = getPoint(i, 1.0);
          return <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />;
        })}

        {/* Safe Benchmark Boundary */}
        <path d={safePath} fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Current Deal Risk Polygon */}
        <path
          d={dataPath}
          fill={`${riskColor}33`}
          stroke={riskColor}
          strokeWidth="2"
          style={{ transition: 'all 300ms ease' }}
        />

        {/* Data Vertices */}
        {dataPoints.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={riskColor} stroke="#0f172a" strokeWidth="1.5" />
        ))}

        {/* Axis Labels */}
        {dimensions.map((d, i) => {
          const labelPt = getPoint(i, 1.22);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              fill="#94a3b8"
              fontSize="8"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #94a3b8)', textAlign: 'center', marginTop: '4px' }}>
        Green dashed line represents optimal risk baseline (Score &le; 4.0)
      </div>
    </div>
  );
}

export default BlendedRiskRadarChart;
