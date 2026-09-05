import React, { createContext, useContext, useState, useEffect } from 'react';

export const ENTERPRISE_USERS = {
  salesRep: {
    id: 'rep-01',
    name: 'Jordan Bell',
    email: 'jordan@dealflow360.com',
    role: 'SalesRep',
    title: 'Senior Enterprise AE',
    company: 'DealFlow360 Enterprise',
    avatar: 'JB',
    badgeColor: 'primary',
  },
  salesManager: {
    id: 'mgr-01',
    name: 'Elena Vance',
    email: 'elena@dealflow360.com',
    role: 'SalesManager',
    title: 'VP of Commercial Sales',
    company: 'DealFlow360 Enterprise',
    avatar: 'EV',
    badgeColor: 'warning',
  },
  finance: {
    id: 'fin-01',
    name: 'Marcus Sterling',
    email: 'marcus@dealflow360.com',
    role: 'Finance',
    title: 'Corporate Finance Controller',
    company: 'DealFlow360 Enterprise',
    avatar: 'MS',
    badgeColor: 'danger',
  },
  customer: {
    id: 'cust-acme-01',
    name: 'Sarah Jenkins',
    email: 'procurement@acmeind.com',
    role: 'Customer',
    title: 'Procurement Director',
    company: 'Acme Industrial Technologies Inc.',
    customerId: 'cust-acme-01',
    avatar: 'SJ',
    badgeColor: 'info',
  },
  warehouse: {
    id: 'wh-op-01',
    name: 'Alex Mercer',
    email: 'alex@chicagowh.com',
    role: 'Warehouse',
    title: 'Logistics Operations Lead',
    company: 'Chicago Central Hub',
    warehouseId: 'wh-chi-01',
    avatar: 'AM',
    badgeColor: 'success',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dealflow360_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return ENTERPRISE_USERS.salesRep;
  });

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dealflow360_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userKey) => {
    if (ENTERPRISE_USERS[userKey]) {
      setCurrentUser(ENTERPRISE_USERS[userKey]);
      setIsSwitchModalOpen(false);
    }
  };

  const canApprove = () => currentUser.role === 'SalesManager' || currentUser.role === 'Finance';
  const canViewInternalMargins = () => currentUser.role !== 'Customer';
  const isCustomer = () => currentUser.role === 'Customer';
  const isWarehouse = () => currentUser.role === 'Warehouse';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        isSwitchModalOpen,
        setIsSwitchModalOpen,
        canApprove,
        canViewInternalMargins,
        isCustomer,
        isWarehouse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
