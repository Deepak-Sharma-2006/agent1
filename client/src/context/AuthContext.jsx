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

/** Default view per role after login */
export const ROLE_DEFAULT_VIEWS = {
  SalesRep: 'dashboard',
  SalesManager: 'dashboard',
  Finance: 'dashboard',
  Customer: 'portal',
  Warehouse: 'dashboard',
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

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dealflow360_authenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dealflow360_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dealflow360_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (userKey) => {
    if (ENTERPRISE_USERS[userKey]) {
      setCurrentUser(ENTERPRISE_USERS[userKey]);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dealflow360_user');
    localStorage.removeItem('dealflow360_authenticated');
    setCurrentUser(ENTERPRISE_USERS.salesRep);
  };

  const canApprove = () => currentUser.role === 'SalesManager' || currentUser.role === 'Finance';
  const canViewInternalMargins = () =>
    currentUser.role === 'SalesRep' ||
    currentUser.role === 'SalesManager' ||
    currentUser.role === 'Finance';
  const canManageRules = () => currentUser.role === 'SalesManager' || currentUser.role === 'Finance';
  const canCreateQuotes = () =>
    currentUser.role === 'SalesRep' ||
    currentUser.role === 'SalesManager' ||
    currentUser.role === 'Finance';
  const canNegotiate = () => currentUser.role !== 'Warehouse';
  const isCustomer = () => currentUser.role === 'Customer';
  const isWarehouse = () => currentUser.role === 'Warehouse';
  const isSalesRep = () => currentUser.role === 'SalesRep';
  const isSalesManager = () => currentUser.role === 'SalesManager';
  const isFinance = () => currentUser.role === 'Finance';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        canApprove,
        canViewInternalMargins,
        canManageRules,
        canCreateQuotes,
        canNegotiate,
        isCustomer,
        isWarehouse,
        isSalesRep,
        isSalesManager,
        isFinance,
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
