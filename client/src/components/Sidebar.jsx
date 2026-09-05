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
} from 'lucide-react';

export function Sidebar({ currentView, setCurrentView }) {
  const { currentUser, canApprove, canManageRules, canNegotiate, isCustomer, isWarehouse } = useAuth();

  const navItems = [
    { id: 'dashboard', label: isWarehouse() ? 'Fulfillment Center' : 'Dashboard', icon: LayoutDashboard, visible: true },
    { id: 'quotes', label: isCustomer() ? 'My Proposals' : isWarehouse() ? 'Dispatch Orders' : 'Quotation Studio', icon: FileText, visible: true },
    { id: 'portal', label: 'Customer Portal', icon: ExternalLink, visible: !isWarehouse() },
    { id: 'rules', label: 'CPQ Rule Matrix', icon: Sliders, visible: canManageRules() },
    { id: 'chat', label: 'Negotiation Feed', icon: MessageSquare, visible: canNegotiate() },
    { id: 'catalog', label: 'Product Catalog', icon: Package, visible: !isWarehouse() },
    { id: 'warehouse', label: isWarehouse() ? 'Depot Inventory' : 'Warehouse Hubs', icon: Truck, visible: !isCustomer() },
    { id: 'approvals', label: 'Managerial Inbox', icon: ShieldCheck, visible: canApprove() },
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
      </div>
    </aside>
  );
}
