import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Save,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export function QuotationStudio({ quoteId, onBack }) {
  const { currentUser, canApprove, canViewInternalMargins, isCustomer } = useAuth();
  const { sendAction, lastEvent, addToast } = useWebSocket();

  const [quote, setQuote] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [counterDiscount, setCounterDiscount] = useState(15);
  const [showCounterModal, setShowCounterModal] = useState(false);

  // Load catalog and quote
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [cRes, pRes] = await Promise.all([
          fetch('/api/customers').then((r) => r.json()),
          fetch('/api/products').then((r) => r.json()),
        ]);

        if (cRes.success) setCustomers(cRes.customers || []);
        if (pRes.success) setProducts(pRes.products || []);

        if (quoteId) {
          const qRes = await fetch(`/api/quotes/${quoteId}`).then((r) => r.json());
          if (qRes.success && qRes.quotation) {
            setQuote(qRes.quotation);
          }
        } else {
          // New draft initialization
          setQuote({
            id: `quote-new-${Date.now()}`,
            quoteNumber: `Q-2026-${Math.floor(100 + Math.random() * 900)}`,
            customerId: cRes.customers?.[0]?.id || 'cust-acme-01',
            salesRepId: currentUser.id,
            status: 'Draft',
            version: 1,
            lines: [
              {
                id: `line-${Date.now()}-1`,
                productId: pRes.products?.[0]?.id || 'prod-srv-01',
                quantity: 1,
                unitDiscountPercentage: 5,
              },
            ],
          });
        }
      } catch (err) {
        addToast('Error', 'Failed to load quotation studio reference data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [quoteId, currentUser.id]);

  // Subscribe to quote topic
  useEffect(() => {
    if (quote?.id) {
      sendAction('subscribe', { topic: `quotation:${quote.id}` });
    }
  }, [quote?.id]);

  // Real-time remote updates
  useEffect(() => {
    if (lastEvent && lastEvent.data?.id === quote?.id) {
      if (lastEvent.event === 'QUOTE_UPDATED' || lastEvent.event === 'APPROVAL_GRANTED' || lastEvent.event === 'FALLBACK_REVERTED') {
        setQuote(lastEvent.data);
      }
    }
  }, [lastEvent]);

  // Calculate live preview on change
  useEffect(() => {
    if (!quote || !quote.lines || quote.lines.length === 0) return;

    const timeout = setTimeout(async () => {
      try {
        const payload = {
          customerId: quote.customerId,
          lines: quote.lines.map((l) => ({
            productId: l.productId,
            quantity: Number(l.quantity) || 1,
            discountPercent: Number(l.unitDiscountPercentage) || 0,
          })),
        };

        const res = await fetch('/api/pricing/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((r) => r.json());

        if (res.success && res.breakdown) {
          setPreview(res.breakdown);
        }
      } catch {
        // Ignored
      }
    }, 120);

    return () => clearTimeout(timeout);
  }, [quote?.customerId, quote?.lines]);

  const handleAddLine = () => {
    if (!products || products.length === 0) return;
    const newLine = {
      id: `line-${Date.now()}-${Math.random()}`,
      productId: products[0].id,
      quantity: 1,
      unitDiscountPercentage: 0,
    };
    setQuote((prev) => ({
      ...prev,
      lines: [...(prev.lines || []), newLine],
    }));
  };

  const handleRemoveLine = (lineId) => {
    setQuote((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.id !== lineId),
    }));
  };

  const handleLineChange = (lineId, field, val) => {
    // Broadcast presence typing hint
    sendAction('presence', { quoteId: quote.id, field, status: 'editing' });

    setQuote((prev) => ({
      ...prev,
      lines: prev.lines.map((l) => (l.id === lineId ? { ...l, [field]: val } : l)),
    }));
  };

  // Submit quote modifications
  const handleSave = async () => {
    try {
      setSaving(true);
      const isNew = quote.id.startsWith('quote-new-');
      const url = isNew ? '/api/quotes' : `/api/quotes/${quote.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        customerId: quote.customerId,
        salesRepId: quote.salesRepId || currentUser.id,
        lines: quote.lines,
        expectedVersion: quote.version,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        addToast('Saved', `Quotation ${res.quotation.quoteNumber || res.quotation.id} saved successfully!`, 'success');
      } else {
        addToast('Save Failed', res.error || 'Conflict detected', 'danger');
      }
    } catch {
      addToast('Error', 'Failed to communicate with pricing engine', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // Submit for Approval
  const handleSubmitForApproval = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/quotes/${quote.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expectedVersion: quote.version }),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        addToast('Submitted', 'Quotation submitted for managerial approval.', 'info');
      } else {
        addToast('Submission Failed', res.error, 'danger');
      }
    } catch {
      addToast('Error', 'Failed to submit quote for approval', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // Manager / Finance Approve
  const handleApprove = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/quotes/${quote.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approverId: currentUser.id,
          approverRole: currentUser.role,
          expectedVersion: quote.version,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        addToast('Approved', `Quotation authorized by ${currentUser.name}`, 'success');
      } else {
        addToast('Approval Failed', res.error, 'danger');
      }
    } catch {
      addToast('Error', 'Approval submission failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // Customer Counter-Offer
  const handleCounterOffer = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/quotes/${quote.id}/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counterDiscountPct: Number(counterDiscount),
          reason: 'Volume procurement alignment request',
          expectedVersion: quote.version,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        setShowCounterModal(false);
        addToast('Counter Submitted', `Counter-offer sent to sales management.`, 'info');
      } else {
        addToast('Counter Failed', res.error, 'danger');
      }
    } catch {
      addToast('Error', 'Counter-offer submission failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Confirm to Order
  const handleConfirm = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/quotes/${quote.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmedBy: currentUser.id,
          expectedVersion: quote.version,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        addToast('Confirmed', `Quotation finalized into binding order!`, 'success');
      } else {
        addToast('Confirmation Blocked', res.error, 'danger');
      }
    } catch {
      addToast('Error', 'Confirmation failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !quote) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Interactive CPQ Studio...</div>;
  }

  const activeCustomer = customers.find((c) => c.id === quote.customerId) || {};
  const currentMargin = preview?.grossMarginPercent ?? quote.grossMarginPercent ?? 0;
  const netTotal = preview?.netTotalCents ?? quote.netTotalCents ?? 0;
  const costTotal = preview?.totalCostCents ?? quote.totalCostCents ?? 0;

  const formatCurrency = (cents) => `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Studio Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, margin: 0 }}>
                {quote.quoteNumber || 'Draft Proposal'}
              </h1>
              <span className={`badge ${quote.status === 'Approved' ? 'badge-approved' : quote.status === 'Confirmed' ? 'badge-confirmed' : 'badge-draft'}`}>
                {quote.status}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                v{quote.version}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Client: {activeCustomer.name || quote.customerId} • Terms: {activeCustomer.paymentTerms || 'Net30'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!isCustomer() && quote.status === 'Draft' && (
            <>
              <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
                <Save size={15} />
                <span>Save Draft</span>
              </button>
              <button className="btn btn-primary" onClick={handleSubmitForApproval} disabled={saving}>
                <Send size={15} />
                <span>Submit for Approval</span>
              </button>
            </>
          )}

          {canApprove() && quote.status === 'PendingApproval' && (
            <button className="btn btn-success" onClick={handleApprove} disabled={saving}>
              <CheckCircle size={15} />
              <span>Authorize Quotation</span>
            </button>
          )}

          {isCustomer() && quote.status === 'Approved' && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowCounterModal(true)} disabled={saving}>
                <TrendingUp size={15} />
                <span>Request Counter-Offer</span>
              </button>
              <button className="btn btn-success" onClick={handleConfirm} disabled={saving}>
                <CheckCircle size={15} />
                <span>1-Click Binding Confirm</span>
              </button>
            </>
          )}

          {!isCustomer() && quote.status === 'Approved' && (
            <button className="btn btn-success" onClick={handleConfirm} disabled={saving}>
              <CheckCircle size={15} />
              <span>Finalize Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Line Items + Real-Time Deal Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left Column: Line Items Matrix */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Commercial Line Items</span>
            {!isCustomer() && quote.status === 'Draft' && (
              <button className="btn btn-secondary btn-sm" onClick={handleAddLine}>
                <Plus size={14} />
                <span>Add Hardware / Service</span>
              </button>
            )}
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product / SKU</th>
                  <th>List Price</th>
                  <th style={{ width: '80px' }}>Qty</th>
                  <th style={{ width: '100px' }}>Discount %</th>
                  <th>Net Price</th>
                  <th>Total</th>
                  {!isCustomer() && quote.status === 'Draft' && <th style={{ width: '40px' }}></th>}
                </tr>
              </thead>
              <tbody>
                {quote.lines?.map((line) => {
                  const product = products.find((p) => p.id === line.productId) || {};
                  const listPrice = product.listPriceCents || line.unitListPriceCents || 0;
                  const discountPct = Number(line.unitDiscountPercentage ?? line.discountPercent) || 0;
                  const netPrice = Math.round(listPrice * (1 - discountPct / 100));
                  const lineTotal = netPrice * (Number(line.quantity) || 1);

                  return (
                    <tr key={line.id}>
                      <td>
                        {!isCustomer() && quote.status === 'Draft' ? (
                          <select
                            className="form-control"
                            value={line.productId}
                            onChange={(e) => handleLineChange(line.id, 'productId', e.target.value)}
                            style={{ padding: '4px 8px', fontSize: '12.5px' }}
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 600 }}>{product.name || line.productId}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.sku}</div>
                          </div>
                        )}
                      </td>
                      <td>{formatCurrency(listPrice)}</td>
                      <td>
                        {!isCustomer() && quote.status === 'Draft' ? (
                          <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={line.quantity || 1}
                            onChange={(e) => handleLineChange(line.id, 'quantity', e.target.value)}
                            style={{ padding: '4px 8px', textAlign: 'center' }}
                          />
                        ) : (
                          <span>{line.quantity}</span>
                        )}
                      </td>
                      <td>
                        {!isCustomer() && quote.status === 'Draft' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="number"
                              min="0"
                              max="35"
                              className="form-control"
                              value={discountPct}
                              onChange={(e) => handleLineChange(line.id, 'unitDiscountPercentage', e.target.value)}
                              style={{ padding: '4px 8px', textAlign: 'center' }}
                            />
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>%</span>
                          </div>
                        ) : (
                          <span>{discountPct}%</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(netPrice)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(lineTotal)}</td>
                      {!isCustomer() && quote.status === 'Draft' && (
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRemoveLine(line.id)}
                            style={{ padding: '4px', color: 'var(--danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Real-Time Deal Health Widget */}
        <div>
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <DollarSign size={16} />
                <span>Financial Ledger</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Catalog Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(preview?.subtotalCents || quote.subtotalCents)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Discounts & Incentives</span>
                <span style={{ fontWeight: 600, color: 'var(--danger)' }}>
                  -{formatCurrency(preview?.discountAmountCents || quote.discountAmountCents)}
                </span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                <span style={{ fontWeight: 700 }}>Contract Net Total</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(netTotal)}</span>
              </div>
            </div>

            {/* Internal Gross Margin Speedometer */}
            {canViewInternalMargins() && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Deal Gross Margin
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: currentMargin >= 25 ? 'var(--success)' : currentMargin >= 18 ? 'var(--warning)' : 'var(--danger)',
                    }}
                  >
                    {currentMargin.toFixed(1)}%
                  </span>
                </div>

                {/* Speedometer Margin Bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, currentMargin))}%`,
                      backgroundColor: currentMargin >= 25 ? 'var(--success)' : currentMargin >= 18 ? 'var(--warning)' : 'var(--danger)',
                      transition: 'width 200ms ease, background-color 200ms ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>0%</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Floor 18%</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>Target 25%</span>
                  <span>100%</span>
                </div>

                {/* Governance Alert Pill */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: currentMargin < 18 ? 'var(--danger-light)' : currentMargin < 25 ? 'var(--warning-light)' : 'var(--success-light)',
                    border: `1px solid ${currentMargin < 18 ? 'var(--danger-border)' : currentMargin < 25 ? 'var(--warning-border)' : 'var(--success-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                  }}
                >
                  <ShieldAlert size={16} color={currentMargin < 18 ? 'var(--danger)' : currentMargin < 25 ? 'var(--warning)' : 'var(--success)'} />
                  <span>
                    {currentMargin < 18
                      ? 'Hard Block: Breaches 18% margin floor. Transaction cannot be confirmed.'
                      : currentMargin <= 20
                      ? 'Escalation Required: Requires Sales Manager sign-off.'
                      : 'Self-Approved: Within standard sales rep discretionary ceiling.'}
                  </span>
                </div>
              </div>
            )}

            {/* High-Margin Upsell Chips */}
            {canViewInternalMargins() && preview?.upsellSuggestions?.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>
                  <Sparkles size={14} />
                  <span>Margin-Lifting Recommendations</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {preview.upsellSuggestions.map((rec) => (
                    <div
                      key={rec.sku}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11.5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{rec.name}</div>
                        <div style={{ color: 'var(--text-muted)' }}>+{rec.estimatedMarginLiftPct?.toFixed(1)}% margin lift</div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(rec.listPriceCents)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Counter-Offer Modal */}
      {showCounterModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div className="card" style={{ width: '420px', marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title">Submit Counter-Offer</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Propose a revised discount percentage for executive management consideration:
            </p>
            <div className="form-group">
              <label className="form-label">Requested Target Discount: {counterDiscount}%</label>
              <input
                type="range"
                min="5"
                max="30"
                value={counterDiscount}
                onChange={(e) => setCounterDiscount(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowCounterModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCounterOffer} disabled={saving}>
                Submit Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
