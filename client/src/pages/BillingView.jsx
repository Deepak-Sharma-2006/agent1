import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pagination } from '../components/Pagination';
import {
  CreditCard,
  FileCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Clock,
  Building,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Layers,
} from 'lucide-react';

export function BillingView() {
  const { currentUser, isCustomer } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Pagination states
  const [subPage, setSubPage] = useState(1);
  const [subPageSize, setSubPageSize] = useState(5);
  const [invPage, setInvPage] = useState(1);
  const [invPageSize, setInvPageSize] = useState(5);

  // Proration calculator state
  const [prorateStart, setProrateStart] = useState('2026-03-10');
  const [prorateEffective, setProrateEffective] = useState('2026-03-22');
  const [prorateEnd, setProrateEnd] = useState('2026-04-10');
  const [prorateMonthlyRate, setProrateMonthlyRate] = useState(2500);
  const [prorationResult, setProrationResult] = useState(null);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const [subsRes, invRes] = await Promise.all([
        fetch('/api/subscriptions'),
        fetch('/api/invoices'),
      ]);

      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscriptions(subsData.subscriptions || subsData.data || []);
      }
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || invData.data || []);
      }
    } catch (err) {
      console.error('Failed to load billing records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleCalculateProration = async () => {
    try {
      const res = await fetch('/api/subscriptions/prorate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStartDate: prorateStart,
          effectiveDate: prorateEffective,
          periodEndDate: prorateEnd,
          monthlyRateCents: Math.round(prorateMonthlyRate * 100),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProrationResult(data.proration || data.data);
      }
    } catch (err) {
      console.error('Proration calculation failed:', err);
    }
  };

  const handleRecordPayment = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'Corporate ACH Wire Transfer',
          transactionRef: `ACH-${Date.now().toString().slice(-8)}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentSuccess({
          invoiceId,
          transactionRef: data.payment?.transactionRef || `ACH-${Date.now()}`,
          amountPaidCents: data.payment?.amountPaidCents || 0,
        });
        fetchBillingData();
      }
    } catch (err) {
      console.error('Payment recording failed:', err);
    }
  };

  // Metrics
  const totalMRR = subscriptions.reduce((sum, s) => sum + (s.mrrCents || 0), 0) / 100;
  const totalARR = subscriptions.reduce((sum, s) => sum + (s.arrCents || 0), 0) / 100;
  const outstandingInvoices = invoices.filter((i) => i.status !== 'paid');
  const totalOutstanding =
    outstandingInvoices.reduce((sum, i) => sum + (i.balanceDueCents || i.amountCents || 0), 0) / 100;

  return (
    <div className="billing-view" style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Subscriptions & GAAP Invoicing Ledger
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
              }}
            >
              Mockup Screens 6, 14 & 15
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: '4px 0 0 0' }}>
            GAAP-compliant revenue recognition: Hardware invoiced upon regional dispatch, Subscriptions invoiced upon activation.
          </p>
        </div>
        <button
          onClick={fetchBillingData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh Records
        </button>
      </div>

      {/* Metric Cards (Screen 6 Overview) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Active Subscriptions
            </span>
            <Layers size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>{subscriptions.length}</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>SLA Gold & Enterprise Cloud</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Monthly Recurring (MRR)
            </span>
            <TrendingUp size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            ${totalMRR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Normalized recurring base</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Annual Recurring (ARR)
            </span>
            <DollarSign size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            ${totalARR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>Contracted annual value</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Outstanding Invoices
            </span>
            <CreditCard size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
            {outstandingInvoices.length} invoices awaiting payment
          </div>
        </div>
      </div>

      {/* Payment Success Toast (Screen 15) */}
      {paymentSuccess && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#065f46' }}>
                Payment Successfully Reconciled (Payment Receipt)
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Transaction Reference: <strong>{paymentSuccess.transactionRef}</strong> · Amount Paid:{' '}
                <strong>${(paymentSuccess.amountPaidCents / 100).toFixed(2)}</strong> · Balance Due: $0.00
              </div>
            </div>
          </div>
          <button
            onClick={() => setPaymentSuccess(null)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #6ee7b7',
              backgroundColor: '#ffffff',
              color: '#065f46',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Active Subscription Contracts (Wireframe Screen 6) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Active Subscription Contracts (SaaS & Recurring Billing)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
              Recurring SLAs and Enterprise Cloud subscriptions bound to confirmed sales orders.
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            Auto-Renewing Active
          </span>
        </div>

        {subscriptions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No active subscriptions found. Confirm a quotation containing Cloud Enterprise or SLA Gold to activate.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11.5px' }}>
                <th style={{ padding: '10px 12px' }}>CONTRACT ID</th>
                <th style={{ padding: '10px 12px' }}>CUSTOMER</th>
                <th style={{ padding: '10px 12px' }}>PRODUCT SKU</th>
                <th style={{ padding: '10px 12px' }}>BILLING CYCLE</th>
                <th style={{ padding: '10px 12px' }}>MONTHLY (MRR)</th>
                <th style={{ padding: '10px 12px' }}>ANNUAL (ARR)</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.slice((subPage - 1) * subPageSize, subPage * subPageSize).map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0284c7' }}>{sub.id}</td>
                  <td style={{ padding: '12px', color: '#0f172a' }}>{sub.customerId || 'Acme Industrial'}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>
                    <span style={{ fontWeight: 600 }}>{sub.productId}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                    {sub.billingFrequency || 'Monthly'}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                    ${((sub.mrrCents || 0) / 100).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#16a34a' }}>
                    ${((sub.arrCents || 0) / 100).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {sub.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {subscriptions.length > 0 && (
          <Pagination
            currentPage={subPage}
            totalItems={subscriptions.length}
            pageSize={subPageSize}
            pageSizeOptions={[5, 10, 25]}
            onPageChange={setSubPage}
            onPageSizeChange={(newSize) => {
              setSubPageSize(newSize);
              setSubPage(1);
            }}
          />
        )}
      </div>

      {/* Section 2: Interactive Daily Proration Engine (Phase 10 & Screen 6 Specification) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Mid-Cycle Daily Proration Calculator (Production Scenarios)
          </h2>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
            Calculates precise daily proration when customers upgrade, add seats, or activate mid-billing cycle.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr) auto',
            gap: '12px',
            alignItems: 'end',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Cycle Start Date
            </label>
            <input
              type="date"
              value={prorateStart}
              onChange={(e) => setProrateStart(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Mid-Cycle Effective Date
            </label>
            <input
              type="date"
              value={prorateEffective}
              onChange={(e) => setProrateEffective(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Cycle End Date
            </label>
            <input
              type="date"
              value={prorateEnd}
              onChange={(e) => setProrateEnd(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Monthly Rate ($)
            </label>
            <input
              type="number"
              value={prorateMonthlyRate}
              onChange={(e) => setProrateMonthlyRate(Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
            />
          </div>
          <button
            type="button"
            onClick={handleCalculateProration}
            style={{
              padding: '9px 18px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              height: '38px',
            }}
          >
            Calculate
          </button>
        </div>

        {prorationResult && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>DAYS REMAINING</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>
                  {prorationResult.daysRemaining} / {prorationResult.totalDaysInCycle} days
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>DAYS ELAPSED</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>
                  {prorationResult.daysElapsed} days
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>PRORATED CHARGE</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#14532d' }}>
                  ${((prorationResult.netAdjustmentCents ?? prorationResult.proratedChargeCents ?? 0) / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12.5px', color: '#166534', fontWeight: 600, maxWidth: '380px' }}>
              {prorationResult.summary || 'Mid-cycle proration calculated.'}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: GAAP Fulfillment Invoices (Wireframe Screen 14 & 15) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              GAAP Compliance Invoices (Invoicing & Payment Receipt)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
              Physical hardware lines invoiced upon regional depot dispatch; SaaS invoiced upon activation.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              GAAP Custody Rule Enforced
            </span>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No GAAP invoices generated yet. Confirm an order and trigger warehouse dispatch to generate custody invoices.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11.5px' }}>
                <th style={{ padding: '10px 12px' }}>INVOICE #</th>
                <th style={{ padding: '10px 12px' }}>QUOTE REF</th>
                <th style={{ padding: '10px 12px' }}>REVENUE TYPE</th>
                <th style={{ padding: '10px 12px' }}>INVOICED AMOUNT</th>
                <th style={{ padding: '10px 12px' }}>BALANCE DUE</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice((invPage - 1) * invPageSize, invPage * invPageSize).map((inv) => {
                const isPaid = inv.status === 'paid';
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{inv.id}</td>
                    <td style={{ padding: '12px', color: '#0284c7' }}>{inv.quoteId}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: inv.type === 'subscription' ? '#e0e7ff' : '#fef3c7',
                          color: inv.type === 'subscription' ? '#3730a3' : '#92400e',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {inv.type === 'subscription' ? 'SaaS Recurring' : 'Physical Dispatch'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                      ${((inv.amountCents || 0) / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: isPaid ? '#10b981' : '#b91c1c' }}>
                      ${((inv.balanceDueCents || (isPaid ? 0 : inv.amountCents) || 0) / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          backgroundColor: isPaid ? '#dcfce7' : '#fee2e2',
                          color: isPaid ? '#15803d' : '#991b1b',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {isPaid ? 'PAID / RECONCILED' : 'UNPAID'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {!isPaid ? (
                        <button
                          onClick={() => handleRecordPayment(inv.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CreditCard size={13} />
                          <span>Record Payment</span>
                        </button>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle size={14} /> Paid in Full
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {invoices.length > 0 && (
          <Pagination
            currentPage={invPage}
            totalItems={invoices.length}
            pageSize={invPageSize}
            pageSizeOptions={[5, 10, 25]}
            onPageChange={setInvPage}
            onPageSizeChange={(newSize) => {
              setInvPageSize(newSize);
              setInvPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
