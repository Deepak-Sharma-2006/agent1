import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useOffline } from '../context/OfflineContext';
import { Layers, LogOut, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { status: wsStatus } = useWebSocket();
  const { isOnline, pendingCount, isSyncing, triggerSync } = useOffline();

  return (
    <header className="top-navbar">
      <div className="brand-section">
        <div className="brand-icon">
          <Layers size={18} />
        </div>
        <span>DealFlow360</span>
        <span className="brand-badge">Enterprise CPQ</span>
      </div>

      <div className="nav-actions">
        {/* Native PWA Connectivity & IndexedDB Sync Pill */}
        <div
          className="sync-status-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: isOnline
              ? pendingCount > 0
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(16, 185, 129, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              isOnline
                ? pendingCount > 0
                  ? 'rgba(245, 158, 11, 0.35)'
                  : 'rgba(16, 185, 129, 0.35)'
                : 'rgba(239, 68, 68, 0.35)'
            }`,
            color: isOnline
              ? pendingCount > 0
                ? '#f59e0b'
                : '#10b981'
              : '#ef4444',
          }}
          title={
            isOnline
              ? pendingCount > 0
                ? `${pendingCount} offline action(s) pending sync`
                : 'All changes synchronized to server'
              : 'Working in offline mode. Changes saved locally in IndexedDB.'
          }
        >
          {isOnline ? (
            <Wifi size={13} style={{ strokeWidth: 2.5 }} />
          ) : (
            <WifiOff size={13} style={{ strokeWidth: 2.5 }} />
          )}

          <span>
            {isOnline
              ? isSyncing
                ? 'Syncing...'
                : pendingCount > 0
                ? `${pendingCount} queued`
                : 'Online'
              : `Offline (${pendingCount})`}
          </span>

          {pendingCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSync();
              }}
              disabled={isSyncing || !isOnline}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '2px 4px',
                cursor: isOnline && !isSyncing ? 'pointer' : 'default',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                opacity: isOnline && !isSyncing ? 1 : 0.5,
              }}
              title="Trigger manual synchronization"
            >
              <RefreshCw
                size={12}
                className={isSyncing ? 'spinning' : ''}
                style={{
                  animation: isSyncing ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
          )}
        </div>

        {/* Live WebSocket Connection Pill */}
        <div className="ws-status-pill" title={`WebSocket Gateway: /ws (${wsStatus})`}>
          <span className={`ws-pulse ${wsStatus}`} />
          <span>{wsStatus}</span>
        </div>

        {/* Authenticated Persona Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>
              {currentUser.name}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {currentUser.role} • {currentUser.company.split(' ')[0]}
            </span>
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {currentUser.avatar}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={logout}
            title="Sign out and return to login"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '11.5px',
              padding: '4px 10px',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
