import React from 'react';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * TierSpendVelocityCurve - Enterprise Customer Spend Trajectory & Tier Qualification
 * Features balanced non-linear stage spacing ensuring ZERO text/label overlap across all tiers.
 * 
 * @param {Object} props
 * @param {Object} props.customer - Active customer entity
 */
export function TierSpendVelocityCurve({ customer = {} }) {
  const tier = customer.tier || 'Bronze';
  const trailingSpendCents =
    customer.trailing365DaySpendCents ||
    customer.annualSpendCents ||
    (customer.tier === 'Platinum' ? 38500000 : customer.tier === 'Gold' ? 14200000 : customer.tier === 'Silver' ? 4500000 : 1200000);
  const trailingSpendDollars = trailingSpendCents / 100;
  const daysSinceLastOrder = customer.daysSinceLastOrder || 12;
  const averageDSO = customer.averageDSO || 18;
  const maxOverdueDays = customer.maxOverdueDays || 0;
  const ordersCount = customer.ordersTrailing365Days || (customer.tier === 'Platinum' ? 16 : customer.tier === 'Gold' ? 8 : 4);

  // Degradation risk assessment
  const isDormant =
    (tier === 'Platinum' && daysSinceLastOrder > 90) ||
    (tier === 'Gold' && daysSinceLastOrder > 60) ||
    (tier === 'Silver' && daysSinceLastOrder > 90);
  const isCreditRisk = maxOverdueDays > 30;
  const hasDegradationRisk = isDormant || isCreditRisk;

  // Balanced Stage Dimensions with generous spacing ensuring ZERO text/label collisions
  const svgWidth = 360;
  const svgHeight = 160;
  const paddingLeft = 25;
  const paddingRight = 25;
  const paddingTop = 32;
  const paddingBottom = 30;
  const plotHeight = svgHeight - paddingTop - paddingBottom; // 98px

  // Stage milestone boundaries (each stage allocated ~75px-80px of breathing room)
  // Bronze: $0 to $25k     (75px width: x 25 to 100)
  // Silver: $25k to $100k   (80px width: x 100 to 180)
  // Gold:   $100k to $350k  (80px width: x 180 to 260)
  // Platinum: $350k+        (75px width: x 260 to 335)
  const x0 = paddingLeft; // 25
  const xSilver = 100;    // +75px from x0
  const xGold = 180;      // +80px from xSilver
  const xPlatinum = 260;  // +80px from xGold
  const xMax = 335;       // +75px from xPlatinum

  // Non-linear piecewise projection for X coordinate
  const getX = (dollars) => {
    const d = Math.max(0, dollars);
    if (d <= 25000) {
      return x0 + (d / 25000) * (xSilver - x0);
    }
    if (d <= 100000) {
      return xSilver + ((d - 25000) / 75000) * (xGold - xSilver);
    }
    if (d <= 350000) {
      return xGold + ((d - 100000) / 250000) * (xPlatinum - xGold);
    }
    const platRatio = Math.min(1.0, (d - 350000) / 150000);
    return xPlatinum + platRatio * (xMax - xPlatinum);
  };

  // Smooth graceful projection for Y coordinate
  const getY = (dollars) => {
    const d = Math.max(0, dollars);
    const bottomY = svgHeight - paddingBottom;
    if (d <= 0) return bottomY;
    if (d <= 25000) {
      const r = d / 25000;
      return bottomY - r * 0.28 * plotHeight;
    }
    if (d <= 100000) {
      const r = (d - 25000) / 75000;
      return bottomY - (0.28 + r * 0.30) * plotHeight;
    }
    if (d <= 350000) {
      const r = (d - 100000) / 250000;
      return bottomY - (0.58 + r * 0.28) * plotHeight;
    }
    const r = Math.min(1.0, (d - 350000) / 150000);
    return bottomY - (0.86 + r * 0.14) * plotHeight;
  };

  const currentX = getX(trailingSpendDollars);
  const currentY = getY(trailingSpendDollars);

  // Trajectory curve interpolation points
  const fullCurvePoints = [
    `${getX(0)},${getY(0)}`,
    `${getX(12500)},${getY(12500)}`,
    `${getX(25000)},${getY(25000)}`,
    `${getX(60000)},${getY(60000)}`,
    `${getX(100000)},${getY(100000)}`,
    `${getX(225000)},${getY(225000)}`,
    `${getX(350000)},${getY(350000)}`,
    `${getX(425000)},${getY(425000)}`,
    `${getX(500000)},${getY(500000)}`,
  ];
  const fullCurveD = `M ${fullCurvePoints.join(' L ')}`;

  // Active trajectory curve interpolation up to current spend
  const milestones = [0, 12500, 25000, 60000, 100000, 225000, 350000, 425000, 500000];
  const activeCurvePoints = [];
  for (const m of milestones) {
    if (m < trailingSpendDollars) {
      activeCurvePoints.push(`${getX(m)},${getY(m)}`);
    } else {
      break;
    }
  }
  activeCurvePoints.push(`${currentX},${currentY}`);
  const activeCurveD = `M ${activeCurvePoints.join(' L ')}`;

  const tierColors = {
    Bronze: '#b45309',
    Silver: '#475569',
    Gold: '#d97706',
    Platinum: '#0284c7',
  };

  const tierBgs = {
    Bronze: '#fef3c7',
    Silver: '#f1f5f9',
    Gold: '#fffbeb',
    Platinum: '#e0f2fe',
  };

  const currentColor = tierColors[tier] || '#0284c7';

  // Smart placement for floating customer callout tag to avoid any collision
  const isFarRight = currentX > 220;
  const isNearTop = currentY < paddingTop + 30;
  const tagX = isFarRight ? currentX - 80 : Math.max(10, currentX - 36);
  const tagY = isNearTop ? currentY + 14 : currentY - 26;

  return (
    <div
      className="tier-curve-widget"
      style={{
        padding: '16px 14px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-canvas, #f8fafc)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        boxShadow: 'var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={16} color={currentColor} />
          <span style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
            Account Tier Velocity
          </span>
        </div>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '999px',
            backgroundColor: hasDegradationRisk ? 'var(--danger-light, #fef2f2)' : (tierBgs[tier] || '#e0f2fe'),
            color: hasDegradationRisk ? 'var(--danger, #dc2626)' : currentColor,
            border: `1px solid ${hasDegradationRisk ? 'var(--danger-border, #fecaca)' : `${currentColor}40`}`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {hasDegradationRisk ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
          <span>{tier} Tier</span>
        </span>
      </div>

      {/* SVG Spline Chart with zero-overlap geometry */}
      <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="tierGradientLineBalanced" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor={currentColor} />
          </linearGradient>
          <filter id="customerPinShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Milestone Vertical Stage Backgrounds */}
        <rect x={x0} y={paddingTop} width={xSilver - x0} height={plotHeight} fill="rgba(180, 83, 9, 0.05)" rx="3" />
        <rect x={xSilver} y={paddingTop} width={xGold - xSilver} height={plotHeight} fill="rgba(71, 85, 105, 0.05)" rx="3" />
        <rect x={xGold} y={paddingTop} width={xPlatinum - xGold} height={plotHeight} fill="rgba(217, 119, 6, 0.05)" rx="3" />
        <rect x={xPlatinum} y={paddingTop} width={xMax - xPlatinum} height={plotHeight} fill="rgba(2, 132, 199, 0.05)" rx="3" />

        {/* Top Tier Name Banners with Ample Clearance */}
        <text x={(x0 + xSilver) / 2} y={paddingTop - 12} fill="#b45309" fontSize="10" fontWeight="800" textAnchor="middle">
          BRONZE
        </text>
        <text x={(xSilver + xGold) / 2} y={paddingTop - 12} fill="#475569" fontSize="10" fontWeight="800" textAnchor="middle">
          SILVER
        </text>
        <text x={(xGold + xPlatinum) / 2} y={paddingTop - 12} fill="#d97706" fontSize="10" fontWeight="800" textAnchor="middle">
          GOLD
        </text>
        <text x={(xPlatinum + xMax) / 2} y={paddingTop - 12} fill="#0284c7" fontSize="10" fontWeight="800" textAnchor="middle">
          PLATINUM
        </text>

        {/* Vertical Threshold Divider Lines */}
        <line x1={xSilver} y1={paddingTop} x2={xSilver} y2={svgHeight - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1={xGold} y1={paddingTop} x2={xGold} y2={svgHeight - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1={xPlatinum} y1={paddingTop} x2={xPlatinum} y2={svgHeight - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Baseline Gray Trajectory Curve */}
        <path d={fullCurveD} fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Active Customer Progress Arc */}
        <path
          d={activeCurveD}
          fill="none"
          stroke={hasDegradationRisk ? '#dc2626' : 'url(#tierGradientLineBalanced)'}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Customer Node */}
        <g filter="url(#customerPinShadow)">
          <circle cx={currentX} cy={currentY} r="7.5" fill="#ffffff" stroke={hasDegradationRisk ? '#dc2626' : currentColor} strokeWidth="3" />
          <circle cx={currentX} cy={currentY} r="3.5" fill={hasDegradationRisk ? '#dc2626' : currentColor} />

          {/* Non-overlapping floating spend badge */}
          <g transform={`translate(${tagX}, ${tagY})`}>
            <rect width="72" height="18" rx="4" fill="#0f172a" />
            <text x="36" y="12.5" fill="#ffffff" fontSize="9.5" fontWeight="800" textAnchor="middle">
              ${(trailingSpendDollars / 1000).toFixed(0)}k Current
            </text>
          </g>
        </g>

        {/* Bottom Dollar Milestone Labels with generous spacing */}
        <text x={x0} y={svgHeight - 10} fill="#64748b" fontSize="11" fontWeight="700" textAnchor="start">
          $0
        </text>
        <text x={xSilver} y={svgHeight - 10} fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">
          $25k
        </text>
        <text x={xGold} y={svgHeight - 10} fill="#d97706" fontSize="11" fontWeight="700" textAnchor="middle">
          $100k
        </text>
        <text x={xPlatinum} y={svgHeight - 10} fill="#0284c7" fontSize="11" fontWeight="700" textAnchor="middle">
          $350k
        </text>
      </svg>

      {/* Trailing Spend & Credit Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
            Trailing 365d Spend
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main, #0f172a)', marginTop: '2px' }}>
            ${trailingSpendDollars.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>
            Credit & Cadence
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: hasDegradationRisk ? 'var(--danger, #dc2626)' : 'var(--success, #059669)',
              marginTop: '2px',
            }}
          >
            DSO {averageDSO}d • {ordersCount} orders
          </div>
        </div>
      </div>

      {hasDegradationRisk && (
        <div
          style={{
            marginTop: '10px',
            padding: '6px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--danger-light, #fef2f2)',
            border: '1px solid var(--danger-border, #fecaca)',
            fontSize: '11px',
            color: 'var(--danger, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={13} />
          <span>
            {isDormant ? `Dormant account (${daysSinceLastOrder}d inactive)` : `Overdue invoices (${maxOverdueDays}d overdue)`}
          </span>
        </div>
      )}
    </div>
  );
}

export default TierSpendVelocityCurve;
