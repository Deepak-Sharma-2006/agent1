import React from 'react';
import { useAuth, ENTERPRISE_USERS } from '../context/AuthContext';
import { X, Check, ShieldCheck, Briefcase, DollarSign, Building2, Truck } from 'lucide-react';

export function SwitchAccountModal() {
  const { currentUser, switchUser, isSwitchModalOpen, setIsSwitchModalOpen } = useAuth();

  if (!isSwitchModalOpen) return null;

  const roleIcons = {
    SalesRep: Briefcase,
    SalesManager: ShieldCheck,
    Finance: DollarSign,
    Customer: Building2,
    Warehouse: Truck,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => setIsSwitchModalOpen(false)}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          marginBottom: 0,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-strong)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '18px' }}>
              Switch Enterprise Persona
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Select an authenticated enterprise role to audit permissions and role-based workflows.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsSwitchModalOpen(false)}
            style={{ padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(ENTERPRISE_USERS).map(([key, user]) => {
            const Icon = roleIcons[user.role] || Briefcase;
            const isSelected = currentUser.id === user.id;

            return (
              <div
                key={key}
                onClick={() => switchUser(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--primary)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                        {user.name}
                      </span>
                      <span className={`badge badge-${user.badgeColor === 'primary' ? 'draft' : user.badgeColor === 'warning' ? 'pending' : user.badgeColor === 'danger' ? 'rejected' : 'confirmed'}`}>
                        {user.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {user.title} • {user.company}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                    <Check size={16} /> Active
                  </div>
                ) : (
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setIsSwitchModalOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
