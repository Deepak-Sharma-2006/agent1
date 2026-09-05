import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { AlertTriangle, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';

export function ConflictResolutionModal() {
  const { activeConflict, resolveConflict } = useOffline();

  if (!activeConflict) return null;

  const { mutation, serverState, clientState } = activeConflict;

  const quoteId = mutation?.entityId || serverState?.id || clientState?.id || 'Commercial Record';
  const clientVersion = clientState?.version ?? 'Local Draft';
  const serverVersion = serverState?.version ?? 'Server Revision';

  const clientTotal = clientState?.totalAmount !== undefined
    ? `$${Number(clientState.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'N/A';

  const serverTotal = serverState?.totalAmount !== undefined
    ? `$${Number(serverState.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'N/A';

  const clientItemsCount = Array.isArray(clientState?.items) ? clientState.items.length : '—';
  const serverItemsCount = Array.isArray(serverState?.items) ? serverState.items.length : '—';

  return (
    <div
      className="conflict-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        className="conflict-modal-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '680px',
          width: '100%',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fef3c7',
              color: '#d97706',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#92400e' }}>
              Optimistic Concurrency Conflict (HTTP 409)
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#b45309' }}>
              Record <strong>{quoteId}</strong> was updated on the server while you were offline.
            </p>
          </div>
        </div>

        {/* Modal Body: Comparison */}
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '13.5px', color: '#475569', marginTop: 0, marginBottom: '20px', lineHeight: 1.5 }}>
            An operational conflict occurred during background synchronization. Please choose whether to overwrite
            the server with your offline draft or discard your offline changes in favor of the current server state.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {/* Client State Card */}
            <div
              style={{
                border: '2px solid #e0e7ff',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f8faff',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#4338ca',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Your Offline Draft</span>
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <div><strong>Version Base:</strong> {String(clientVersion)}</div>
                <div><strong>Total Amount:</strong> {clientTotal}</div>
                <div><strong>Line Items:</strong> {clientItemsCount} items</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  Action: {mutation?.description || mutation?.method}
                </div>
              </div>
            </div>

            {/* Server State Card */}
            <div
              style={{
                border: '2px solid #f1f5f9',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#0f766e',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Active Server State</span>
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <div><strong>Current Version:</strong> {String(serverVersion)}</div>
                <div><strong>Total Amount:</strong> {serverTotal}</div>
                <div><strong>Line Items:</strong> {serverItemsCount} items</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  Status: {serverState?.status || 'Active on Server'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => resolveConflict('accept_server')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <Check size={16} />
              <span>Accept Server State (Discard Local)</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={() => resolveConflict('force_client')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#d97706',
                border: '1px solid #b45309',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <ArrowRight size={16} />
              <span>Keep My Offline Changes (Force Overwrite)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
