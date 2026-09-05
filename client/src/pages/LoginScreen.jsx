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
} from 'lucide-react';

const roleIcons = {
  SalesRep: Briefcase,
  SalesManager: ShieldCheck,
  Finance: DollarSign,
  Customer: Building2,
  Warehouse: Truck,
};

const roleBadgeColors = {
  SalesRep: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  SalesManager: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  Finance: { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  Customer: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
  Warehouse: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
};

const roleDescriptions = {
  SalesRep: 'Configure quotes, apply discounts, manage deals & track pipeline.',
  SalesManager: 'Approve deals, manage approval queue, audit rep discounts & risk.',
  Finance: 'Fiscal oversight, high-risk approvals, margin floor enforcement.',
  Customer: 'Review proposals, negotiate counter-offers, confirm purchase orders.',
  Warehouse: 'Fulfillment operations, inventory management, dispatch tracking.',
};

export function LoginScreen() {
  const { login } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '3px solid #714B67',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #714B67, #8B5E83)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(113, 75, 103, 0.4)',
        }}>
          <Layers size={20} color="#ffffff" />
        </div>
        <div>
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            DealFlow360
          </span>
          <span style={{
            marginLeft: '10px',
            fontSize: '10.5px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#714B67',
            backgroundColor: 'rgba(113, 75, 103, 0.15)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(113, 75, 103, 0.3)',
          }}>
            Enterprise CPQ
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '880px' }}>
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '6px 16px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <Lock size={13} color="#714B67" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Authenticated Access Required
              </span>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}>
              Sign In to DealFlow360
            </h1>
            <p style={{
              fontSize: '14.5px',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5,
            }}>
              Select your enterprise role to access the Autonomous Sales Operations Platform.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '14px',
          }}>
            {Object.entries(ENTERPRISE_USERS).map(([key, user]) => {
              const Icon = roleIcons[user.role] || Briefcase;
              const colors = roleBadgeColors[user.role];
              const isHovered = hoveredCard === key;

              return (
                <div
                  key={key}
                  onClick={() => login(key)}
                  onMouseEnter={() => setHoveredCard(key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: isHovered ? `2px solid ${colors.border}` : '2px solid #e2e8f0',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    boxShadow: isHovered
                      ? `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${colors.border}`
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={22} color={colors.text} />
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: colors.text,
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}>
                      {user.role}
                    </span>
                  </div>

                  {/* User Info */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '2px' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.3 }}>
                      {user.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '1px' }}>
                      {user.company}
                    </div>
                  </div>

                  {/* Role Description */}
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.5,
                    padding: '10px 12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                  }}>
                    {roleDescriptions[user.role]}
                  </div>

                  {/* Login Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isHovered ? '#714B67' : '#1e293b',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Sign in as {user.name.split(' ')[0]}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Demo Notice */}
          <div style={{
            textAlign: 'center',
            marginTop: '28px',
            padding: '12px 20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
            }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Demo mode — 5 enterprise personas available for role-based workflow exploration
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '14px 32px',
        textAlign: 'center',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}>
        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
          DealFlow360 Enterprise CPQ Platform · Odoo Hackathon 2026 · Autonomous Sales Operations
        </span>
      </footer>
    </div>
  );
}
