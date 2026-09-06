import React, { useState } from 'react';
import { Pagination } from '../components/Pagination';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Layers,
  Settings,
  Sliders,
  CheckCircle2,
  DollarSign,
  Award,
  ArrowRight,
} from 'lucide-react';

export function RuleMatrixBuilder() {
  // Simulator state
  const [selectedTier, setSelectedTier] = useState('Silver');
  const [hardwareDiscount, setHardwareDiscount] = useState(12);
  const [servicesDiscount, setServicesDiscount] = useState(8);
  const [subscriptionDiscount, setSubscriptionDiscount] = useState(15);
  const [hypotheticalMargin, setHypotheticalMargin] = useState(23.5);

  // Pagination states
  const [tierPage, setTierPage] = useState(1);
  const [tierPageSize, setTierPageSize] = useState(4);
  const [catPage, setCatPage] = useState(1);
  const [catPageSize, setCatPageSize] = useState(3);

  // Dynamic calculation for simulator
  const tierCeilings = {
    Bronze: 5,
    Silver: 10,
    Gold: 15,
    Platinum: 20,
  };

  const categoryCeilings = {
    Hardware: 15,
    Services: 10,
    Subscriptions: 20,
  };

  // Evaluate simulated risk
  const hwBreach = Math.max(0, hardwareDiscount - categoryCeilings.Hardware);
  const srvBreach = Math.max(0, servicesDiscount - categoryCeilings.Services);
  const subBreach = Math.max(0, subscriptionDiscount - categoryCeilings.Subscriptions);

  const tierCeiling = tierCeilings[selectedTier] || 5;
  const maxLineDiscount = Math.max(hardwareDiscount, servicesDiscount, subscriptionDiscount);
  const tierBreach = Math.max(0, maxLineDiscount - tierCeiling);

  // Blended score calculation
  const calculatedRiskScore = Math.round((hwBreach * 1.2 + srvBreach * 1.5 + subBreach * 0.8 + tierBreach * 1.0) * 10) / 10;

  // Determine routing
  let routeTier = 'SalesRep';
  let routeStatus = 'Self-Approved';
  let routeColor = 'var(--success, #10b981)';
  let routeIcon = CheckCircle2;
  let reason = 'Discounts within tier and category limits. Deal margin satisfies optimal targets.';

  if (hypotheticalMargin < 18.0) {
    routeTier = 'HardBlock';
    routeStatus = 'HARD BLOCKED';
    routeColor = 'var(--danger, #ef4444)';
    routeIcon = ShieldAlert;
    reason = 'Statutory 18.0% margin floor breached. Order entry locked by enterprise governance.';
  } else if (maxLineDiscount > 20 || calculatedRiskScore > 12) {
    routeTier = 'Finance';
    routeStatus = 'Finance Controller Review';
    routeColor = 'var(--danger, #ef4444)';
    routeIcon = ShieldAlert;
    reason = `Escalated to Finance: High risk score (${calculatedRiskScore}) or line discount exceeds 20%.`;
  } else if (maxLineDiscount > tierCeiling || calculatedRiskScore > 0 || hypotheticalMargin < 25.0) {
    routeTier = 'SalesManager';
    routeStatus = 'Sales Manager Review';
    routeColor = 'var(--warning, #f59e0b)';
    routeIcon = AlertTriangle;
    reason = `Escalated to Manager: Margin (${hypotheticalMargin}%) < 25% or category ceiling breached.`;
  }

  const RouteIcon = routeIcon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={22} color="var(--primary)" />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, margin: 0 }}>
            CPQ Rule Matrix & Governance Builder
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Enterprise Discount Ceilings, Multi-Level Escalation Routing, and Real-Time Governance Policies
        </p>
      </div>

      {/* Grid: Matrices and Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Governance Matrices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Customer Tier Ceilings */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} color="var(--primary)" />
                <span>Customer Tier Discount Matrix</span>
              </span>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Account Tier</th>
                    <th>Annual Spend Range</th>
                    <th>Max Rep Ceiling</th>
                    <th>Default Terms</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: 'Bronze', range: '$0 - $24,999', ceiling: '5.0%', terms: 'Net 0 (Pre-pay)', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f3240' },
                    { tier: 'Silver', range: '$25,000 - $99,999', ceiling: '10.0%', terms: 'Net 15', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: '#94a3b840' },
                    { tier: 'Gold', range: '$100,000 - $349,999', ceiling: '15.0%', terms: 'Net 30', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b40' },
                    { tier: 'Platinum', range: '$350,000+', ceiling: '20.0%', terms: 'Net 45 / 60', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.15)', border: '#38bdf840' },
                  ].slice((tierPage - 1) * tierPageSize, tierPage * tierPageSize).map((row) => (
                    <tr key={row.tier}>
                      <td>
                        <span className="badge" style={{ backgroundColor: row.bg, color: row.color, border: `1px solid ${row.border}` }}>
                          {row.tier}
                        </span>
                      </td>
                      <td>{row.range}</td>
                      <td><strong>{row.ceiling}</strong></td>
                      <td>{row.terms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={tierPage}
              totalItems={4}
              pageSize={tierPageSize}
              pageSizeOptions={[2, 4]}
              onPageChange={setTierPage}
              onPageSizeChange={(newSize) => {
                setTierPageSize(newSize);
                setTierPage(1);
              }}
            />
          </div>

          {/* 2. Product Category Ceilings */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--primary)" />
                <span>Product Category Ceilings & Risk Multipliers</span>
              </span>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Max Discount Cap</th>
                    <th>Risk Multiplier</th>
                    <th>COGS Sensitivity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Hardware', cap: '15.0%', mult: '1.2x', sensitivity: 'High (Pass-through cost)', sensColor: 'var(--danger)' },
                    { cat: 'Services', cap: '10.0%', mult: '1.5x', sensitivity: 'Critical (Fixed hourly labor)', sensColor: 'var(--warning)' },
                    { cat: 'Subscriptions', cap: '20.0%', mult: '0.8x', sensitivity: 'Low (High gross margin SaaS)', sensColor: 'var(--success)' },
                  ].slice((catPage - 1) * catPageSize, catPage * catPageSize).map((row) => (
                    <tr key={row.cat}>
                      <td><strong>{row.cat}</strong></td>
                      <td>{row.cap}</td>
                      <td>{row.mult}</td>
                      <td><span style={{ color: row.sensColor }}>{row.sensitivity}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={catPage}
              totalItems={3}
              pageSize={catPageSize}
              pageSizeOptions={[2, 3]}
              onPageChange={setCatPage}
              onPageSizeChange={(newSize) => {
                setCatPageSize(newSize);
                setCatPage(1);
              }}
            />
          </div>

          {/* 3. Approval Routing Paths */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Approval Escalation Routing Chain</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--success)' }}>Tier 1: Sales Rep Self-Approval</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Discounts &le; Tier limit • All category ceilings respected • Deal Margin &ge; 25.0% • Risk Score = 0</div>
                </div>
                <span className="badge badge-approved">Instant Clear</span>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--warning)' }}>Tier 2: Sales Manager Sign-off</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Single line discount 10% - 20% • Deal Margin 18.0% - 24.9% • Blended Risk Score 1 - 12</div>
                </div>
                <span className="badge badge-draft">Manager SLA: 4h</span>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--danger)' }}>Tier 3: Finance Director Clearance</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Line discount &gt; 20% • Blended Risk Score &gt; 12 • High capital exposure deals</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>Executive Review</span>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--danger-light, #fef2f2)', border: '1px dashed var(--danger-border, #fecaca)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--danger, #dc2626)' }}>Statutory Red-Line Floor: 18.0%</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>Immutable system invariant: Transaction finalization is locked regardless of user override</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--danger, #dc2626)', color: '#ffffff' }}>HARD BLOCK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Deal Simulator Sandbox */}
        <div className="card" style={{ marginBottom: 0, height: 'fit-content' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="var(--primary)" />
              <span>Interactive Rule Simulator Sandbox</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Adjust parameters below to test real-world policy routing and risk score calculation in real time:
            </p>

            {/* Customer Tier Picker */}
            <div className="form-group">
              <label className="form-label">Simulated Customer Account Tier</label>
              <select
                className="form-control"
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                <option value="Bronze">Bronze Account (5% max ceiling)</option>
                <option value="Silver">Silver Account (10% max ceiling)</option>
                <option value="Gold">Gold Account (15% max ceiling)</option>
                <option value="Platinum">Platinum Account (20% max ceiling)</option>
              </select>
            </div>

            {/* Hardware Discount Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Hardware Line Discount (15% cap)</span>
                <strong style={{ color: hardwareDiscount > 15 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {hardwareDiscount}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={hardwareDiscount}
                onChange={(e) => setHardwareDiscount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Services Discount Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Services Line Discount (10% cap)</span>
                <strong style={{ color: servicesDiscount > 10 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {servicesDiscount}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={servicesDiscount}
                onChange={(e) => setServicesDiscount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Subscription Discount Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Subscription Line Discount (20% cap)</span>
                <strong style={{ color: subscriptionDiscount > 20 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {subscriptionDiscount}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={subscriptionDiscount}
                onChange={(e) => setSubscriptionDiscount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Projected Gross Margin Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Projected Gross Margin %</span>
                <strong style={{ color: hypotheticalMargin < 18 ? 'var(--danger)' : hypotheticalMargin < 25 ? 'var(--warning)' : 'var(--success)' }}>
                  {hypotheticalMargin.toFixed(1)}%
                </strong>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="0.5"
                value={hypotheticalMargin}
                onChange={(e) => setHypotheticalMargin(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Simulator Live Output Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-canvas, #f8fafc)',
                border: `1px solid ${routeColor}40`,
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted, #64748b)', fontWeight: 700 }}>
                  Calculated Approval Path
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: `${routeColor}15`,
                    color: routeColor,
                    border: `1px solid ${routeColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <RouteIcon size={13} />
                  <span>{routeStatus}</span>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ backgroundColor: 'var(--bg-surface, #ffffff)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle, #e2e8f0)', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>Blended Risk Score</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: calculatedRiskScore > 12 ? 'var(--danger, #dc2626)' : calculatedRiskScore > 0 ? 'var(--warning, #d97706)' : 'var(--success, #059669)', marginTop: '2px' }}>
                    {calculatedRiskScore.toFixed(1)} / 20.0
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-surface, #ffffff)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle, #e2e8f0)', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontWeight: 500 }}>Required Authority</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: routeColor, marginTop: '2px' }}>
                    {routeTier}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-main, #0f172a)', lineHeight: '1.4', backgroundColor: 'var(--bg-surface, #ffffff)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle, #e2e8f0)' }}>
                <strong style={{ color: 'var(--text-muted, #64748b)' }}>Policy Grounding:</strong> {reason}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RuleMatrixBuilder;
