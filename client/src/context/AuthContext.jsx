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
  admin: {
    id: 'admin-01',
    name: 'David Vance',
    email: 'admin@dealflow360.com',
    role: 'Admin',
    title: 'Chief Platform Architect & System Administrator',
    company: 'DealFlow360 Enterprise HQ',
    avatar: 'DV',
    badgeColor: 'purple',
  },
};

/** Default view per role after login */
export const ROLE_DEFAULT_VIEWS = {
  SalesRep: 'dashboard',
  SalesManager: 'dashboard',
  Finance: 'dashboard',
  Customer: 'portal',
  Warehouse: 'dashboard',
  Admin: 'admin-hub',
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

  const login = (identifier, password) => {
    if (!identifier) return { success: false, error: 'Please enter your enterprise email.' };

    // 1. Direct user key match (e.g. 'salesRep')
    if (ENTERPRISE_USERS[identifier]) {
      setCurrentUser(ENTERPRISE_USERS[identifier]);
      setIsAuthenticated(true);
      return { success: true, user: ENTERPRISE_USERS[identifier] };
    }

    // 2. Email or role name match (case-insensitive)
    const normalized = identifier.trim().toLowerCase();
    const foundEntry = Object.values(ENTERPRISE_USERS).find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.email.split('@')[0].toLowerCase() === normalized ||
        u.role.toLowerCase() === normalized
    );

    if (foundEntry) {
      setCurrentUser(foundEntry);
      setIsAuthenticated(true);
      return { success: true, user: foundEntry };
    }

    return {
      success: false,
      error: 'Unrecognized enterprise credentials. Please check your email or select a demo account.',
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dealflow360_user');
    localStorage.removeItem('dealflow360_authenticated');
    setCurrentUser(ENTERPRISE_USERS.salesRep);
  };

  const isAdmin = () => currentUser.role === 'Admin';
  const canApprove = () => currentUser.role === 'SalesManager' || currentUser.role === 'Finance' || currentUser.role === 'Admin';
  const canViewInternalMargins = () =>
    currentUser.role === 'SalesRep' ||
    currentUser.role === 'SalesManager' ||
    currentUser.role === 'Finance' ||
    currentUser.role === 'Admin';
  const canManageRules = () => currentUser.role === 'SalesManager' || currentUser.role === 'Finance' || currentUser.role === 'Admin';
  const canCreateQuotes = () =>
    currentUser.role === 'SalesRep' ||
    currentUser.role === 'SalesManager' ||
    currentUser.role === 'Finance' ||
    currentUser.role === 'Admin';
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
        isAdmin,
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
