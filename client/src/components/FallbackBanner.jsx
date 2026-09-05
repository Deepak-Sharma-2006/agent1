import React from 'react';
import { ShieldAlert, ArrowRight, RotateCcw, CheckCircle2, Info } from 'lucide-react';

/**
 * FallbackBanner - Visual Graceful Fallback Reversion Notification
 * 
 * Explains the "Last Approved Best Offer" reversion with transparent,
 * non-hostile messaging when Finance or Management rejects an aggressive counter-offer.
 * 
 * @param {Object} props
 * @param {Object} props.quotation - Active quotation object
 * @param {Function} [props.onAcceptFallback] - Callback to accept the restored terms
 * @param {boolean} [props.isCustomer=true] - Whether rendered in customer portal
 */
export function FallbackBanner({ quotation, onAcceptFallback, isCustomer = true }) {
  if (!quotation) return null;

  const isReverted =
    quotation.status === 'FallbackReverted' ||
    quotation.status === 'Approved' && quotation.lastApprovedSnapshot;

  if (!isReverted && quotation.status !== 'FallbackReverted') {
    return null;
  }

  const snapshot = quotation.lastApprovedSnapshot || {};
  const approvedDiscount = snapshot.discountPercentage ?? quotation.discountPercentage ?? 10;
  const approver = snapshot.approvedBy || 'Management & Finance';

  return (
    <div
      style={{
        margin: '16px 0',
        padding: '16px 20px',
        borderRadius: '8px',
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderLeft: '5px solid #d97706',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            marginTop: '2px',
          }}
        >
          <RotateCcw size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Graceful Fallback Reversion Activated</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                }}
              >
                Best and Final Offer (BAFO)
              </span>
            </span>
            <span style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 600 }}>
              Authorized by {approver}
            </span>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '1.5', color: '#78350f' }}>
            {isCustomer ? (
              <>
                Our Finance controller was unable to approve the requested counter-discount due to corporate margin floor requirements.
                However, your <strong>previously authorized {approvedDiscount}% discount</strong> remains <strong>fully valid and locked</strong> for immediate binding confirmation.
              </>
            ) : (
              <>
                Aggressive counter-discount was rejected to protect statutory 18.0% gross margin floors.
                Quotation has cleanly rolled back to the <strong>Last Approved Snapshot ({approvedDiscount}% discount)</strong>, preserving deal velocity.
              </>
            )}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #fef3c7',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
              <CheckCircle2 size={15} color="#059669" />
              <span>
                Guaranteed Pre-Approved Terms: <strong>{approvedDiscount}% Contract Discount</strong>
              </span>
            </div>

            {isCustomer && onAcceptFallback && quotation.status !== 'Confirmed' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={onAcceptFallback}
                style={{
                  backgroundColor: '#059669',
                  borderColor: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                }}
              >
                <span>Accept Last Approved Offer</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
