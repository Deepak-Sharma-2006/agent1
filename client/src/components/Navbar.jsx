import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Layers, LogOut } from 'lucide-react';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const { status: wsStatus } = useWebSocket();

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
              backgroundColor: '#714B67',
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
