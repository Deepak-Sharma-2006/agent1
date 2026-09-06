import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  User,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Lock,
  CheckCircle2,
  DollarSign,
  Clock,
  ChevronRight,
  RefreshCw,
  Award,
  Zap,
  Sliders,
  Check,
  X,
  Tag,
} from 'lucide-react';

export function NegotiationChat({ initialQuoteId }) {
  const { currentUser, isCustomer, isSalesRep, isManager, isFinance, isAdmin } = useAuth();
  const { sendAction, lastEvent } = useWebSocket();

  const [quotes, setQuotes] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState(initialQuoteId || '');
  const [customer, setCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [proposedDiscount, setProposedDiscount] = useState('');
  const [activeChannel, setActiveChannel] = useState('customer'); // 'customer' | 'internal'
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusNotification, setStatusNotification] = useState(null);

  // Escalation Modal / Drawer State
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationTarget, setEscalationTarget] = useState('SalesManager');
  const [escalationReason, setEscalationReason] = useState('');
  const [escalationDiscountPct, setEscalationDiscountPct] = useState('');

  const messagesEndRef = useRef(null);

  const canViewInternalNotes = !isCustomer();

  // 1. Fetch quotations list with role boundary
  const fetchQuotes = () => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.quotations) {
          const rawQuotes = data.quotations || [];
          setQuotes(rawQuotes);
          const allowed = rawQuotes.filter(
            (q) => !isCustomer() || q.customerId === currentUser.customerId
          );
          if (!selectedQuoteId && allowed.length > 0) {
            setSelectedQuoteId(allowed[0].id);
          } else if (selectedQuoteId && !allowed.some((q) => q.id === selectedQuoteId)) {
            setSelectedQuoteId(allowed.length > 0 ? allowed[0].id : '');
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentUser.id]);

  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

  // 2. Fetch customer intelligence profile when quote changes
  const fetchCustomerProfile = (customerId) => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.customer) {
          setCustomer(data.customer);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (selectedQuote?.customerId) {
      fetchCustomerProfile(selectedQuote.customerId);
    }
  }, [selectedQuote?.customerId]);

  // 3. Fetch negotiation message history
  const fetchMessages = () => {
    if (!selectedQuoteId) return;
    setLoading(true);
    const roleParam = isCustomer() ? 'Customer' : currentUser.role;
    fetch(`/api/quotes/${selectedQuoteId}/messages?role=${encodeURIComponent(roleParam)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    sendAction('subscribe', { topic: `quotation:${selectedQuoteId}` });
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedQuoteId]);

  // 4. WebSocket event handling
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.event === 'CHAT_MESSAGE' && lastEvent.data?.quoteId === selectedQuoteId) {
      const msg = lastEvent.data;
      if (isCustomer() && msg.isInternal) {
        return; // Tenant isolation
      }
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    }

    if (lastEvent.event === 'CUSTOMER_TIER_UPDATED' || lastEvent.event === 'CUSTOMER_TIER_DEGRADED') {
      if (customer && lastEvent.data?.customerId === customer.id) {
        fetchCustomerProfile(customer.id);
        fetchQuotes();
      }
    }

    if (lastEvent.event === 'APPROVAL_REQUIRED' || lastEvent.event === 'QUOTE_UPDATED') {
      if (lastEvent.data?.quoteId === selectedQuoteId) {
        fetchQuotes();
      }
    }
  }, [lastEvent, selectedQuoteId, customer?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. Send message handler
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedQuoteId) return;

    const isInternal = canViewInternalNotes && activeChannel === 'internal';
    const discPct = proposedDiscount !== '' ? parseFloat(proposedDiscount) : null;

    const payload = {
      quoteId: selectedQuoteId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      senderName: currentUser.name,
      message: inputMessage.trim(),
      proposedDiscountPercent: discPct,
      isInternal,
      messageType: discPct !== null ? 'concession' : isInternal ? 'internal_note' : 'chat',
    };

    // Send over WebSocket
    sendAction('chat', payload);

    // Also persist via REST for guaranteed delivery
    fetch(`/api/quotes/${selectedQuoteId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.message) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
      })
      .catch(() => {});

    setInputMessage('');
    setProposedDiscount('');
  };

  // 6. Action: Escalate Deal to Manager or Finance
  const handleEscalateDeal = () => {
    if (!selectedQuoteId) return;
    setActionLoading(true);

    fetch(`/api/quotes/${selectedQuoteId}/escalate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
      },
      body: JSON.stringify({
        targetRole: escalationTarget,
        reason: escalationReason || `Escalation requested by ${currentUser.name} (${currentUser.role}).`,
        requestedDiscountPct: escalationDiscountPct ? parseFloat(escalationDiscountPct) : undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatusNotification(`Deal successfully escalated to ${escalationTarget}.`);
          setShowEscalationModal(false);
          setEscalationReason('');
          setEscalationDiscountPct('');
          fetchQuotes();
          fetchMessages();
        } else {
          alert(`Escalation failed: ${data.error}`);
        }
      })
      .catch((err) => alert(`Escalation error: ${err.message}`))
      .finally(() => setActionLoading(false));
  };

  // 7. Action: Trigger Automated Tier Evaluation & Apply Promotion
  const handleApplyTierUpgrade = () => {
    if (!customer?.id) return;
    setActionLoading(true);

    fetch(`/api/customers/${customer.id}/evaluate-tier?apply=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatusNotification(`Tier evaluated: ${data.tierEvaluation?.reason || 'Updated'}`);
          fetchCustomerProfile(customer.id);
          fetchQuotes();
        }
      })
      .catch(() => {})
      .finally(() => setActionLoading(false));
  };

  // 8. Action: Trigger Batch Governance Delinquency & Spend Audit
  const handleRunGovernanceAudit = () => {
    setActionLoading(true);
    fetch('/api/governance/tier-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatusNotification(
            `Governance Audit: ${data.totalAudited} audited (${data.upgradedCount} upgraded, ${data.degradedCount} degraded).`
          );
          if (customer?.id) fetchCustomerProfile(customer.id);
          fetchQuotes();
        }
      })
      .catch(() => {})
      .finally(() => setActionLoading(false));
  };

  // Tier helpers & metrics
  const currentTier = customer?.tier || selectedQuote?.customerTier || 'Bronze';
  const isDelinquent = (customer?.maxOverdueDays || 0) > 45 || (customer?.overdueDays || 0) > 45;
  const isDormant = (customer?.daysSinceLastOrder || 0) > 60;

  // Tier spend horizons (cents)
  const spend365Cents = customer?.trailing365DaySpendCents || customer?.trailing365dSpendCents || 0;
  const spend180Cents = customer?.trailing180DaySpendCents || customer?.trailing180dSpendCents || 0;
  const spend90Cents = customer?.trailing90DaySpendCents || customer?.trailing90dSpendCents || 0;

  // Next tier progress calculation
  let nextTierName = 'Silver';
  let nextTierTargetCents = 2500000; // $25k
  let currentProgressCents = spend90Cents;

  if (currentTier === 'Silver') {
    nextTierName = 'Gold';
    nextTierTargetCents = 10000000; // $100k
    currentProgressCents = spend180Cents;
  } else if (currentTier === 'Gold') {
    nextTierName = 'Platinum';
    nextTierTargetCents = 35000000; // $350k
    currentProgressCents = spend365Cents;
  } else if (currentTier === 'Platinum') {
    nextTierName = 'Platinum (Sustained)';
    nextTierTargetCents = 35000000;
    currentProgressCents = spend365Cents;
  }

  const progressPercent = Math.min(100, Math.round((currentProgressCents / nextTierTargetCents) * 100));

  // Determine Assigned Desk
  let assignedDesk = {
    title: 'Sales Representative Desk',
    subtitle: 'Sarah Jenkins (Lead Commercial Rep)',
    badge: 'Standard Flow • Rep Authority: 5% (Bronze) / 8% (Silver)',
    themeColor: 'var(--primary)',
    deskLevel: 1,
  };

  if (isDelinquent) {
    assignedDesk = {
      title: 'Credit Recovery & Prepayment Desk',
      subtitle: 'Net 0 Collections & Remediation Team',
      badge: '⚠️ Critical Delinquency (>45d) • Executive Access Suspended',
      themeColor: 'var(--danger)',
      deskLevel: 0,
    };
  } else if (currentTier === 'Platinum') {
    assignedDesk = {
      title: 'Sales Leadership & Finance Joint Desk',
      subtitle: 'Executive VP & Financial Controller',
      badge: 'VIP Enterprise Strategic Desk • Direct Authority: 20% • Net 45',
      themeColor: '#7c3aed',
      deskLevel: 3,
    };
  } else if (currentTier === 'Gold') {
    assignedDesk = {
      title: 'Sales Manager Executive Lead',
      subtitle: 'Marcus Vance (Regional Director)',
      badge: 'Executive Fast-Track • Direct Authority: 14% • Net 30',
      themeColor: 'var(--warning)',
      deskLevel: 2,
    };
  }

  const displayedQuotes = quotes.filter(
    (q) => !isCustomer() || q.customerId === currentUser.customerId
  );

  return (
    <div style={{ paddingBottom: '30px' }}>
      {/* Top Header & Deal Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <MessageSquare size={22} color="var(--primary)" />
            Commercial Deal Room & Negotiation Desk
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-party commercial negotiation feed governed by automated tier progression and delinquency brakes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canViewInternalNotes && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRunGovernanceAudit}
              disabled={actionLoading}
              title="Audit all customer accounts against spend velocity and delinquency rules"
              style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={13} className={actionLoading ? 'spin' : ''} />
              <span>Run Governance Audit</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Deal:
            </span>
            <select
              className="form-control"
              value={selectedQuoteId}
              onChange={(e) => setSelectedQuoteId(e.target.value)}
              style={{ width: '240px', padding: '6px 10px', fontSize: '13px' }}
            >
              {displayedQuotes.length === 0 ? (
                <option value="">No Active Deals</option>
              ) : (
                displayedQuotes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quoteNumber || q.id} ({q.status}) - ${((q.netTotalCents || 0) / 100).toLocaleString()}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Global Status Notification */}
      {statusNotification && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-dark)',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '12.5px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{statusNotification}</span>
          <button
            onClick={() => setStatusNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 3-Panel Deal Room Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '290px 1fr 310px',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* ================================================================= */}
        {/* LEFT PANEL: Counterparty Intelligence & Tier Velocity              */}
        {/* ================================================================= */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Counterparty Account
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              {customer?.name || selectedQuote?.customerName || 'Customer Account'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {customer?.email || selectedQuote?.customerId || 'N/A'}
            </div>
          </div>

          {/* Tier Badge & Terms Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor:
                  currentTier === 'Platinum'
                    ? '#7c3aed'
                    : currentTier === 'Gold'
                    ? '#d97706'
                    : currentTier === 'Silver'
                    ? '#64748b'
                    : '#92400e',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Award size={13} />
              {currentTier} Partner
            </span>

            <span
              className="badge"
              style={{
                fontSize: '11px',
                backgroundColor: isDelinquent ? 'var(--danger-light)' : 'var(--bg-subtle)',
                color: isDelinquent ? 'var(--danger)' : 'var(--text-main)',
                border: isDelinquent ? '1px solid var(--danger-border)' : '1px solid var(--border-subtle)',
                fontWeight: 600,
              }}
            >
              {isDelinquent ? 'Net 0 (Prepayment)' : customer?.paymentTerms || 'Net 30'}
            </span>
          </div>

          {/* Delinquency Alert Banner */}
          {isDelinquent && (
            <div
              style={{
                backgroundColor: 'var(--danger-light)',
                border: '1px solid var(--danger-border)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                color: 'var(--danger)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '2px' }}>
                <AlertTriangle size={14} />
                <span>Critical Delinquency Cliff</span>
              </div>
              <p style={{ fontSize: '11px', lineHeight: 1.4 }}>
                Unpaid invoice is {customer?.maxOverdueDays || 46} days overdue (&gt;45d limit). Demoted to Bronze; credit terms suspended.
              </p>
            </div>
          )}

          {/* Upgrade Candidate Banner */}
          {!isDelinquent && progressPercent >= 100 && currentTier !== 'Platinum' && (
            <div
              style={{
                backgroundColor: 'var(--success-light)',
                border: '1px solid var(--success-border)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                color: 'var(--success)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '2px' }}>
                <CheckCircle2 size={14} />
                <span>Promotion Milestone Met!</span>
              </div>
              <p style={{ fontSize: '11px', lineHeight: 1.4, marginBottom: '6px' }}>
                Account meets criteria for upgrade to {nextTierName}.
              </p>
              <button
                className="btn btn-sm"
                onClick={handleApplyTierUpgrade}
                disabled={actionLoading}
                style={{
                  backgroundColor: 'var(--success)',
                  color: '#ffffff',
                  fontSize: '11px',
                  padding: '4px 8px',
                  width: '100%',
                }}
              >
                Apply Promotion Now
              </button>
            </div>
          )}

          {/* Spend Velocity Progress Bar */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Tier Spend Velocity</span>
              <span style={{ color: 'var(--text-muted)' }}>
                ${(currentProgressCents / 100).toLocaleString()} / ${(nextTierTargetCents / 100).toLocaleString()}
              </span>
            </div>
            <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor:
                    progressPercent >= 100
                      ? 'var(--success)'
                      : currentTier === 'Gold'
                      ? '#7c3aed'
                      : 'var(--primary)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
              {progressPercent}% towards {nextTierName}
            </div>
          </div>

          {/* Trailing Spend Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--bg-canvas)', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>90-Day Spend</div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                ${(spend90Cents / 100).toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'var(--bg-canvas)', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>Annual Spend</div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                ${(spend365Cents / 100).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Credit & DSO Health */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '12px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Credit Hygiene & DSO
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Average DSO:</span>
              <span style={{ fontWeight: 600 }}>{customer?.averageDSO || customer?.dsoDays || 22} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Overdue Days:</span>
              <span style={{ fontWeight: 600, color: isDelinquent ? 'var(--danger)' : 'inherit' }}>
                {customer?.maxOverdueDays || 0} days
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recorded Defaults:</span>
              <span style={{ fontWeight: 600 }}>{customer?.defaultCount || 0}</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CENTER PANEL: Tier-Routed Negotiation Deal Room Feed              */}
        {/* ================================================================= */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            height: '640px',
            overflow: 'hidden',
          }}
        >
          {/* Dynamic Desk Header Banner */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: isDelinquent ? '#fef2f2' : '#f8fafc',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: assignedDesk.themeColor,
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                  {assignedDesk.title}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {assignedDesk.subtitle}</span>
              </div>
              <div style={{ fontSize: '11px', color: assignedDesk.themeColor, fontWeight: 600, marginTop: '2px' }}>
                {assignedDesk.badge}
              </div>
            </div>

            {/* In-feed Escalate Button for Reps */}
            {isSalesRep() && assignedDesk.deskLevel === 1 && !isDelinquent && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  setEscalationTarget('SalesManager');
                  setShowEscalationModal(true);
                }}
                style={{
                  fontSize: '11.5px',
                  backgroundColor: 'var(--warning-light)',
                  border: '1px solid var(--warning-border)',
                  color: 'var(--warning)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ArrowUpRight size={13} />
                <span>Escalate to Manager</span>
              </button>
            )}

            {isManager() && assignedDesk.deskLevel === 2 && !isDelinquent && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  setEscalationTarget('Finance');
                  setShowEscalationModal(true);
                }}
                style={{
                  fontSize: '11.5px',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  color: '#7c3aed',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ArrowUpRight size={13} />
                <span>Escalate to Finance</span>
              </button>
            )}
          </div>

          {/* Dual-Channel Switcher (Staff Only) */}
          {canViewInternalNotes && (
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-canvas)',
              }}
            >
              <button
                onClick={() => setActiveChannel('customer')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: activeChannel === 'customer' ? 700 : 500,
                  color: activeChannel === 'customer' ? 'var(--primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: activeChannel === 'customer' ? '2px solid var(--primary)' : 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <MessageSquare size={13} />
                <span>Customer Channel (Shared)</span>
              </button>

              <button
                onClick={() => setActiveChannel('internal')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: activeChannel === 'internal' ? 700 : 500,
                  color: activeChannel === 'internal' ? '#d97706' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: activeChannel === 'internal' ? '2px solid #d97706' : 'none',
                  background: activeChannel === 'internal' ? '#fffbeb' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Lock size={13} />
                <span>🔒 Internal Stakeholder Note (Masked)</span>
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#f8fafc',
            }}
          >
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading negotiation feed...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No negotiation records in this deal yet. Propose terms or start alignment below.
              </div>
            ) : (
              messages.map((m) => {
                const isInternalNote = Boolean(m.isInternal || m.is_internal);

                // Filter internal notes for customer
                if (isCustomer() && isInternalNote) return null;

                // Special System Announcement Card
                if (m.senderRole === 'System' || m.messageType === 'tier_announcement') {
                  const isDegradeWarning = m.message.includes('⚠️') || m.message.toLowerCase().includes('degraded');
                  return (
                    <div
                      key={m.id}
                      style={{
                        backgroundColor: isDegradeWarning ? '#fef2f2' : '#ecfdf5',
                        border: isDegradeWarning ? '1px solid #fecaca' : '1px solid #a7f3d0',
                        color: isDegradeWarning ? '#dc2626' : '#059669',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        margin: '6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {isDegradeWarning ? <AlertTriangle size={15} /> : <Award size={15} />}
                      <div style={{ flex: 1 }}>{m.message}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>
                        {new Date(m.createdAt || m.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                }

                // Special Escalation Notice Card
                if (m.messageType === 'escalation') {
                  return (
                    <div
                      key={m.id}
                      style={{
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        color: '#b45309',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        margin: '6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <ArrowUpRight size={15} />
                      <div style={{ flex: 1 }}>{m.message}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>
                        {new Date(m.createdAt || m.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                }

                // Standard Bubble Theme
                const isMe = m.senderId === currentUser.id;
                let bubbleBg = '#ffffff';
                let bubbleBorder = '1px solid var(--border-subtle)';
                let roleColor = 'var(--text-muted)';
                let borderSide = 'left';

                if (isInternalNote) {
                  bubbleBg = '#fffbeb';
                  bubbleBorder = '1px solid #fde68a';
                  roleColor = '#b45309';
                } else if (m.senderRole === 'Customer') {
                  bubbleBg = '#eff6ff';
                  bubbleBorder = '1px solid #bfdbfe';
                  roleColor = '#2563eb';
                  borderSide = 'right';
                } else if (m.senderRole === 'SalesManager') {
                  bubbleBg = '#ffffff';
                  bubbleBorder = '1px solid var(--border-subtle)';
                  roleColor = 'var(--warning)';
                } else if (m.senderRole === 'Finance') {
                  bubbleBg = '#f5f3ff';
                  bubbleBorder = '1px solid #ddd6fe';
                  roleColor = '#7c3aed';
                }

                return (
                  <div
                    key={m.id}
                    style={{
                      maxWidth: '82%',
                      alignSelf: m.senderRole === 'Customer' ? 'flex-end' : 'flex-start',
                      backgroundColor: bubbleBg,
                      border: bubbleBorder,
                      borderRadius: '8px',
                      padding: '10px 14px',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: roleColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isInternalNote && <Lock size={11} />}
                        <span>{m.senderName}</span>
                        <span style={{ fontWeight: 500, opacity: 0.8 }}>({m.senderRole})</span>
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>
                        {new Date(m.createdAt || m.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Proposed Concession Tag */}
                    {m.proposedDiscountPercent != null && (
                      <div
                        style={{
                          backgroundColor: 'rgba(2, 132, 199, 0.1)',
                          border: '1px solid var(--primary)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11.5px',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          margin: '2px 0',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Tag size={12} />
                        Proposed Discount: {m.proposedDiscountPercent}%
                      </div>
                    )}

                    <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {m.message || m.messageText}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: activeChannel === 'internal' ? '#fffbeb' : '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-control"
                placeholder={
                  activeChannel === 'internal'
                    ? `🔒 Internal stakeholder note as ${currentUser.name} (hidden from customer)...`
                    : `Commercial alignment message as ${currentUser.name} (${currentUser.role})...`
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ flex: 1, fontSize: '13px' }}
              />

              {/* Concession discount input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  min="0"
                  max="35"
                  step="0.5"
                  placeholder="Disc %"
                  className="form-control"
                  value={proposedDiscount}
                  onChange={(e) => setProposedDiscount(e.target.value)}
                  style={{ width: '80px', fontSize: '12px' }}
                  title="Optionally propose a discount percentage concession"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
                <Send size={14} />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* ================================================================= */}
        {/* RIGHT PANEL: Commercial Guardrails & Escalation Stepper           */}
        {/* ================================================================= */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Deal Financial Snapshot */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Deal Financial Guardrails
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
                ${((selectedQuote?.netTotalCents || 0) / 100).toLocaleString()}
              </span>
              <span className="badge" style={{ fontSize: '11px', fontWeight: 600 }}>
                {selectedQuote?.status || 'Draft'}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>List Price:</span>
              <span>${((selectedQuote?.subtotalCents || 0) / 100).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Applied Discount:</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                {selectedQuote?.discountPercentage || selectedQuote?.discountPct || 0}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gross Profit Margin:</span>
              <span
                style={{
                  fontWeight: 700,
                  color:
                    (selectedQuote?.grossMarginPct || 0) < 18.0
                      ? 'var(--danger)'
                      : (selectedQuote?.grossMarginPct || 0) < 25.0
                      ? 'var(--warning)'
                      : 'var(--success)',
                }}
              >
                {(selectedQuote?.grossMarginPct || 0).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Statutory 18.0% Margin Floor Gauge */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Statutory Margin Floor (18.0%)</span>
              <span style={{ color: 'var(--text-muted)' }}>{(selectedQuote?.grossMarginPct || 0).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  width: `${Math.min(100, ((selectedQuote?.grossMarginPct || 0) / 40) * 100)}%`,
                  height: '100%',
                  backgroundColor:
                    (selectedQuote?.grossMarginPct || 0) < 18.0
                      ? 'var(--danger)'
                      : (selectedQuote?.grossMarginPct || 0) < 25.0
                      ? 'var(--warning)'
                      : 'var(--success)',
                }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Floor: 18.0% (Hard Block) • Target: &ge;25.0%
            </div>
          </div>

          {/* 3-Stage Escalation Stepper */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px' }}>
              Escalation Desk Stepper
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
              {/* Level 1: Rep */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor:
                    selectedQuote?.escalationTier === 'SalesRep' || !selectedQuote?.escalationTier
                      ? 'var(--primary-light)'
                      : 'var(--bg-canvas)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>1. Sales Representative</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max 10% disc • $0 rebate</div>
                </div>
                {(selectedQuote?.escalationTier === 'SalesRep' || !selectedQuote?.escalationTier) && (
                  <span className="badge badge-approved" style={{ fontSize: '9.5px' }}>Active</span>
                )}
              </div>

              {/* Level 2: Manager */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor:
                    selectedQuote?.escalationTier === 'SalesManager'
                      ? 'var(--warning-light)'
                      : 'var(--bg-canvas)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>2. Sales Manager</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max 20% disc • $5,000 rebate</div>
                </div>
                {selectedQuote?.escalationTier === 'SalesManager' && (
                  <span className="badge badge-pending" style={{ fontSize: '9.5px' }}>In Review</span>
                )}
              </div>

              {/* Level 3: Finance */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor:
                    selectedQuote?.escalationTier === 'Finance'
                      ? '#f5f3ff'
                      : 'var(--bg-canvas)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>3. Finance Controller</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max 35% disc • Margin &ge;18%</div>
                </div>
                {selectedQuote?.escalationTier === 'Finance' && (
                  <span className="badge" style={{ fontSize: '9.5px', backgroundColor: '#7c3aed', color: '#ffffff' }}>Fiscal Sign-Off</span>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Action Buttons */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            {isSalesRep() && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEscalationTarget('SalesManager');
                  setShowEscalationModal(true);
                }}
                disabled={actionLoading}
                style={{ width: '100%', fontSize: '12px' }}
              >
                <ArrowUpRight size={14} />
                <span>Request Manager Concession</span>
              </button>
            )}

            {isManager() && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEscalationTarget('Finance');
                    setShowEscalationModal(true);
                  }}
                  disabled={actionLoading}
                  style={{ width: '100%', fontSize: '12px' }}
                >
                  <ArrowUpRight size={14} />
                  <span>Escalate to Finance Controller</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escalation Modal Dialog */}
      {showEscalationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              width: '440px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpRight size={18} color="var(--primary)" />
                Escalate Deal to {escalationTarget}
              </h3>
              <button
                onClick={() => setShowEscalationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Submit an exceptional concession request into the {escalationTarget} escalation queue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Target Escalation Desk
                </label>
                <select
                  className="form-control"
                  value={escalationTarget}
                  onChange={(e) => setEscalationTarget(e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="SalesManager">Sales Manager (Level 2)</option>
                  <option value="Finance">Finance Controller (Level 3 - Fiscal Apex)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Requested Discount % (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  step="0.5"
                  placeholder="e.g. 15.0"
                  className="form-control"
                  value={escalationDiscountPct}
                  onChange={(e) => setEscalationDiscountPct(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Commercial Justification Note
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe competitive pressure, client volume commitment, or margin tradeoffs..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  style={{ fontSize: '12px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEscalationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEscalateDeal}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Escalating...' : 'Submit Escalation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
