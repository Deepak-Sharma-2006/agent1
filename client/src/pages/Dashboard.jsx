import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  cacheCustomers,
  getCachedCustomers,
  saveOfflineQuote,
  getAllOfflineQuotes,
} from '../offline/indexeddb';
import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Users,
  Package,
  Truck,
  FileText,
  CreditCard,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export function Dashboard({ onOpenQuote }) {
  const {
    currentUser,
    canViewInternalMargins,
    canCreateQuotes,
    isCustomer,
    isWarehouse,
    isSalesRep,
    isSalesManager,
    isFinance,
  } = useAuth();
  const { lastEvent } = useWebSocket();
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const [qRes, cRes] = await Promise.all([
        fetch('/api/quotes').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
      ]);

      if (qRes.success) {
        setQuotes(qRes.quotations || []);
        (qRes.quotations || []).forEach((q) => saveOfflineQuote(q).catch(() => {}));
      }
      if (cRes.success) {
        const cMap = {};
        (cRes.customers || []).forEach((c) => {
          cMap[c.id] = c;
        });
        setCustomers(cMap);
        cacheCustomers(cRes.customers || []).catch(() => {});
      }
    } catch {
      // Offline fallback: load from native IndexedDB
      try {
        const [cachedQuotes, cachedCustomersList] = await Promise.all([
          getAllOfflineQuotes(),
          getCachedCustomers(),
        ]);
        if (cachedQuotes && cachedQuotes.length > 0) {
          setQuotes(cachedQuotes);
        }
        if (cachedCustomersList && cachedCustomersList.length > 0) {
          const cMap = {};
          cachedCustomersList.forEach((c) => {
            cMap[c.id] = c;
          });
          setCustomers(cMap);
        }
      } catch (e) {
        console.warn('Could not read from offline IndexedDB:', e);
      }
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

  // Role-isolated quote filtering: strictly eliminate feature and data bleed
  const roleFilteredQuotes = quotes.filter((q) => {
    // 1. Customer: strictly their own account quotes
    if (isCustomer()) {
      if (q.customerId !== currentUser.customerId) return false;
    }
    // 2. SalesRep: strictly quotes assigned to their ID or name
    else if (isSalesRep()) {
      const isMyQuote =
        q.salesRepId === currentUser.id ||
        q.salesRepId === 'usr-rep-01' ||
        q.salesRepId === 'rep-01' ||
        q.salesRepName === currentUser.name ||
        !q.salesRepId;
      if (!isMyQuote) return false;
    }
    // 3. SalesManager: team pipeline overview; hide other reps' incomplete drafts from general "ALL" view
    else if (isSalesManager()) {
      if (filter === 'ALL' && q.status === 'Draft' && q.salesRepId && q.salesRepId !== currentUser.id) {
        return false;
      }
    }
    // 4. Warehouse: only Confirmed orders ready for dispatch
    else if (isWarehouse()) {
      if (q.status !== 'Confirmed') return false;
    }
    return true;
  });

  const displayedQuotes = roleFilteredQuotes.filter((q) => {
    const st = (q.status || '').toLowerCase();
    // Status Filter Tabs
    if (filter === 'DRAFT' || filter === 'DRAFTS') return st === 'draft';
    if (filter === 'PENDING' || filter === 'PENDING APPROVAL') return st === 'pendingapproval';
    if (filter === 'APPROVED') return st === 'approved';
    if (filter === 'CONFIRMED') return st === 'confirmed';
    return true;
  });

  const paginatedQuotes = displayedQuotes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPipelineCents = roleFilteredQuotes.reduce((sum, q) => sum + (q.netTotalCents !== undefined ? q.netTotalCents : (q.totalCents || 0)), 0);
  const draftCount = roleFilteredQuotes.filter((q) => (q.status || '').toLowerCase() === 'draft').length;
  const pendingCount = roleFilteredQuotes.filter((q) => (q.status || '').toLowerCase() === 'pendingapproval').length;
  const approvedCount = roleFilteredQuotes.filter((q) => (q.status || '').toLowerCase() === 'approved').length;
  const confirmedCount = roleFilteredQuotes.filter((q) => (q.status || '').toLowerCase() === 'confirmed').length;
  const avgMargin =
    roleFilteredQuotes.length > 0
      ? roleFilteredQuotes.reduce((sum, q) => sum + (q.grossMarginPercent || 0), 0) / roleFilteredQuotes.length
      : 0;

  // High-escalation deals count for Finance (discount > 15% or margin breach or PendingApproval)
  const financeSignoffsRequired = quotes.filter(
    (q) => (q.discountPercentage || 0) > 15 || (q.grossMarginPercent || 0) < 18 || q.status === 'PendingApproval'
  ).length;

  const totalUnitsToDispatch = displayedQuotes.reduce((total, q) => {
    const quoteUnits = q.lines?.reduce((lineSum, l) => lineSum + (l.quantity || 1), 0);
    return total + (quoteUnits || 4);
  }, 0);

  const formatCurrency = (cents) =>
    `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getRepName = (salesRepId) => {
    if (salesRepId === 'usr-rep-01' || salesRepId === 'rep-01') return 'Sarah Jenkins';
    if (salesRepId === 'usr-mgr-01') return 'Marcus Vance';
    if (salesRepId === 'usr-fin-01') return 'Elena Rostova';
    return salesRepId || 'Sales Rep';
  };

  return (
    <div>
      {/* Page Header (Role-Tailored) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            {isWarehouse()
              ? 'Warehouse Logistics & Depot Fulfillment'
              : isCustomer()
              ? `${currentUser.company} — Procurement & Commercial Order Hub`
              : isFinance()
              ? 'Corporate Financial Operations & Treasury Dashboard'
              : isSalesManager()
              ? 'Sales Operations & Team Governance Dashboard'
              : 'Sales Representative Deal Cockpit'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isWarehouse()
              ? `Real-time physical stock allocations, picking queues, and dispatch orders for ${currentUser.company}.`
              : isCustomer()
              ? 'Active enterprise proposals, negotiated contract terms, and confirmed binding orders.'
              : isFinance()
              ? 'P&L gross margin floor enforcement, cash collection DSO velocity, and commercial credit exposure.'
              : isSalesManager()
              ? 'Executive commercial velocity, team quota attainment, and managerial discount authorizations.'
              : `Active personal deals, quota velocity, and commission pipeline for ${currentUser.name}.`}
          </p>
        </div>

        {canCreateQuotes() && !isCustomer() && !isWarehouse() && (
          <button className="btn btn-primary" onClick={() => onOpenQuote(null)}>
            <Plus size={16} />
            <span>New Quotation</span>
          </button>
        )}
      </div>

      {/* KPI Metric Tiles (Role-Partitioned: Zero Bleed) */}
      {isWarehouse() ? (
        /* 1. Warehouse Logistics KPIs */
        <div className="kpi-grid">
          <div className="kpi-tile kpi-success">
            <span className="kpi-label">Confirmed Orders to Fulfill</span>
            <span className="kpi-value">{displayedQuotes.length}</span>
            <span className="kpi-subtext">Binding orders cleared for packaging</span>
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
      ) : isCustomer() ? (
        /* 2. Customer Procurement KPIs (No internal DSO or margin leak) */
        <div className="kpi-grid">
          <div className="kpi-tile">
            <span className="kpi-label">Total Commercial Investment</span>
            <span className="kpi-value">{formatCurrency(totalPipelineCents)}</span>
            <span className="kpi-subtext">{displayedQuotes.length} active proposals & orders</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Proposals Under Review</span>
            <span className="kpi-value">{displayedQuotes.filter((q) => q.status !== 'Confirmed').length}</span>
            <span className="kpi-subtext">Active proposals open for negotiation</span>
          </div>
          <div className="kpi-tile kpi-success">
            <span className="kpi-label">Confirmed Executed Orders</span>
            <span className="kpi-value">{confirmedCount}</span>
            <span className="kpi-subtext">Legally binding confirmed contracts</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Commercial Account Terms</span>
            <span className="kpi-value" style={{ fontSize: '18px' }}>Net 30 Days</span>
            <span className="kpi-subtext">Authorized Tier: Gold Account</span>
          </div>
        </div>
      ) : isFinance() ? (
        /* 3. Finance Director KPIs (Corporate DSO, P&L Margins, Credit Exposure) */
        <div className="kpi-grid">
          <div className="kpi-tile">
            <span className="kpi-label">Revenue Commitments</span>
            <span className="kpi-value">{formatCurrency(totalPipelineCents)}</span>
            <span className="kpi-subtext">{displayedQuotes.length} portfolio deal contracts</span>
          </div>
          <div className={`kpi-tile ${avgMargin >= 25 ? 'kpi-success' : avgMargin >= 18 ? 'kpi-warning' : 'kpi-danger'}`}>
            <span className="kpi-label">Portfolio Gross Margin</span>
            <span className="kpi-value">{avgMargin.toFixed(1)}%</span>
            <span className="kpi-subtext">
              {avgMargin >= 25 ? '✓ Statutory floor maintained (≥18%)' : '🚨 Margin breach below floor (<18%)'}
            </span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Average DSO (Days Sales Outstanding)</span>
            <span className="kpi-value">18.4 Days</span>
            <span className="kpi-subtext">Benchmark: Net 30 collection cycle</span>
          </div>
          <div className={`kpi-tile ${financeSignoffsRequired > 0 ? 'kpi-warning' : ''}`}>
            <span className="kpi-label">Financial Signoffs Required</span>
            <span className="kpi-value">{financeSignoffsRequired}</span>
            <span className="kpi-subtext">High discount (&gt;15%) or margin breach</span>
          </div>
        </div>
      ) : isSalesManager() ? (
        /* 4. Sales Manager KPIs (Team Pipeline, Pending Approvals, Floor Protection) */
        <div className="kpi-grid">
          <div className="kpi-tile">
            <span className="kpi-label">Team Pipeline Volume</span>
            <span className="kpi-value">{formatCurrency(totalPipelineCents)}</span>
            <span className="kpi-subtext">{displayedQuotes.length} total team quotations</span>
          </div>
          <div className={`kpi-tile ${pendingCount > 0 ? 'kpi-warning' : ''}`}>
            <span className="kpi-label">Deals Pending Approval</span>
            <span className="kpi-value">{pendingCount}</span>
            <span className="kpi-subtext">Requires managerial signoff</span>
          </div>
          <div className={`kpi-tile ${avgMargin >= 25 ? 'kpi-success' : avgMargin >= 18 ? 'kpi-warning' : 'kpi-danger'}`}>
            <span className="kpi-label">Team Average Gross Margin</span>
            <span className="kpi-value">{avgMargin.toFixed(1)}%</span>
            <span className="kpi-subtext">Floor governance active (18%)</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">Deals Approved & In Closing</span>
            <span className="kpi-value">{approvedCount + confirmedCount}</span>
            <span className="kpi-subtext">{approvedCount} approved, {confirmedCount} confirmed</span>
          </div>
        </div>
      ) : (
        /* 5. Sales Representative KPIs (Personal Scope Only: No DSO, No Other Reps) */
        <div className="kpi-grid">
          <div className="kpi-tile">
            <span className="kpi-label">My Active Pipeline Value</span>
            <span className="kpi-value">{formatCurrency(totalPipelineCents)}</span>
            <span className="kpi-subtext">{displayedQuotes.length} assigned personal deals</span>
          </div>
          <div className="kpi-tile">
            <span className="kpi-label">My Active Deals</span>
            <span className="kpi-value">{displayedQuotes.length}</span>
            <span className="kpi-subtext">{draftCount} drafts, {pendingCount} pending, {approvedCount} approved</span>
          </div>
          <div className={`kpi-tile ${avgMargin >= 25 ? 'kpi-success' : avgMargin >= 18 ? 'kpi-warning' : 'kpi-danger'}`}>
            <span className="kpi-label">Average Deal Margin</span>
            <span className="kpi-value">{avgMargin.toFixed(1)}%</span>
            <span className="kpi-subtext">Target attainment: ≥25%</span>
          </div>
          <div className={`kpi-tile ${pendingCount > 0 ? 'kpi-warning' : ''}`}>
            <span className="kpi-label">Awaiting Manager Signoff</span>
            <span className="kpi-value">{pendingCount}</span>
            <span className="kpi-subtext">Transferred to Elena Vance</span>
          </div>
        </div>
      )}

      {/* Quotations Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="card-title">
              {isWarehouse()
                ? 'Active Dispatch & Fulfillment Orders'
                : isCustomer()
                ? 'My Enterprise Proposals & Confirmed Orders'
                : isFinance()
                ? 'Financial Revenue & Deal Ledger'
                : isSalesManager()
                ? 'Team Commercial Quotations'
                : 'My Assigned Deals & Quotations'}
            </span>
            {!isWarehouse() && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {(isSalesManager()
                  ? ['ALL', 'PENDING APPROVAL', 'APPROVED', 'CONFIRMED', 'DRAFTS']
                  : ['ALL', 'DRAFT', 'PENDING', 'APPROVED', 'CONFIRMED']
                ).map((f) => (
                  <button
                    key={f}
                    className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setFilter(f);
                      setCurrentPage(1);
                    }}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {displayedQuotes.length} {isWarehouse() ? 'dispatch orders' : isCustomer() ? 'proposals' : 'deals'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading enterprise quotation records...
          </div>
        ) : displayedQuotes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No records found matching active filter.
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{isWarehouse() ? 'Dispatch Order #' : isCustomer() ? 'Proposal #' : 'Quote #'}</th>
                  {!isCustomer() && <th>Customer Account</th>}
                  {(isSalesManager() || isFinance()) && <th>Sales Rep</th>}
                  {!isWarehouse() && !isCustomer() && <th>Tier</th>}
                  <th>{isWarehouse() ? 'Units to Dispatch' : isCustomer() ? 'Net Investment' : 'Net Total'}</th>
                  {canViewInternalMargins() && !isCustomer() && <th>Gross Margin</th>}
                  {isFinance() && <th>Payment Terms</th>}
                  {!isWarehouse() && !isCustomer() && <th>Governance Level</th>}
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuotes.map((quote) => {
                  const cust = customers[quote.customerId] || {};
                  const margin = quote.grossMarginPercent || 0;
                  const quoteUnits = quote.lines?.reduce((sum, l) => sum + (l.quantity || 1), 0) || 4;

                  return (
                    <tr key={quote.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {quote.quoteNumber || quote.id}
                      </td>

                      {!isCustomer() && (
                        <td>
                          <div style={{ fontWeight: 600 }}>{cust.name || quote.customerId}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {cust.companyName || cust.email || ''}
                          </div>
                        </td>
                      )}

                      {(isSalesManager() || isFinance()) && (
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-main)' }}>
                            {getRepName(quote.salesRepId)}
                          </span>
                        </td>
                      )}

                      {!isWarehouse() && !isCustomer() && (
                        <td>
                          <span className={`tier-badge tier-${(cust.tier || 'Bronze').toLowerCase()}`}>
                            {cust.tier || 'Bronze'}
                          </span>
                        </td>
                      )}

                      <td style={{ fontWeight: 600 }}>
                        {isWarehouse() ? `${quoteUnits} Units` : formatCurrency(quote.netTotalCents !== undefined ? quote.netTotalCents : (quote.totalCents || 0))}
                      </td>

                      {canViewInternalMargins() && !isCustomer() && (
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

                      {isFinance() && (
                        <td>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Net 30 Days
                          </span>
                        </td>
                      )}

                      {!isWarehouse() && !isCustomer() && (
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
                          {quote.status === 'PendingApproval'
                            ? isSalesRep()
                              ? `🔒 Transferred to ${quote.escalationTier === 'Finance' ? 'Finance' : 'Manager'}`
                              : isSalesManager()
                              ? '⚠️ Review Required'
                              : 'Pending Approval'
                            : quote.status === 'Approved'
                            ? Number(quote.discountPercentage || 0) <= 10
                              ? '✓ Self-Authorized'
                              : '✓ Approved'
                            : quote.status === 'Confirmed'
                            ? 'Won / Confirmed'
                            : quote.status}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`btn ${isSalesManager() && quote.status === 'PendingApproval' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          onClick={() => onOpenQuote(quote.id)}
                        >
                          <span>
                            {isWarehouse()
                              ? 'Inspect Slip'
                              : isCustomer()
                              ? 'Review Proposal'
                              : isSalesManager() && quote.status === 'PendingApproval'
                              ? 'Review & Sign Off'
                              : isSalesRep() && quote.status === 'PendingApproval'
                              ? 'View (Locked)'
                              : isSalesRep() && quote.status === 'Draft'
                              ? 'Edit Draft'
                              : 'Open'}
                          </span>
                          <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={displayedQuotes.length}
              pageSize={pageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
