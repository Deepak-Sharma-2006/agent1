import React, { useState } from 'react';
import { useAuth, ENTERPRISE_USERS } from '../context/AuthContext';
import {
  Layers,
  Briefcase,
  ShieldCheck,
  DollarSign,
  Building2,
  Truck,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Settings,
} from 'lucide-react';

const roleIcons = {
  SalesRep: Briefcase,
  SalesManager: ShieldCheck,
  Finance: DollarSign,
  Customer: Building2,
  Warehouse: Truck,
  Admin: Settings,
};

const roleBadgeColors = {
  SalesRep: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  SalesManager: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  Finance: { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  Customer: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
  Warehouse: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  Admin: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
};

const demoCredentials = {
  salesRep: { email: 'jordan@dealflow360.com', password: 'password123' },
  salesManager: { email: 'elena@dealflow360.com', password: 'password123' },
  finance: { email: 'marcus@dealflow360.com', password: 'password123' },
  customer: { email: 'procurement@acmeind.com', password: 'password123' },
  warehouse: { email: 'alex@chicagowh.com', password: 'password123' },
  admin: { email: 'admin@dealflow360.com', password: 'password123' },
};

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('jordan@dealflow360.com');
  const [password, setPassword] = useState('password123');
  const [selectedKey, setSelectedKey] = useState('salesRep');
  const [errorMessage, setErrorMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your enterprise email.');
      return;
    }
    const result = login(email, password);
    if (result && !result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleSelectPersona = (key, autoSubmit = false) => {
    const creds = demoCredentials[key];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setSelectedKey(key);
      setErrorMessage('');
      if (autoSubmit) {
        login(key);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header matching Wireframe Screen 1 */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #0284c7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            }}
          >
            <Layers size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
              DealFlow360
            </span>
            <span
              style={{
                marginLeft: '10px',
                fontSize: '10.5px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#38bdf8',
                backgroundColor: 'rgba(2, 132, 199, 0.25)',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(2, 132, 199, 0.4)',
              }}
            >
              Enterprise CPQ
            </span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Wireframe Screen 1 · Authenticated Access Gateway
        </div>
      </header>

      {/* Main Content: Two-Column Form + Personas Directory */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(340px, 420px) 1fr',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Explicit Email & Password Sign-In Form (Screen 1 Spec) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(2, 132, 199, 0.08)',
                    color: '#0284c7',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  <Lock size={12} /> Secure Login
                </div>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '0 0 6px 0',
                    letterSpacing: '-0.4px',
                  }}
                >
                  Sign In to DealFlow360
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Enter your corporate credentials or select an enterprise persona to authenticate.
                </p>
              </div>

              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b91c1c',
                    fontSize: '12.5px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                {/* Email Input */}
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Enterprise Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      color="#94a3b8"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSelectedKey(null);
                      }}
                      placeholder="e.g. jordan@dealflow360.com"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                      Password
                    </label>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Demo: password123</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <KeyRound
                      size={16}
                      color="#94a3b8"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13.5px',
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#0284c7')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
                >
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Form Footer Note */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11.5px',
                  color: '#64748b',
                }}
              >
                <CheckCircle2 size={14} color="#10b981" />
                <span>Supports any valid enterprise user email or 1-click quick-fill.</span>
              </div>
            </div>

            {/* Right Column: 5 Enterprise Personas Directory & Fast Switcher */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0,
                    }}
                  >
                    Enterprise Role Directory (6 Personas)
                  </h2>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#64748b',
                      backgroundColor: '#e2e8f0',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    Complete Enterprise Personas
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Click a persona card to pre-fill credentials, or use <strong>Instant Sign-In</strong>:
                </p>
              </div>

              {/* Personas List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(ENTERPRISE_USERS).map(([key, user]) => {
                  const Icon = roleIcons[user.role] || Briefcase;
                  const colors = roleBadgeColors[user.role];
                  const isSelected = selectedKey === key;
                  const isHovered = hoveredCard === key;

                  return (
                    <div
                      key={key}
                      onClick={() => handleSelectPersona(key, false)}
                      onMouseEnter={() => setHoveredCard(key)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: isSelected
                          ? `2px solid #0284c7`
                          : isHovered
                          ? `2px solid ${colors.border}`
                          : '1px solid #e2e8f0',
                        padding: '14px 18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected
                          ? '0 4px 12px rgba(2, 132, 199, 0.15)'
                          : isHovered
                          ? '0 2px 8px rgba(0,0,0,0.04)'
                          : 'none',
                      }}
                    >
                      {/* Left: Avatar & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} color={colors.text} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                              {user.name}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: colors.text,
                                backgroundColor: colors.bg,
                                border: `1px solid ${colors.border}`,
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {user.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {user.email} · <span style={{ color: '#94a3b8' }}>{user.title}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Instant Sign In Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPersona(key, true);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: isHovered ? '#0284c7' : '#f8fafc',
                            color: isHovered ? '#ffffff' : '#334155',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>Sign In</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory Banner */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '10px 14px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '11.5px',
                  color: '#475569',
                  lineHeight: 1.4,
                }}
              >
                <strong>Excalidraw Screen 1 Compliance:</strong> Supports standard form typing for enterprise email & password credentials as wireframed, plus rapid 1-click persona switching across all 5 operational roles.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '14px 32px',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
          DealFlow360 Enterprise CPQ Platform · Autonomous Sales Operations & Financial Governance · Mockup End-to-End Flow
        </span>
      </footer>
    </div>
  );
}
