import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('disconnected'); // 'connected' | 'disconnected' | 'reconnecting'
  const [toasts, setToasts] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const connect = () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // In dev, Vite is on 5173 and proxies /ws, or we connect directly to localhost:3000
    const host = window.location.port === '5173' ? 'localhost:3000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    setStatus('reconnecting');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      // Send authentication frame
      ws.send(JSON.stringify({
        action: 'auth',
        token: currentUser.role,
        role: currentUser.role,
        userId: currentUser.id,
        customerId: currentUser.customerId || undefined,
      }));

      // Subscribe to relevant role feed
      if (currentUser.role === 'SalesManager' || currentUser.role === 'Finance') {
        ws.send(JSON.stringify({ action: 'subscribe', topic: 'role:manager' }));
      }
      if (currentUser.customerId) {
        ws.send(JSON.stringify({ action: 'subscribe', topic: `customer:${currentUser.customerId}` }));
      }
    };

    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        setLastEvent(payload);

        // Process notification toasts
        switch (payload.event) {
          case 'APPROVAL_REQUIRED':
            addToast('Approval Required', `Quotation ${payload.data?.quoteNumber || payload.data?.id} requires manager authorization`, 'warning');
            break;
          case 'APPROVAL_GRANTED':
            addToast('Approval Granted', `Quotation ${payload.data?.quoteNumber || payload.data?.id} was approved by ${payload.data?.approverRole || 'Manager'}`, 'success');
            break;
          case 'COUNTER_OFFER_RECEIVED':
            addToast('Counter-Offer', `Customer submitted counter-discount for ${payload.data?.quoteNumber || payload.data?.id}`, 'info');
            break;
          case 'FALLBACK_REVERTED':
            addToast('Graceful Fallback', `Quotation reverted to last approved best offer`, 'warning');
            break;
          case 'QUOTE_CONFIRMED':
            addToast('Deal Won', `Quotation confirmed into binding sales order!`, 'success');
            break;
          case 'CHAT_MESSAGE':
            if (payload.data?.senderId !== currentUser.id) {
              addToast(`Message from ${payload.data?.senderName}`, payload.data?.message, 'info');
            }
            break;
          default:
            break;
        }
      } catch {
        // Non-JSON frame
      }
    };

    ws.onerror = () => {
      setStatus('disconnected');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      wsRef.current = null;
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [currentUser.id]);

  const sendAction = (action, payload = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...payload }));
      return true;
    }
    return false;
  };

  return (
    <WebSocketContext.Provider
      value={{
        status,
        sendAction,
        lastEvent,
        addToast,
      }}
    >
      {children}

      {/* Real-Time Toast Alerts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div>
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
