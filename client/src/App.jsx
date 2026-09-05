import React, { useState } from 'react';
import { AuthProvider, useAuth, ROLE_DEFAULT_VIEWS } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { OfflineProvider } from './context/OfflineContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ConflictResolutionModal } from './components/ConflictResolutionModal';
import { LoginScreen } from './pages/LoginScreen';
import { Dashboard } from './pages/Dashboard';
import { QuotationStudio } from './pages/QuotationStudio';
import { NegotiationChat } from './pages/NegotiationChat';
import { WarehouseView } from './pages/WarehouseView';
import { CatalogView } from './pages/CatalogView';
import { RuleMatrixBuilder } from './pages/RuleMatrixBuilder';
import { CustomerPortal } from './pages/CustomerPortal';
import { ApprovalsInbox } from './pages/ApprovalsInbox';

function MainLayout() {
  const { currentUser, isAuthenticated, canManageRules, canNegotiate, isCustomer, isWarehouse, canApprove } = useAuth();

  const [currentView, setCurrentView] = useState(() => {
    // Standalone portal deep link detection
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal')) {
      return 'portal';
    }
    // Role-specific default view
    return ROLE_DEFAULT_VIEWS[currentUser.role] || 'dashboard';
  });

  const [activeQuoteId, setActiveQuoteId] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal/')) {
      const pathParam = window.location.pathname.replace('/portal/', '').trim();
      return pathParam && pathParam !== 'portal' ? pathParam : null;
    }
    return null;
  });

  // Force set role-specific default view on fresh login
  const prevAuthRef = React.useRef(isAuthenticated);
  React.useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      // User just logged in — set their role-specific default view
      const isPortalRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/portal');
      if (!isPortalRoute) {
        setCurrentView(ROLE_DEFAULT_VIEWS[currentUser.role] || 'dashboard');
      }
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, currentUser.role]);

  // Reset view to role default when user changes (re-login with different role)
  React.useEffect(() => {
    const defaultView = ROLE_DEFAULT_VIEWS[currentUser.role] || 'dashboard';
    // Only reset if the current view is not allowed for this role
    if (currentView === 'portal' && !isCustomer() && !(typeof window !== 'undefined' && window.location.pathname.startsWith('/portal'))) {
      setCurrentView(defaultView);
    }
    if (currentView === 'quotes' && isCustomer()) {
      setCurrentView('portal');
    }
    if (currentView === 'rules' && !canManageRules()) setCurrentView(defaultView);
    if (currentView === 'warehouse' && isCustomer()) setCurrentView(defaultView);
    if (currentView === 'chat' && isWarehouse()) setCurrentView(defaultView);
    if (currentView === 'catalog' && (isWarehouse() || isCustomer())) setCurrentView(defaultView);
    if (currentView === 'approvals' && !canApprove()) setCurrentView(defaultView);
  }, [currentUser.role]);

  const handleOpenQuote = (id) => {
    setActiveQuoteId(id);
    if (isCustomer()) {
      setCurrentView('portal');
    } else {
      setCurrentView('quotes');
    }
  };

  const handleOpenPortal = (id) => {
    setActiveQuoteId(id);
    setCurrentView('portal');
  };

  const handleBackToDashboard = () => {
    setActiveQuoteId(null);
    setCurrentView(ROLE_DEFAULT_VIEWS[currentUser.role] || 'dashboard');
  };

  // Auth Gate: Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Standalone external portal link mode
  const isStandalonePortal =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/portal');

  if (isStandalonePortal) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas, #f8fafc)' }}>
        <Navbar />
        <main style={{ padding: '24px 0' }}>
          <CustomerPortal quoteId={activeQuoteId} onBack={handleBackToDashboard} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-main">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="app-content">
          {currentView === 'dashboard' && <Dashboard onOpenQuote={handleOpenQuote} />}
          {currentView === 'quotes' && (
            <QuotationStudio
              quoteId={activeQuoteId}
              onBack={handleBackToDashboard}
              onOpenPortal={handleOpenPortal}
            />
          )}
          {currentView === 'portal' && (
            <CustomerPortal quoteId={activeQuoteId} onBack={handleBackToDashboard} />
          )}
          {currentView === 'approvals' && <ApprovalsInbox onOpenQuote={handleOpenQuote} />}
          {currentView === 'rules' && <RuleMatrixBuilder />}
          {currentView === 'chat' && <NegotiationChat initialQuoteId={activeQuoteId} />}
          {currentView === 'catalog' && <CatalogView />}
          {currentView === 'warehouse' && <WarehouseView />}
        </main>
      </div>
      <ConflictResolutionModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <OfflineProvider>
          <MainLayout />
        </OfflineProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
