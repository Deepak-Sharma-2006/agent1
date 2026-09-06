import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Package,
  Truck,
  Sliders,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  Database,
  Settings,
  LogOut,
} from 'lucide-react';

export function Sidebar({ currentView, setCurrentView }) {
  const { currentUser, logout, canApprove, canManageRules, canNegotiate, isCustomer, isWarehouse, isAdmin } = useAuth();

  const isAnAdmin = Boolean(isAdmin && isAdmin());
  const isFinanceRole = Boolean(currentUser.role === 'Finance');

  const navItems = [
    { id: 'dashboard', label: isWarehouse() ? 'Fulfillment Center' : isCustomer() ? 'Orders & Proposals' : 'Dashboard', icon: LayoutDashboard, visible: !isAnAdmin },
    { id: 'admin-hub', label: 'Platform Administration', icon: Settings, visible: isAnAdmin },
    { id: 'quotes', label: isWarehouse() ? 'Dispatch Orders' : 'Quotation Studio', icon: FileText, visible: !isCustomer() && !isAnAdmin },
    { id: 'portal', label: 'Customer Portal', icon: ExternalLink, visible: isCustomer() },
    { id: 'approvals', label: 'Managerial Inbox', icon: ShieldCheck, visible: canApprove() && !isAnAdmin },
    { id: 'rules', label: 'CPQ Rule Matrix', icon: Sliders, visible: canManageRules() && !isAnAdmin },
    { id: 'chat', label: 'Negotiation Feed', icon: MessageSquare, visible: canNegotiate() && !isAnAdmin },
    { id: 'catalog', label: 'Product Catalog', icon: Package, visible: isCustomer() },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, visible: isFinanceRole },
    { id: 'warehouse', label: isWarehouse() ? 'Depot Inventory' : 'Warehouse Hubs', icon: Truck, visible: isWarehouse() },
    { id: 'database', label: 'Database Explorer', icon: Database, visible: isAnAdmin },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Navigation</div>
      <nav className="sidebar-nav">
        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <a
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
          Current Tenant
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
          {currentUser.company}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Mode: {currentUser.role}
        </div>
        <button
          onClick={logout}
          style={{
            marginTop: '10px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Return to Login / Landing Screen to switch roles"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e2e8f0';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <LogOut size={13} />
          <span>Switch Persona / Landing</span>
        </button>
      </div>
    </aside>
  );
}
