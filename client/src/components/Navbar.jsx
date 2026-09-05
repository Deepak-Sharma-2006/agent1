import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Layers, UserCheck } from 'lucide-react';

export function Navbar() {
  const { currentUser, setIsSwitchModalOpen } = useAuth();
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

        {/* Authenticated Persona Profile & Switcher */}
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
              backgroundColor: '#0284c7',
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
            onClick={() => setIsSwitchModalOpen(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '11.5px',
              padding: '4px 10px',
            }}
          >
            <UserCheck size={14} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>
    </header>
  );
}
