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
  Gauge,
  Activity,
  Layers,
  Check,
  Truck,
  Package,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { MarginSpeedometerGauge } from '../components/MarginSpeedometerGauge';
import { TierSpendVelocityCurve } from '../components/TierSpendVelocityCurve';
import { BlendedRiskRadarChart } from '../components/BlendedRiskRadarChart';
import { FallbackBanner } from '../components/FallbackBanner';

export function QuotationStudio({ quoteId, onBack, onOpenPortal }) {
  const { currentUser, canApprove, canViewInternalMargins, isCustomer, isWarehouse, canCreateQuotes } = useAuth();
  const { sendAction, lastEvent, addToast } = useWebSocket();

  const [quote, setQuote] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [counterDiscount, setCounterDiscount] = useState(15);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [telemetryTab, setTelemetryTab] = useState('gauge'); // 'gauge' | 'curve' | 'radar'

  // Phase 8 Multi-Warehouse Split Shipments & Backorders
  const [shipments, setShipments] = useState([]);
  const [backorders, setBackorders] = useState([]);
  const [allocating, setAllocating] = useState(false);

  // Helper for product category discount ceilings
  const getCategoryCeiling = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('hardware')) return 15;
    if (cat.includes('service')) return 10;
    if (cat.includes('subscription')) return 20;
    return 15;
  };

  // Fetch linked shipments and backorders for active quote
  const fetchShipments = async (qId) => {
    if (!qId) return;
    try {
      const res = await fetch(`/api/quotes/${qId}/shipments`).then((r) => r.json());
      if (res.success) {
        setShipments(res.shipments || []);
        setBackorders(res.backorders || []);
      }
    } catch {
      // Non-blocking
    }
  };

  const handleTriggerAllocation = async () => {
    if (!quote?.id) return;
    try {
      setAllocating(true);
      const res = await fetch(`/api/quotes/${quote.id}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then((r) => r.json());

      if (res.success) {
        setShipments(res.shipments || []);
        setBackorders(res.backorders || []);
        addToast?.(
          'Allocation Completed',
          `Split ${res.shipments.length} shipment order(s) across regional depots.`,
          'success'
        );
      } else {
        addToast?.('Allocation Failed', res.error, 'danger');
      }
    } catch (err) {
      addToast?.('Error', err.message, 'danger');
    } finally {
      setAllocating(false);
    }
  };

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
      fetchShipments(quote.id);
    }
  }, [quote?.id, quote?.status]);

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
            discountPercent: Number(l.unitDiscountPercentage ?? l.discountPercent) || 0,
            unitDiscountPercentage: Number(l.unitDiscountPercentage ?? l.discountPercent) || 0,
          })),
        };

        const res = await fetch('/api/pricing/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((r) => r.json());

        if (res.success && (res.preview || res.breakdown)) {
          setPreview(res.preview || res.breakdown);
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

  // 1-Click Margin-Lifting Upsell Attachment
  const handleApplyUpsell = (rec) => {
    const matchedProd = products.find((p) => p.sku === rec.sku || p.name === rec.name) || products[0];
    if (!matchedProd) return;
    const newLine = {
      id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: matchedProd.id,
      quantity: 1,
      unitDiscountPercentage: 0,
    };
    setQuote((prev) => ({
      ...prev,
      lines: [...(prev.lines || []), newLine],
    }));
    addToast('Upsell Added', `Attached "${rec.name}" (+${(rec.estimatedMarginLiftPct || 3.5).toFixed(1)}% margin lift)`, 'success');
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

  // Manager / Finance Reject & Revert to Graceful Fallback
  const handleRejectAndFallback = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/quotes/${quote.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approverId: currentUser.id,
          approverRole: currentUser.role,
          approverName: currentUser.name,
          rejectionReason: 'Counter-discount breaches enterprise gross margin floors.',
          expectedVersion: quote.version,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setQuote(res.quotation);
        addToast('Fallback Reverted', 'Counter-offer rejected. Terms rolled back to Last Approved Best Offer.', 'warning');
      } else {
        addToast('Rejection Failed', res.error, 'danger');
      }
    } catch {
      addToast('Error', 'Failed to execute fallback reversion', 'danger');
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
  const currentMargin = preview?.grossMarginPercentage ?? preview?.grossMarginPercent ?? quote.grossMarginPercent ?? quote.grossMarginPercentage ?? 0;
  const netTotal = preview?.netTotalCents ?? quote.netTotalCents ?? 0;
  const costTotal = preview?.costTotalCents ?? preview?.totalCostCents ?? quote.costTotalCents ?? quote.totalCostCents ?? 0;
  const blendedScore = preview?.escalation?.blendedRiskScore ?? 0;
  const maxDiscountInLines = Math.max(...(quote.lines?.map((l) => Number(l.unitDiscountPercentage ?? l.discountPercent ?? 0)) || [0]));

  const formatCurrency = (cents) => `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const isFloorBreached = currentMargin < 18.0;

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
                {isWarehouse()
                  ? `Dispatch Packing Slip: ${quote.quoteNumber || quote.id}`
                  : isCustomer()
                  ? `Commercial Proposal: ${quote.quoteNumber || quote.id}`
                  : (quote.quoteNumber || 'Draft Proposal')}
              </h1>
              <span className={`badge ${quote.status === 'Approved' ? 'badge-approved' : quote.status === 'Confirmed' ? 'badge-confirmed' : 'badge-draft'}`}>
                {quote.status}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                v{quote.version}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Client: {activeCustomer.name || quote.customerId} • Tier: <strong style={{ color: 'var(--primary)' }}>{activeCustomer.tier || 'Bronze'}</strong> • Terms: {activeCustomer.paymentTerms || 'Net30'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onOpenPortal && !isWarehouse() && (
            <button
              className="btn btn-secondary"
              onClick={() => onOpenPortal(quote.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={15} />
              <span>Customer Portal View</span>
            </button>
          )}

          {canCreateQuotes() && quote.status === 'Draft' && (
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
            <>
              <button
                className="btn btn-secondary"
                onClick={handleRejectAndFallback}
                disabled={saving}
                style={{
                  borderColor: 'var(--danger-border, #fecaca)',
                  color: 'var(--danger, #dc2626)',
                  backgroundColor: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <XCircle size={15} />
                <span>Reject & Revert to Fallback</span>
              </button>
              <button className="btn btn-success" onClick={handleApprove} disabled={saving}>
                <CheckCircle size={15} />
                <span>Authorize Quotation</span>
              </button>
            </>
          )}

          {isCustomer() && quote.status === 'Approved' && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowCounterModal(true)} disabled={saving}>
                <TrendingUp size={15} />
                <span>Request Counter-Offer</span>
              </button>
              <button className="btn btn-success" onClick={handleConfirm} disabled={saving || isFloorBreached}>
                <CheckCircle size={15} />
                <span>1-Click Binding Confirm</span>
              </button>
            </>
          )}

          {canCreateQuotes() && quote.status === 'Approved' && (
            <button className="btn btn-success" onClick={handleConfirm} disabled={saving || isFloorBreached}>
              <CheckCircle size={15} />
              <span>Finalize Order</span>
            </button>
          )}

          {isWarehouse() && (
            <span className="badge badge-confirmed" style={{ fontSize: '11.5px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Truck size={14} />
              <span>Depot Dispatch Station</span>
            </span>
          )}
        </div>
      </div>

      {/* Graceful Fallback Notice Banner */}
      <FallbackBanner quotation={quote} isCustomer={false} />

      {/* Main Grid: Line Items + Real-Time Deal Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.15fr', gap: '20px' }}>
        {/* Left Column: Line Items Matrix */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {isWarehouse() ? 'Warehouse Picking & Packing SKU Items' : isCustomer() ? 'Proposal Line Items' : 'Commercial Line Items Matrix'}
            </span>
            {canCreateQuotes() && quote.status === 'Draft' && (
              <button className="btn btn-secondary btn-sm" onClick={handleAddLine}>
                <Plus size={14} />
                <span>Add SKU Line</span>
              </button>
            )}
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ minWidth: '220px' }}>Product / SKU</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>List Price</th>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: '130px' }}>Quantity</th>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: '100px' }}>Discount %</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Net Price</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Line Total</th>
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
                  const ceiling = getCategoryCeiling(product.category);
                  const isCeilingBreached = discountPct > ceiling;
                  const qtyLength = String(line.quantity || 1).length;
                  const dynamicQtyWidth = Math.max(72, qtyLength * 11 + 36);

                  return (
                    <tr key={line.id}>
                      <td>
                        {!isCustomer() && quote.status === 'Draft' ? (
                          <div>
                            <select
                              className="form-control"
                              value={line.productId}
                              onChange={(e) => handleLineChange(line.id, 'productId', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '12.5px' }}
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({p.sku}) - {p.category}
                                </option>
                              ))}
                            </select>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Category: {product.category || 'Hardware'} • Ceiling: {ceiling}%
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 600 }}>{product.name || line.productId}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {product.sku} • {product.category || 'Hardware'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatCurrency(listPrice)}</td>
                      <td className="qty-cell" style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {canCreateQuotes() && quote.status === 'Draft' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <input
                              type="number"
                              min="1"
                              max="999999"
                              className="form-control no-spin"
                              value={line.quantity || 1}
                              onChange={(e) => handleLineChange(line.id, 'quantity', e.target.value)}
                              style={{
                                padding: '5px 8px',
                                textAlign: 'center',
                                width: `${dynamicQtyWidth}px`,
                                minWidth: '72px',
                                maxWidth: '140px',
                                fontSize: '13.5px',
                                fontWeight: 700,
                                boxSizing: 'border-box',
                              }}
                            />
                            <span className="unit-tag">units</span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: '13.5px' }}>
                            {Number(line.quantity || 1).toLocaleString()} <span className="unit-tag">units</span>
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {canCreateQuotes() && quote.status === 'Draft' ? (
                          <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="form-control no-spin"
                                value={discountPct}
                                onChange={(e) => handleLineChange(line.id, 'unitDiscountPercentage', e.target.value)}
                                style={{
                                  padding: '5px 8px',
                                  textAlign: 'center',
                                  width: `${Math.max(56, String(discountPct).length * 10 + 26)}px`,
                                  minWidth: '56px',
                                  maxWidth: '80px',
                                  fontSize: '13.5px',
                                  fontWeight: 600,
                                  borderColor: isCeilingBreached ? 'var(--danger, #ef4444)' : undefined,
                                }}
                              />
                              <span className="unit-tag">%</span>
                            </div>
                            {isCeilingBreached && (
                              <div style={{ fontSize: '9.5px', color: 'var(--danger, #ef4444)', fontWeight: 600, marginTop: '2px' }}>
                                &gt; {ceiling}% cap!
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{discountPct}%</span>
                            {isCeilingBreached && (
                              <span style={{ fontSize: '10px', color: 'var(--danger, #ef4444)', marginLeft: '4px' }}>
                                (over cap)
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatCurrency(netPrice)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{formatCurrency(lineTotal)}</td>
                      {canCreateQuotes() && quote.status === 'Draft' && (
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRemoveLine(line.id)}
                            style={{ padding: '4px', color: 'var(--danger)' }}
                            title="Remove line item"
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

        {/* Right Column: Financial Ledger / Depot Routing & Interactive Telemetry Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Multi-Depot Fulfillment Manifest Card (Phase 8 Multi-Warehouse Split) */}
          {(isWarehouse() || quote?.status === 'Confirmed' || shipments.length > 0) && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header" style={{ paddingBottom: '10px' }}>
                <span className="card-title" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} color="var(--primary)" />
                  <span>Multi-Depot Fulfillment Manifest</span>
                </span>
                {quote?.status === 'Confirmed' ? (
                  <span className="badge badge-confirmed" style={{ fontSize: '10.5px' }}>
                    Active Order
                  </span>
                ) : (
                  <span className="badge badge-pending" style={{ fontSize: '10.5px' }}>
                    Preview Split
                  </span>
                )}
              </div>

              {shipments.length === 0 ? (
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '4px 0' }}>
                  <div>No warehouse shipments dispatched yet. Stock will be auto-allocated across 6 continental depots upon digital contract confirmation.</div>
                  {quote?.id && !isCustomer() && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '10px', fontSize: '11.5px', width: '100%' }}
                      onClick={handleTriggerAllocation}
                      disabled={allocating}
                    >
                      {allocating ? 'Allocating 6 Depots...' : 'Simulate Multi-Depot Split'}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Split across <strong>{shipments.length}</strong> fulfillment depot(s):
                  </div>

                  {shipments.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {s.warehouseName || s.warehouseCode || s.warehouseId}
                        </span>
                        <span
                          className={s.status === 'Shipped' ? 'badge badge-approved' : 'badge badge-pending'}
                          style={{ fontSize: '10px' }}
                        >
                          {s.status || 'Placed'}
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Items: {(s.items || []).map((it) => `${it.productName || it.productId} (${it.quantity}u)`).join(', ') || `${s.totalUnits || 1} units`}
                      </div>

                      {s.trackingNumber && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontFamily: 'monospace', marginTop: '2px' }}>
                          TRK: {s.trackingNumber} ({s.carrier || 'FedEx'})
                        </div>
                      )}
                    </div>
                  ))}

                  {backorders.length > 0 && (
                    <div
                      style={{
                        marginTop: '4px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        fontSize: '11.5px',
                        color: '#92400e',
                      }}
                    >
                      <strong>Backorder Alert:</strong> {backorders.reduce((sum, b) => sum + b.quantity, 0)} units unfulfilled awaiting factory restock.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Financial Ledger Summary Card (Hidden for Warehouse) */}
          {!isWarehouse() && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <span className="card-title">
                  <DollarSign size={16} />
                  <span>Financial Ledger</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Catalog Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(preview?.subtotalCents || quote.subtotalCents)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Discounts & Incentives</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>
                    -{formatCurrency(preview?.totalDiscountCents || preview?.discountTotalCents || quote.discountAmountCents || 0)}
                  </span>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                  <span style={{ fontWeight: 700 }}>Contract Net Total</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(netTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Visual Telemetry Console */}
          {canViewInternalMargins() && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header" style={{ paddingBottom: '10px' }}>
                <span className="card-title" style={{ fontSize: '13px' }}>
                  <Activity size={15} color="var(--primary)" />
                  <span>Real-Time Deal Telemetry</span>
                </span>
              </div>

              {/* Telemetry Tab Selector (Phase 5 Segmented Pill) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '4px',
                  backgroundColor: 'var(--bg-subtle, #f1f5f9)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  padding: '3px',
                  borderRadius: '7px',
                  marginBottom: '12px',
                }}
              >
                <button
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    border: telemetryTab === 'gauge' ? '1px solid var(--border-subtle, #e2e8f0)' : '1px solid transparent',
                    backgroundColor: telemetryTab === 'gauge' ? '#ffffff' : 'transparent',
                    color: telemetryTab === 'gauge' ? 'var(--primary, #0284c7)' : 'var(--text-muted, #64748b)',
                    fontWeight: telemetryTab === 'gauge' ? 700 : 500,
                    boxShadow: telemetryTab === 'gauge' ? 'var(--shadow-xs)' : 'none',
                  }}
                  onClick={() => setTelemetryTab('gauge')}
                >
                  <Gauge size={13} />
                  <span>Margin</span>
                </button>
                <button
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    border: telemetryTab === 'curve' ? '1px solid var(--border-subtle, #e2e8f0)' : '1px solid transparent',
                    backgroundColor: telemetryTab === 'curve' ? '#ffffff' : 'transparent',
                    color: telemetryTab === 'curve' ? 'var(--primary, #0284c7)' : 'var(--text-muted, #64748b)',
                    fontWeight: telemetryTab === 'curve' ? 700 : 500,
                    boxShadow: telemetryTab === 'curve' ? 'var(--shadow-xs)' : 'none',
                  }}
                  onClick={() => setTelemetryTab('curve')}
                >
                  <TrendingUp size={13} />
                  <span>Tier Velocity</span>
                </button>
                <button
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    border: telemetryTab === 'radar' ? '1px solid var(--border-subtle, #e2e8f0)' : '1px solid transparent',
                    backgroundColor: telemetryTab === 'radar' ? '#ffffff' : 'transparent',
                    color: telemetryTab === 'radar' ? 'var(--primary, #0284c7)' : 'var(--text-muted, #64748b)',
                    fontWeight: telemetryTab === 'radar' ? 700 : 500,
                    boxShadow: telemetryTab === 'radar' ? 'var(--shadow-xs)' : 'none',
                  }}
                  onClick={() => setTelemetryTab('radar')}
                >
                  <ShieldAlert size={13} />
                  <span>Risk Radar</span>
                </button>
              </div>

              {/* Render Selected Visualization */}
              <div style={{ minHeight: '160px' }}>
                {telemetryTab === 'gauge' && (
                  <MarginSpeedometerGauge margin={currentMargin} />
                )}

                {telemetryTab === 'curve' && (
                  <TierSpendVelocityCurve customer={activeCustomer} />
                )}

                {telemetryTab === 'radar' && (
                  <BlendedRiskRadarChart
                    riskData={{
                      blendedRiskScore: blendedScore,
                      grossMarginPercent: currentMargin,
                      maxDiscountPercent: maxDiscountInLines,
                      escalationTier: preview?.escalation?.requiredTier || 'SalesRep',
                    }}
                  />
                )}
              </div>

              {/* Hard Floor Block Warning Banner */}
              {isFloorBreached && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--danger-light, #fef2f2)',
                    border: '1px solid var(--danger-border, #fecaca)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: 'var(--danger, #dc2626)',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <ShieldAlert size={18} color="var(--danger, #dc2626)" />
                  <span>HARD BLOCK: Margin ({currentMargin.toFixed(1)}%) breaches statutory 18% floor. Binding order confirmation is locked.</span>
                </div>
              )}
            </div>
          )}

          {/* 1-Click Margin-Lifting Recommendations Card */}
          {canViewInternalMargins() && (preview?.upsellSuggestions?.length > 0 || preview?.upsellRecommendations?.length > 0) && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <span className="card-title" style={{ fontSize: '13px' }}>
                  <Sparkles size={15} color="var(--primary, #0284c7)" />
                  <span>Margin-Lifting Recommendations</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(preview.upsellSuggestions || preview.upsellRecommendations).map((rec) => (
                  <div
                    key={rec.sku}
                    style={{
                      padding: '11px 13px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-canvas, #f8fafc)',
                      border: '1px solid var(--border-subtle, #e2e8f0)',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main, #0f172a)' }}>{rec.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--success, #059669)', fontWeight: 600, marginTop: '2px' }}>
                        +{rec.estimatedMarginLiftPct?.toFixed(1) || 4.2}% margin lift • {formatCurrency(rec.listPriceCents)}
                      </div>
                    </div>
                    {!isCustomer() && quote.status === 'Draft' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11.5px', padding: '5px 12px', color: 'var(--primary, #0284c7)', fontWeight: 600 }}
                        onClick={() => handleApplyUpsell(rec)}
                      >
                        <Plus size={13} />
                        <span>Attach</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default QuotationStudio;
