import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Send, MessageSquare, ShieldCheck, User } from 'lucide-react';

export function NegotiationChat({ initialQuoteId }) {
  const { currentUser, isCustomer } = useAuth();
  const { sendAction, lastEvent } = useWebSocket();

  const [quotes, setQuotes] = useState([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState(initialQuoteId || '');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch quotations list and apply tenant isolation
  useEffect(() => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.quotations) {
          const rawQuotes = data.quotations || [];
          setQuotes(rawQuotes);
          const allowed = rawQuotes.filter((q) =>
            !isCustomer() || q.customerId === currentUser.customerId
          );
          if (!selectedQuoteId && allowed.length > 0) {
            setSelectedQuoteId(allowed[0].id);
          } else if (selectedQuoteId && !allowed.some((q) => q.id === selectedQuoteId)) {
            setSelectedQuoteId(allowed.length > 0 ? allowed[0].id : '');
          }
        }
      })
      .catch(() => {});
  }, [currentUser.id]);

  // Fetch message history for selected quote
  useEffect(() => {
    if (!selectedQuoteId) return;

    setLoading(true);
    fetch(`/api/quotes/${selectedQuoteId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Subscribe to quote topic
    sendAction('subscribe', { topic: `quotation:${selectedQuoteId}` });
  }, [selectedQuoteId]);

  // Real-time chat messages via WebSocket
  useEffect(() => {
    if (lastEvent?.event === 'CHAT_MESSAGE' && lastEvent.data?.quoteId === selectedQuoteId) {
      setMessages((prev) => {
        // Avoid duplicate
        if (prev.some((m) => m.id === lastEvent.data.id)) return prev;
        return [...prev, lastEvent.data];
      });
    }
  }, [lastEvent, selectedQuoteId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedQuoteId) return;

    const payload = {
      quoteId: selectedQuoteId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      senderName: currentUser.name,
      message: inputMessage.trim(),
    };

    // Send over WebSocket gateway
    sendAction('chat', payload);

    // Optimistically add to local feed
    const optimisticMsg = {
      id: `opt-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputMessage('');
  };

  const displayedQuotes = quotes.filter((q) =>
    !isCustomer() || q.customerId === currentUser.customerId
  );
  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            Real-Time Commercial Negotiation Feed
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Multi-party commercial alignment channel with immutable SQLite audit logging.
          </p>
        </div>

        {/* Quote Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Active Deal:</span>
          <select
            className="form-control"
            value={selectedQuoteId}
            onChange={(e) => setSelectedQuoteId(e.target.value)}
            style={{ width: '220px', padding: '6px 10px', fontSize: '13px' }}
          >
            {displayedQuotes.length === 0 ? (
              <option value="">No Active Deals</option>
            ) : (
              displayedQuotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.quoteNumber || q.id} ({q.status})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={18} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                Thread: {selectedQuote?.quoteNumber || selectedQuoteId}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Status: {selectedQuote?.status || 'Draft'} • Parties: Sales, Management, Customer Procurement
              </div>
            </div>
          </div>

          <span className="badge badge-approved" style={{ fontSize: '10.5px' }}>
            RFC 6455 Real-Time Connected
          </span>
        </div>

        <div className="chat-messages">
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading negotiation history...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No commercial messages yet. Send an update or discount query below.
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              const roleClass = m.senderRole === 'Customer' ? 'customer' : m.senderRole === 'SalesManager' ? 'manager' : 'sales-rep';

              return (
                <div key={m.id} className={`chat-bubble ${roleClass}`}>
                  <div className="chat-bubble-sender">
                    {m.senderName} ({m.senderRole})
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {m.message}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-light)', alignSelf: 'flex-end' }}>
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            className="form-control"
            placeholder={`Type commercial alignment note as ${currentUser.name} (${currentUser.role})...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
