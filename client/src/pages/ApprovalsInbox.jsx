import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export function ApprovalsInbox({ onOpenQuote }) {
  const { currentUser, canApprove } = useAuth();
  const { lastEvent } = useWebSocket();
  const [quotes, setQuotes] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('PendingApproval');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPendingQuotes = async () => {
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
    fetchPendingQuotes();
  }, [currentUser.id]);

  useEffect(() => {
    if (lastEvent) {
      fetchPendingQuotes();
    }
  }, [lastEvent]);

  const filteredQuotes = quotes.filter((q) => {
    if (filter === 'ALL') return true;
    return q.status === filter;
  });

  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pendingCount = quotes.filter((q) => q.status === 'PendingApproval').length;
  const approvedCount = quotes.filter((q) => q.status === 'Approved').length;
  const rejectedCount = quotes.filter((q) => q.status === 'Rejected').length;

  const formatCurrency = (cents) =>
    `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getRiskBadge = (score) => {
    if (!score || score === 0) return { label: 'No Risk', color: '#22c55e', bg: '#f0fdf4' };
    if (score <= 6) return { label: 'Low Risk', color: '#eab308', bg: '#fefce8' };
    if (score <= 12) return { label: 'Medium Risk', color: '#f97316', bg: '#fff7ed' };
    return { label: 'High Risk', color: '#ef4444', bg: '#fef2f2' };
  };

  const handleApprove = async (quoteId, version) => {
    setActionLoading(quoteId);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'If-Match': String(version) },
        body: JSON.stringify({
          approverRole: currentUser.role,
          approverName: currentUser.name,
          approvalNote: approvalNotes[quoteId] || 'Approved by ' + currentUser.name,
          expectedVersion: version,
        }),
      });
      if (res.ok) {
        await fetchPendingQuotes();
        setApprovalNotes((prev) => ({ ...prev, [quoteId]: '' }));
      }
    } catch {
      // Error handling
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (quoteId, version) => {
    setActionLoading(quoteId);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'If-Match': String(version) },
        body: JSON.stringify({
          approverRole: currentUser.role,
          approverName: currentUser.name,
          rejectionReason: approvalNotes[quoteId] || 'Rejected — margin floor violation.',
          expectedVersion: version,
        }),
      });
      if (res.ok) {
        await fetchPendingQuotes();
        setApprovalNotes((prev) => ({ ...prev, [quoteId]: '' }));
      }
    } catch {
      // Error handling
    } finally {
      setActionLoading(null);
    }
  };

  if (!canApprove()) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <ShieldCheck size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
        <h2 style={{ color: '#334155', fontSize: '20px', margin: '0 0 8px 0' }}>Access Restricted</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Only Sales Managers and Finance Controllers can access the Approvals Inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Managerial Approval Inbox
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Review, approve, or reject escalated quotations requiring {currentUser.role} authorization.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div
          className="card"
          onClick={() => {
            setFilter('PendingApproval');
            setCurrentPage(1);
          }}
          style={{
            cursor: 'pointer',
            padding: '16px 20px',
            marginBottom: 0,
            borderLeft: filter === 'PendingApproval' ? '4px solid #f59e0b' : '4px solid transparent',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{pendingCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Approval</div>
            </div>
          </div>
        </div>
        <div
          className="card"
          onClick={() => {
            setFilter('Approved');
            setCurrentPage(1);
          }}
          style={{
            cursor: 'pointer',
            padding: '16px 20px',
            marginBottom: 0,
            borderLeft: filter === 'Approved' ? '4px solid #22c55e' : '4px solid transparent',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#22c55e" />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{approvedCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Approved</div>
            </div>
          </div>
        </div>
        <div
          className="card"
          onClick={() => {
            setFilter('ALL');
            setCurrentPage(1);
          }}
          style={{
            cursor: 'pointer',
            padding: '16px 20px',
            marginBottom: 0,
            borderLeft: filter === 'ALL' ? '4px solid #0284c7' : '4px solid transparent',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#0284c7" />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>{quotes.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>All Quotations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading approval queue...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <CheckCircle2 size={36} color="#22c55e" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '16px', margin: '0 0 6px 0' }}>
            {filter === 'PendingApproval' ? 'Approval Queue Clear' : 'No Quotations Found'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            {filter === 'PendingApproval'
              ? 'No quotations are currently pending your review.'
              : 'No quotations match the selected filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginatedQuotes.map((q) => {
            const customer = customers[q.customerId];
            const risk = getRiskBadge(q.blendedRiskScore);
            const isExpanded = expandedQuote === q.id;
            const isLoading = actionLoading === q.id;

            return (
              <div key={q.id} className="card" style={{ padding: '0', marginBottom: 0 }}>
                {/* Quote Summary Row */}
                <div
                  onClick={() => setExpandedQuote(isExpanded ? null : q.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: q.status === 'PendingApproval' ? '#fef3c7' : q.status === 'Approved' ? '#dcfce7' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {q.status === 'PendingApproval' ? (
                        <AlertTriangle size={18} color="#f59e0b" />
                      ) : q.status === 'Approved' ? (
                        <CheckCircle2 size={18} color="#22c55e" />
                      ) : (
                        <FileText size={18} color="#64748b" />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                          {q.quoteNumber || q.id}
                        </span>
                        <span className={`badge badge-${q.status === 'PendingApproval' ? 'pending' : q.status === 'Approved' ? 'confirmed' : 'draft'}`}>
                          {q.status}
                        </span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: risk.bg,
                          color: risk.color,
                        }}>
                          {risk.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {customer ? customer.name : q.customerId} · Rep: {q.salesRepName || q.salesRepId} · {formatCurrency(q.netTotalCents || q.totalCents)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {q.grossMarginPercent !== undefined && (
                      <div style={{
                        textAlign: 'right',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: q.grossMarginPercent < 18 ? '#fef2f2' : '#f0fdf4',
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: q.grossMarginPercent < 18 ? '#ef4444' : '#22c55e',
                        }}>
                          {q.grossMarginPercent.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Margin</div>
                      </div>
                    )}
                    {isExpanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                  </div>
                </div>

                {/* Expanded Actions */}
                {isExpanded && (
                  <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid var(--border-subtle)',
                    backgroundColor: '#fafbfc',
                  }}>
                    {/* Line Items Preview */}
                    {q.lines && q.lines.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                          Line Items ({q.lines.length})
                        </div>
                        <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Product</th>
                              <th style={{ textAlign: 'center', padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Qty</th>
                              <th style={{ textAlign: 'right', padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Discount</th>
                              <th style={{ textAlign: 'right', padding: '6px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.lines.map((line) => (
                              <tr key={line.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '6px 8px', color: 'var(--text-main)' }}>{line.productName || line.description}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'center', color: 'var(--text-main)' }}>{line.quantity}</td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', color: (line.discountPct || line.discountPercentage || 0) > 15 ? '#ef4444' : 'var(--text-main)' }}>
                                  {(line.discountPct || line.discountPercentage || 0).toFixed(1)}%
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>
                                  {formatCurrency(line.lineTotalCents || line.lineSubtotalCents)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Approval Notes */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Approval / Rejection Remarks
                      </label>
                      <textarea
                        value={approvalNotes[q.id] || ''}
                        onChange={(e) => setApprovalNotes((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Enter audit remarks (required for rejection)..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '13px',
                          resize: 'vertical',
                          minHeight: '60px',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onOpenQuote && onOpenQuote(q.id)}
                        style={{ fontSize: '12.5px' }}
                      >
                        <ArrowUpRight size={14} />
                        <span>Open in Studio</span>
                      </button>
                      {q.status === 'PendingApproval' && (
                        <>
                          <button
                            className="btn"
                            disabled={isLoading}
                            onClick={(e) => { e.stopPropagation(); handleReject(q.id, q.version); }}
                            style={{
                              fontSize: '12.5px',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                            }}
                          >
                            <XCircle size={14} />
                            <span>{isLoading ? 'Processing...' : 'Reject & Fallback'}</span>
                          </button>
                          <button
                            className="btn btn-primary"
                            disabled={isLoading}
                            onClick={(e) => { e.stopPropagation(); handleApprove(q.id, q.version); }}
                            style={{ fontSize: '12.5px' }}
                          >
                            <CheckCircle2 size={14} />
                            <span>{isLoading ? 'Processing...' : 'Approve'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ marginTop: '12px' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredQuotes.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 25, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
