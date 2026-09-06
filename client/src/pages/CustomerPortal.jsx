import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { FallbackBanner } from '../components/FallbackBanner';
import { Pagination } from '../components/Pagination';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Send,
  DollarSign,
  TrendingDown,
  Building,
  User,
  Check,
  RotateCcw,
  Sparkles,
  Truck,
  MapPin,
  Package,
} from 'lucide-react';

/**
 * CustomerPortal - External B2B Customer Negotiation Portal (Screen 11)
 * 
 * Provides an external, secure procurement view for enterprise buyers:
 * 1. Proposal review with complete commercial margin cloaking (zero COGS/margins leaked).
 * 2. Interactive counter-discount submission with OCC version validation.
 * 3. Graceful Fallback Reversion display to Last Approved Best Offer on rejection.
 * 4. 1-Click Binding Digital Acceptance ("Confirm Terms & Sign") converting to Confirmed Order.
 * 5. Embedded real-time commercial negotiation chat feed synced via WebSockets.
 * 
 * @param {Object} props
 * @param {string} [props.quoteId] - Target quotation ID
 * @param {Function} [props.onBack] - Return navigation callback
 */
export function CustomerPortal({ quoteId, onBack }) {
  const { currentUser } = useAuth();
  const { isConnected, lastEvent } = useWebSocket();

  const [quotation, setQuotation] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 8 Multi-Depot Delivery & Shipments State (Commercial margins cloaked)
  const [shipments, setShipments] = useState([]);
  const [backorders, setBackorders] = useState([]);

  // Counter-offer form state
  const [counterDiscount, setCounterDiscount] = useState(15);
  const [counterNotes, setCounterNotes] = useState('');
  const [submittingCounter, setSubmittingCounter] = useState(false);
  const [counterSuccessMessage, setCounterSuccessMessage] = useState(null);

  // Digital Acceptance state
  const [confirming, setConfirming] = useState(false);
  const [signatureName, setSignatureName] = useState(currentUser.name || 'Sarah Jenkins');
  const [showSignModal, setShowSignModal] = useState(false);



  const [availableQuotes, setAvailableQuotes] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState(quoteId || null);

  // Pagination for line items
  const [linesPage, setLinesPage] = useState(1);
  const [linesPageSize, setLinesPageSize] = useState(5);

  useEffect(() => {
    if (quoteId) {
      setSelectedQuoteId(quoteId);
    }
  }, [quoteId]);

  const activeQuoteId = quotation?.id || selectedQuoteId;

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch available quotations list
      let quotesList = availableQuotes;
      try {
        const listRes = await fetch('/api/quotes');
        const listData = await listRes.json();
        if (listData && Array.isArray(listData.quotations)) {
          quotesList = listData.quotations;
          setAvailableQuotes(quotesList);
        }
      } catch (listErr) {
        console.warn('Could not fetch quotes list:', listErr);
      }

      // 2. Determine target ID to query
      let targetId = selectedQuoteId;
      if (!targetId || targetId === 'Q-2026-001') {
        if (quotesList.length > 0) {
          targetId = quotesList[0].id;
          setSelectedQuoteId(targetId);
        }
      }

      if (!targetId) {
        setLoading(false);
        setError('No commercial proposals have been authored yet. Please create a quote in Quotation Studio first.');
        return;
      }

      // 3. Fetch portal data
      let res = await fetch(`/api/quotes/${targetId}/portal`);
      let data = await res.json();

      // If portal 404s, try standard single quote endpoint or fallback to first available
      if ((!data.success || !data.quotation) && quotesList.length > 0 && targetId !== quotesList[0].id) {
        targetId = quotesList[0].id;
        setSelectedQuoteId(targetId);
        res = await fetch(`/api/quotes/${targetId}/portal`);
        data = await res.json();
      }

      if (data.success && data.quotation) {
        setQuotation(data.quotation);
        setCustomer(data.customer || { name: 'Acme Industrial', tier: 'Gold' });
        setCounterDiscount(data.quotation.discountPercentage || 12);
      } else {
        // Fallback: try standard single quote endpoint
        const fallbackRes = await fetch(`/api/quotes/${targetId}`);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.quotation) {
          setQuotation(fallbackData.quotation);
          setCounterDiscount(fallbackData.quotation.discountPercentage || 12);
        } else {
          setError(data.error || 'Quotation proposal not found.');
        }
      }



      // Fetch logistics shipments & delivery tracking
      try {
        const shipRes = await fetch(`/api/quotes/${targetId}/shipments`);
        const shipData = await shipRes.json();
        if (shipData.success) {
          setShipments(shipData.shipments || []);
          setBackorders(shipData.backorders || []);
        }
      } catch {
        // Shipments are non-blocking
      }
    } catch (err) {
      setError('Failed to connect to negotiation server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, [selectedQuoteId]);

  // Real-time WebSocket event synchronization
  useEffect(() => {
    if (!lastEvent) return;
    if (activeQuoteId && lastEvent.quoteId === activeQuoteId) {
      fetchPortalData();

      if (lastEvent.type === 'COUNTER_OFFER_RECEIVED') {
        setCounterSuccessMessage('Your counter-offer has been submitted and escalated to sales leadership.');
      } else if (lastEvent.type === 'APPROVAL_GRANTED') {
        setCounterSuccessMessage('Commercial terms have been approved! The proposal is ready for digital signing.');
      } else if (lastEvent.type === 'FALLBACK_REVERTED') {
        setCounterSuccessMessage('Counter-offer evaluated: Terms have reverted to the guaranteed Last Approved Offer.');
      }
    }
  }, [lastEvent, activeQuoteId]);



  const handleSubmitCounterOffer = async (e) => {
    e.preventDefault();
    if (!quotation || !activeQuoteId) return;

    try {
      setSubmittingCounter(true);
      setCounterSuccessMessage(null);
      setError(null);

      const res = await fetch(`/api/quotes/${activeQuoteId}/counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'If-Match': String(quotation.version),
        },
        body: JSON.stringify({
          requestedDiscountPercentage: Number(counterDiscount),
          customerNotes: counterNotes,
          expectedVersion: quotation.version,
        }),
      });

      const data = await res.json();
      if (data.success && data.quotation) {
        setQuotation(data.quotation);
        setCounterSuccessMessage(
          `Counter-offer of ${counterDiscount}% discount submitted successfully! Routed to Sales Leadership for formal review.`
        );
        setCounterNotes('');
      } else {
        setError(data.error || 'Failed to submit counter-offer.');
      }
    } catch (err) {
      setError('Submission error: ' + err.message);
    } finally {
      setSubmittingCounter(false);
    }
  };

  const handleConfirmTerms = async () => {
    if (!quotation || !activeQuoteId) return;

    try {
      setConfirming(true);
      setError(null);

      const res = await fetch(`/api/quotes/${activeQuoteId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'If-Match': String(quotation.version),
        },
        body: JSON.stringify({
          expectedVersion: quotation.version,
          signatureName: signatureName || 'Sarah Jenkins',
          signedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success && data.quotation) {
        setQuotation(data.quotation);
        setShowSignModal(false);
      } else {
        setError(data.error || 'Failed to confirm proposal.');
      }
    } catch (err) {
      setError('Confirmation error: ' + err.message);
    } finally {
      setConfirming(false);
    }
  };

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
          Loading Secure Negotiation Portal...
        </div>
        <div style={{ fontSize: '13px' }}>Verifying proposal token and establishing encrypted session...</div>
      </div>
    );
  }

  if (error && !quotation) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ padding: '24px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }}>
          <AlertTriangle size={36} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>Portal Access Notice</h3>
          <p style={{ margin: 0, fontSize: '13px' }}>{error}</p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onBack || (() => { window.location.href = '/quotes'; })}
            >
              Return to Workspace
            </button>
            {availableQuotes.length > 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedQuoteId(availableQuotes[0].id);
                  setError(null);
                }}
              >
                Load Active Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const lines = quotation?.lines || [];
  const subtotal = quotation?.subtotalCents || 0;
  const discountTotal = quotation?.discountAmountCents || (subtotal * (quotation?.discountPercentage || 0)) / 100;
  const netTotal = quotation?.totalCents || (subtotal - discountTotal);
  const isConfirmed = quotation?.status === 'Confirmed';
  const isPending = quotation?.status === 'PendingApproval';
  const isApproved = quotation?.status === 'Approved';
  const isFallback = quotation?.status === 'FallbackReverted' || (isApproved && quotation?.lastApprovedSnapshot);

  // Projected counter net total calculation
  const projectedDiscountAmount = (subtotal * counterDiscount) / 100;
  const projectedNetTotal = subtotal - projectedDiscountAmount;

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Portal Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--primary-subtle, #e0f2fe)',
                color: 'var(--primary, #0284c7)',
              }}
            >
              Enterprise Digital Sales Room
            </span>
            {isConnected && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success, #059669)', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success, #059669)' }} />
                <span>Live Negotiation Active</span>
              </span>
            )}
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
            Commercial Proposal {quotation.quoteNumber || quotation.id}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Building size={14} />
              <strong>{customer?.name || 'Acme Industrial'}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={14} />
              <span>Prepared by: Jordan Bell (Account Executive)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={14} />
              <span>Expires: {quotation.expiresAt ? new Date(quotation.expiresAt).toLocaleDateString() : '30 Days'}</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {availableQuotes.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Proposal:</span>
              <select
                className="form-control"
                style={{ fontSize: '12px', padding: '4px 8px', height: '32px', minWidth: '160px', backgroundColor: 'var(--bg-card, #fff)' }}
                value={activeQuoteId || ''}
                onChange={(e) => setSelectedQuoteId(e.target.value)}
              >
                {availableQuotes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quoteNumber || q.id} ({q.customerName || 'Customer'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {onBack && (
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              Exit Portal
            </button>
          )}

          {isConfirmed ? (
            <span className="badge badge-confirmed" style={{ fontSize: '13px', padding: '6px 14px' }}>
              <ShieldCheck size={16} style={{ marginRight: '6px' }} />
              <span>Binding Contract Confirmed</span>
            </span>
          ) : isPending ? (
            <span className="badge badge-pending" style={{ fontSize: '13px', padding: '6px 14px' }}>
              <Clock size={16} style={{ marginRight: '6px' }} />
              <span>Reviewing Counter-Offer</span>
            </span>
          ) : isApproved || isFallback ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowSignModal(true)}
              style={{
                backgroundColor: 'var(--success, #059669)',
                borderColor: 'var(--success, #059669)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
              }}
            >
              <CheckCircle2 size={17} />
              <span>Confirm Terms & Digitally Sign</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Notifications */}
      {counterSuccessMessage && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#059669" />
          <span>{counterSuccessMessage}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle size={16} color="#dc2626" />
          <span>{error}</span>
        </div>
      )}

      {/* Graceful Fallback Reversion Banner */}
      <FallbackBanner
        quotation={quotation}
        onAcceptFallback={() => setShowSignModal(true)}
        isCustomer={true}
      />

      {/* Confirmed Order State Banner */}
      {isConfirmed && (
        <div
          style={{
            marginBottom: '20px',
            padding: '18px 22px',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderLeft: '5px solid #16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#15803d', marginBottom: '2px' }}>
                Legal Sales Order Binding & Confirmed (SO-{quotation.id})
              </div>
              <div style={{ fontSize: '12.5px', color: '#166534' }}>
                Signed by <strong>{quotation.confirmedBy || signatureName}</strong> on{' '}
                {new Date(quotation.confirmedAt || Date.now()).toLocaleString()}. Stock has been reserved across regional fulfillment hubs.
              </div>
            </div>
          </div>
          <span className="badge badge-confirmed" style={{ fontSize: '12.5px', padding: '6px 14px' }}>
            Active Order
          </span>
        </div>
      )}

      {/* Shipment Delivery & Logistics Tracking Timeline (Phase 8 Multi-Warehouse Split) */}
      {(isConfirmed || shipments.length > 0) && (
        <div
          className="card"
          style={{
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="card-header" style={{ paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="var(--primary)" />
              <span className="card-title" style={{ fontSize: '14.5px', fontWeight: 700 }}>
                Regional Depots Delivery & Logistics Tracking
              </span>
            </div>
            <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
              {shipments.length} Fulfillment Package{shipments.length !== 1 ? 's' : ''}
            </span>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Your order is being fulfilled across continental regional fulfillment depots to expedite transit delivery times.
          </p>

          {shipments.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Fulfillment allocation scheduled. Split shipments will appear here with carrier tracking numbers once processed.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {shipments.map((s) => {
                const isShipped = s.status === 'Shipped' || s.status === 'Delivered';
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: isShipped ? '4px solid var(--success)' : '4px solid var(--warning)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700 }}>
                        <MapPin size={14} color="var(--primary)" />
                        <span>{s.warehouseName || s.warehouseCode || 'Regional Depot'}</span>
                      </div>
                      <span
                        className={isShipped ? 'badge badge-approved' : 'badge badge-pending'}
                        style={{ fontSize: '10px', textTransform: 'uppercase' }}
                      >
                        {isShipped ? 'Dispatched / In Transit' : 'Packing in Depot'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Deliverables:{' '}
                      <strong style={{ color: 'var(--text-main)' }}>
                        {(s.items || []).map((it) => `${it.productName || it.productId} (x${it.quantity})`).join(', ') || `${s.totalUnits || 1} units`}
                      </strong>
                    </div>

                    <div style={{ fontSize: '11.5px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Carrier:</span>
                        <span style={{ fontWeight: 600 }}>{s.carrier || 'Continental Freight Express'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tracking Ref:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                          {s.trackingNumber || 'Pending Carrier Manifest'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {backorders.length > 0 && (
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                fontSize: '12px',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Package size={16} />
              <span>
                <strong>Factory Direct Notice:</strong> {backorders.reduce((sum, b) => sum + b.quantity, 0)} units scheduled for direct manufacturer fulfillment within 5-7 business days.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Proposal Details & Commercial Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Proposal Line Items Matrix (Cloaked: No Margins/COGS) */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title">
                <FileText size={16} />
                <span>Proposal Line Items & Deliverables</span>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {lines.length} Line Item{lines.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '240px' }}>Item & Description</th>
                    <th style={{ width: '110px' }}>Category</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Qty</th>
                    <th style={{ width: '110px', textAlign: 'right' }}>List Unit</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Discount</th>
                    <th style={{ width: '110px', textAlign: 'right' }}>Net Unit</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.slice((linesPage - 1) * linesPageSize, linesPage * linesPageSize).map((line, idx) => (
                    <tr key={line.id || idx}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '13.5px', marginBottom: '3px' }}>
                          {line.productName || line.description || line.name || line.productId}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '3px', fontWeight: 500 }}>
                            SKU: {line.sku || line.productId}
                          </span>
                          {line.variantId && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              • Variant: {line.variantId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            backgroundColor:
                              (line.category || '').toLowerCase().includes('hardware')
                                ? '#eff6ff'
                                : (line.category || '').toLowerCase().includes('service')
                                  ? '#fdf4ff'
                                  : '#f0fdf4',
                            color:
                              (line.category || '').toLowerCase().includes('hardware')
                                ? '#1d4ed8'
                                : (line.category || '').toLowerCase().includes('service')
                                  ? '#a21caf'
                                  : '#15803d',
                          }}
                        >
                          {line.category || 'Hardware'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {Number(line.quantity || 1).toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>units</span>
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatCurrency(line.listPriceCents)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-discount">
                          -{line.discountPercentage || quotation?.discountPercentage || 0}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontSize: '13px', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                        {formatCurrency(line.netPriceCents || line.listPriceCents)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '13.5px', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {formatCurrency(line.lineTotalCents || (line.netPriceCents || line.listPriceCents) * line.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lines.length > 5 && (
              <Pagination
                currentPage={linesPage}
                totalItems={lines.length}
                pageSize={linesPageSize}
                pageSizeOptions={[5, 10, 20]}
                onPageChange={setLinesPage}
                onPageSizeChange={(newSize) => {
                  setLinesPageSize(newSize);
                  setLinesPage(1);
                }}
              />
            )}
          </div>


        </div>

        {/* Right Column: Financial Ledger & Interactive Counter-Offer Tray */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Financial Summary Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <span className="card-title">
                <DollarSign size={16} />
                <span>Commercial Pricing Summary</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Catalog Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingDown size={14} color="var(--success, #059669)" />
                  <span>Authorized Savings</span>
                </span>
                <span style={{ fontWeight: 700, color: 'var(--success, #059669)' }}>
                  -{formatCurrency(discountTotal)} ({quotation.discountPercentage || 0}%)
                </span>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                <span style={{ fontWeight: 700 }}>Contract Net Total</span>
                <span style={{ fontWeight: 800, color: 'var(--primary, #0284c7)' }}>{formatCurrency(netTotal)}</span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                Applicable taxes and freight calculated at checkout
              </div>
            </div>

            {/* Quick Action Button */}
            {(isApproved || isFallback) && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowSignModal(true)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--success, #059669)',
                    borderColor: 'var(--success, #059669)',
                    fontWeight: 700,
                    padding: '10px',
                    fontSize: '14px',
                  }}
                >
                  <CheckCircle2 size={17} style={{ marginRight: '6px' }} />
                  <span>Accept & Digitally Sign ({formatCurrency(netTotal)})</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Counter-Offer Proposal Tray */}
          {!isConfirmed && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <span className="card-title">
                  <RotateCcw size={16} />
                  <span>Propose Commercial Counter-Offer</span>
                </span>
              </div>

              <form onSubmit={handleSubmitCounterOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>Proposed Discount:</span>
                    <strong style={{ color: 'var(--primary, #0284c7)', fontSize: '15px' }}>{counterDiscount}%</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={counterDiscount}
                    onChange={(e) => setCounterDiscount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary, #0284c7)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>5% Standard</span>
                    <span>15% Gold Tier</span>
                    <span>30% Max Discretion</span>
                  </div>
                </div>

                {/* Live Projected Savings Comparison */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-canvas, #f8fafc)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Projected Target Total:</span>
                    <strong style={{ color: 'var(--primary, #0284c7)' }}>{formatCurrency(projectedNetTotal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Additional Customer Savings:</span>
                    <span style={{ fontWeight: 600, color: 'var(--success, #059669)' }}>
                      +{formatCurrency(Math.max(0, projectedDiscountAmount - discountTotal))}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Commercial Justification / Budget Notes:
                  </label>
                  <textarea
                    rows={3}
                    className="input"
                    placeholder="e.g. Requesting 18% discount due to competitive bid from Dell, or seeking volume concession for FY26 hardware rollout..."
                    value={counterNotes}
                    onChange={(e) => setCounterNotes(e.target.value)}
                    style={{ width: '100%', resize: 'vertical', fontSize: '12.5px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={submittingCounter || counterDiscount === quotation.discountPercentage}
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  {submittingCounter ? (
                    'Submitting Counter-Offer...'
                  ) : (
                    <>
                      <Send size={14} style={{ marginRight: '6px' }} />
                      <span>Submit Formal Counter-Offer ({counterDiscount}%)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Digital Signature Modal */}
      {showSignModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            className="card"
            style={{
              width: '460px',
              maxWidth: '92%',
              padding: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Digital Contract Signature</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Proposal {quotation.quoteNumber || quotation.id}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              By signing below, you authorize the purchase of items specified in proposal{' '}
              <strong>{quotation.quoteNumber || quotation.id}</strong> for a binding contract net total of{' '}
              <strong>{formatCurrency(netTotal)}</strong>.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                Authorized Representative Signature Name:
              </label>
              <input
                type="text"
                className="input"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSignModal(false)}
                disabled={confirming}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleConfirmTerms}
                disabled={confirming || !signatureName.trim()}
                style={{ backgroundColor: '#059669', borderColor: '#059669', fontWeight: 700 }}
              >
                {confirming ? 'Executing Contract...' : 'Sign & Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
