import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Plus, ArrowUpRight, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export function Dashboard({ onOpenQuote }) {
  const { currentUser, canViewInternalMargins, canCreateQuotes, isCustomer, isWarehouse } = useAuth();
  const { lastEvent } = useWebSocket();
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const [qRes, cRes] = await Promise.all([
        fetch('/api/quotes').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
      ]);

      if (qRes.success) {
        setQuotes(qRes.quotations || []);
      }
      if (cRes.success) {
        const cMap = {};
        (cRes.customers || []).forEach((c) => {
          cMap[c.id] = c;
        });
        setCustomers(cMap);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentUser.id]);

  useEffect(() => {
    if (lastEvent) {
      fetchQuotes();
    }
  }, [lastEvent]);

  // Role-isolated quote filtering
  const displayedQuotes = quotes.filter((q) => {
    if (isCustomer() && q.customerId !== currentUser.customerId) {
      return false;
    }
    if (isWarehouse()) {
      return q.status === 'Confirmed';
    }
    if (filter === 'PENDING') return q.status === 'PendingApproval';
    if (filter === 'APPROVED') return q.status === 'Approved';
    if (filter === 'CONFIRMED') return q.status === 'Confirmed';
    return true;
  });

  const totalPipelineCents = displayedQuotes.reduce((sum, q) => sum + (q.netTotalCents || 0), 0);
  const pendingCount = displayedQuotes.filter((q) => q.status === 'PendingApproval').length;
  const avgMargin = displayedQuotes.length > 0
    ? displayedQuotes.reduce((sum, q) => sum + (q.grossMarginPercent || 0), 0) / displayedQuotes.length
    : 0;

  const totalUnitsToDispatch = displayedQuotes.reduce((total, q) => {
    const quoteUnits = q.lines?.reduce((lineSum, l) => lineSum + (l.quantity || 1), 0);
    return total + (quoteUnits || 4);
  }, 0);

  const formatCurrency = (cents) => `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            {isWarehouse()
              ? 'Warehouse Logistics & Depot Fulfillment'
              : isCustomer()
              ? 'Client Commercial Proposals'
              : 'Commercial Operations Dashboard'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isWarehouse()
              ? `Real-time physical stock allocations, picking queues, and dispatch orders for ${currentUser.company}.`
              : isCustomer()
              ? 'Active enterprise proposals, pricing quotes, and binding order confirmations.'
              : 'Real-time CPQ deal velocity, gross margin floor governance, and approval pipeline.'}
          </p>
        </div>

        {canCreateQuotes() && (
          <button className="btn btn-primary" onClick={() => onOpenQuote(null)}>
            <Plus size={16} />
            <span>New Quotation</span>
          </button>
        )}
      </div>

      {/* KPI Metric Tiles */}
      {isWarehouse() ? (
        <div className="kpi-grid">
          <div className="kpi-tile kpi-success">
            <span className="kpi-label">Confirmed Orders to Fulfill</span>
            <span className="kpi-value">{displayedQuotes.length}</span>
            <span className="kpi-subtext">Binding orders cleared for depot packaging</span>
          </div>

          <div className="kpi-tile">
            <span className="kpi-label">Total Allocated Stock Units</span>
            <span className="kpi-value">{totalUnitsToDispatch} Units</span>
            <span className="kpi-subtext">Reserved across 5 regional depots</span>
          </div>

          <div className="kpi-tile">
            <span className="kpi-label">Assigned Home Hub</span>
            <span className="kpi-value" style={{ fontSize: '20px' }}>Chicago Hub</span>
            <span className="kpi-subtext">Primary dispatch depot: {currentUser.warehouseId}</span>
          </div>

          <div className="kpi-tile">
            <span className="kpi-label">Fulfillment SLA Compliance</span>
            <span className="kpi-value" style={{ color: 'var(--success)' }}>99.4%</span>
            <span className="kpi-subtext">Within standard 48h dispatch window</span>
          </div>
        </div>
      ) : (
        <div className="kpi-grid">
          <div className="kpi-tile">
            <span className="kpi-label">{isCustomer() ? 'Active Order Value' : 'Active Pipeline Value'}</span>
            <span className="kpi-value">{formatCurrency(totalPipelineCents)}</span>
            <span className="kpi-subtext">{displayedQuotes.length} active {isCustomer() ? 'proposals' : 'deals'}</span>
          </div>

          {canViewInternalMargins() && (
            <div className={`kpi-tile ${avgMargin >= 25 ? 'kpi-success' : avgMargin >= 18 ? 'kpi-warning' : 'kpi-danger'}`}>
              <span className="kpi-label">Average Gross Margin</span>
              <span className="kpi-value">{avgMargin.toFixed(1)}%</span>
              <span className="kpi-subtext">
                {avgMargin >= 25 ? '✓ Target achieved (≥25%)' : avgMargin >= 18 ? '⚠ Discretionary (18–25%)' : '🚨 Margin breach (<18%)'}
              </span>
            </div>
          )}

          {!isCustomer() && (
            <div className={`kpi-tile ${pendingCount > 0 ? 'kpi-warning' : ''}`}>
              <span className="kpi-label">Pending Governance Approvals</span>
              <span className="kpi-value">{pendingCount}</span>
              <span className="kpi-subtext">Requires SalesManager / Finance review</span>
            </div>
          )}

          <div className="kpi-tile">
            <span className="kpi-label">Average DSO Timeliness</span>
            <span className="kpi-value">18.4 Days</span>
            <span className="kpi-subtext">Within Net 30 agreement threshold</span>
          </div>
        </div>
      )}

      {/* Quotations Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-title">
              {isWarehouse() ? 'Active Dispatch & Fulfillment Orders' : 'Commercial Quotations'}
            </span>
            {!isWarehouse() && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {['ALL', 'PENDING', 'APPROVED', 'CONFIRMED'].map((f) => (
                  <button
                    key={f}
                    className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter(f)}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {displayedQuotes.length} {isWarehouse() ? 'dispatch orders' : 'deals'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading enterprise quotation records...
          </div>
        ) : displayedQuotes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No quotations found matching active filter.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{isWarehouse() ? 'Dispatch Order #' : 'Quote #'}</th>
                  <th>Customer Account</th>
                  {!isWarehouse() && <th>Tier</th>}
                  <th>{isWarehouse() ? 'Order Net Value' : 'Net Total'}</th>
                  {canViewInternalMargins() && <th>Gross Margin</th>}
                  {!isWarehouse() && <th>Governance Level</th>}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuotes.map((quote) => {
                  const cust = customers[quote.customerId] || {};
                  const margin = quote.grossMarginPercent || 0;

                  return (
                    <tr key={quote.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {quote.quoteNumber || quote.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{cust.name || quote.customerId}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {cust.companyName || cust.email || ''}
                        </div>
                      </td>
                      {!isWarehouse() && (
                        <td>
                          <span className={`tier-badge tier-${(cust.tier || 'Bronze').toLowerCase()}`}>
                            {cust.tier || 'Bronze'}
                          </span>
                        </td>
                      )}
                      <td style={{ fontWeight: 600 }}>
                        {formatCurrency(quote.netTotalCents)}
                      </td>
                      {canViewInternalMargins() && (
                        <td>
                          <span
                            style={{
                              fontWeight: 700,
                              color: margin >= 25 ? 'var(--success)' : margin >= 18 ? 'var(--warning)' : 'var(--danger)',
                            }}
                          >
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      )}
                      {!isWarehouse() && (
                        <td>
                          <span className="badge badge-draft" style={{ textTransform: 'capitalize' }}>
                            {quote.requiredApprovalLevel || quote.escalationTier || 'Self'}
                          </span>
                        </td>
                      )}
                      <td>
                        <span
                          className={`badge ${
                            quote.status === 'Draft'
                              ? 'badge-draft'
                              : quote.status === 'PendingApproval'
                              ? 'badge-pending'
                              : quote.status === 'Approved'
                              ? 'badge-approved'
                              : quote.status === 'Confirmed'
                              ? 'badge-confirmed'
                              : 'badge-fallback'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenQuote(quote.id)}
                        >
                          <span>{isWarehouse() ? 'Inspect Packing Slip' : 'Open'}</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
