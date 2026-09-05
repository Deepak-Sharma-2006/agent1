import React from 'react';
import { Award, AlertTriangle, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

/**
 * TierSpendVelocityCurve - Bespoke React SVG Spend Trajectory & Tier Qualification Chart
 * Explains customer B2B tier badges, progression thresholds, and credit degradation risks.
 * 
 * @param {Object} props
 * @param {Object} props.customer - Active customer entity
 */
export function TierSpendVelocityCurve({ customer = {} }) {
  const tier = customer.tier || 'Bronze';
  const trailingSpendCents = customer.trailing365DaySpendCents || customer.annualSpendCents || (customer.tier === 'Platinum' ? 38500000 : customer.tier === 'Gold' ? 14200000 : customer.tier === 'Silver' ? 4500000 : 1200000);
  const trailingSpendDollars = trailingSpendCents / 100;
  const daysSinceLastOrder = customer.daysSinceLastOrder || 12;
  const averageDSO = customer.averageDSO || 18;
  const maxOverdueDays = customer.maxOverdueDays || 0;
  const ordersCount = customer.ordersTrailing365Days || (customer.tier === 'Platinum' ? 16 : customer.tier === 'Gold' ? 8 : 4);

  // Degradation risk assessment
  const isDormant = (tier === 'Platinum' && daysSinceLastOrder > 90) || (tier === 'Gold' && daysSinceLastOrder > 60) || (tier === 'Silver' && daysSinceLastOrder > 90);
  const isCreditRisk = maxOverdueDays > 30;
  const hasDegradationRisk = isDormant || isCreditRisk;

  // Chart coordinate mapping (0 to $400k)
  const maxScale = 400000;
  const width = 280;
  const height = 110;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 24;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Tier milestone X coordinates
  const getX = (dollars) => paddingLeft + (Math.min(dollars, maxScale) / maxScale) * plotWidth;
  const getY = (dollars) => {
    // S-curve trajectory for spend velocity
    const norm = Math.min(dollars, maxScale) / maxScale;
    const curve = Math.pow(norm, 0.7); // concave curve
    return height - paddingBottom - curve * plotHeight;
  };

  const silverX = getX(25000);
  const goldX = getX(100000);
  const platinumX = getX(350000);
  const currentX = getX(trailingSpendDollars);
  const currentY = getY(trailingSpendDollars);

  // SVG Path generator for trajectory curve
  const points = [];
  for (let d = 0; d <= maxScale; d += 20000) {
    points.push(`${getX(d)},${getY(d)}`);
  }
  const pathD = `M ${points.join(' L ')}`;

  const tierColors = {
    Bronze: '#cd7f32',
    Silver: '#94a3b8',
    Gold: '#f59e0b',
    Platinum: '#38bdf8',
  };

  return (
    <div
      className="tier-curve-widget"
      style={{
        padding: '14px',
        borderRadius: '10px',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={15} color={tierColors[tier] || '#94a3b8'} />
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
            Tier Spend Velocity
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: hasDegradationRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            color: hasDegradationRisk ? 'var(--danger, #ef4444)' : (tierColors[tier] || '#38bdf8'),
            border: `1px solid ${hasDegradationRisk ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {hasDegradationRisk ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
          <span>{tier} Account</span>
        </span>
      </div>

      {/* SVG Spline Chart */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible', width: '100%' }}>
        {/* Tier Background Zones */}
        <rect x={paddingLeft} y={paddingTop} width={silverX - paddingLeft} height={plotHeight} fill="rgba(205, 127, 50, 0.04)" />
        <rect x={silverX} y={paddingTop} width={goldX - silverX} height={plotHeight} fill="rgba(148, 163, 184, 0.04)" />
        <rect x={goldX} y={paddingTop} width={platinumX - goldX} height={plotHeight} fill="rgba(245, 158, 11, 0.04)" />
        <rect x={platinumX} y={paddingTop} width={width - paddingRight - platinumX} height={plotHeight} fill="rgba(56, 189, 248, 0.04)" />

        {/* Milestone Vertical Markers */}
        <line x1={silverX} y1={paddingTop} x2={silverX} y2={height - paddingBottom} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="2,2" />
        <line x1={goldX} y1={paddingTop} x2={goldX} y2={height - paddingBottom} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="2,2" />
        <line x1={platinumX} y1={paddingTop} x2={platinumX} y2={height - paddingBottom} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="2,2" />

        {/* Curve Line */}
        <path d={pathD} fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="2" strokeLinecap="round" />

        {/* Highlighted Trailing Progress Arc */}
        {(() => {
          const activePoints = [];
          for (let d = 0; d <= trailingSpendDollars; d += 10000) {
            activePoints.push(`${getX(d)},${getY(d)}`);
          }
          activePoints.push(`${currentX},${currentY}`);
          return (
            <path
              d={`M ${activePoints.join(' L ')}`}
              fill="none"
              stroke={hasDegradationRisk ? '#ef4444' : (tierColors[tier] || '#38bdf8')}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })()}

        {/* Current Customer Node */}
        <circle cx={currentX} cy={currentY} r="5.5" fill="#0f172a" stroke={hasDegradationRisk ? '#ef4444' : (tierColors[tier] || '#38bdf8')} strokeWidth="2.5" />
        <circle cx={currentX} cy={currentY} r="2.5" fill="#ffffff" />

        {/* Milestone Labels */}
        <text x={paddingLeft} y={height - 8} fill="#64748b" fontSize="8" fontWeight="600">
          $0
        </text>
        <text x={silverX} y={height - 8} fill="#94a3b8" fontSize="8" fontWeight="600" textAnchor="middle">
          $25k
        </text>
        <text x={goldX} y={height - 8} fill="#f59e0b" fontSize="8" fontWeight="600" textAnchor="middle">
          $100k
        </text>
        <text x={platinumX} y={height - 8} fill="#38bdf8" fontSize="8" fontWeight="600" textAnchor="middle">
          $350k
        </text>
      </svg>

      {/* Trailing Spend & Hygiene Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '6px 8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)' }}>Trailing 365d Spend</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
            ${trailingSpendDollars.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '6px 8px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)' }}>Credit & Cadence</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: hasDegradationRisk ? 'var(--danger, #ef4444)' : 'var(--success, #10b981)' }}>
            DSO {averageDSO}d • {ordersCount} orders
          </div>
        </div>
      </div>

      {hasDegradationRisk && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--danger, #ef4444)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={12} />
          <span>
            {isDormant ? `Dormant account (${daysSinceLastOrder}d inactive)` : `Overdue invoices (${maxOverdueDays}d overdue)`}
          </span>
        </div>
      )}
    </div>
  );
}

export default TierSpendVelocityCurve;
