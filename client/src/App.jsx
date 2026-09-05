import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SwitchAccountModal } from './components/SwitchAccountModal';
import { Dashboard } from './pages/Dashboard';
import { QuotationStudio } from './pages/QuotationStudio';
import { NegotiationChat } from './pages/NegotiationChat';
import { WarehouseView } from './pages/WarehouseView';
import { CatalogView } from './pages/CatalogView';
import { RuleMatrixBuilder } from './pages/RuleMatrixBuilder';
import { CustomerPortal } from './pages/CustomerPortal';

function MainLayout() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal')) {
      return 'portal';
    }
    return 'dashboard';
  });
  const [activeQuoteId, setActiveQuoteId] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/portal/')) {
      const pathParam = window.location.pathname.replace('/portal/', '').trim();
      return pathParam && pathParam !== 'portal' ? pathParam : null;
    }
    return null;
  });
  const { canManageRules, canNegotiate, isCustomer, isWarehouse, canApprove } = useAuth();

  // Active view guardrails to strictly prevent unauthorized route access on role switch
  React.useEffect(() => {
    if (currentView === 'rules' && !canManageRules()) setCurrentView('dashboard');
    if (currentView === 'warehouse' && isCustomer()) setCurrentView('dashboard');
    if (currentView === 'chat' && isWarehouse()) setCurrentView('dashboard');
    if (currentView === 'catalog' && isWarehouse()) setCurrentView('dashboard');
    if (currentView === 'approvals' && !canApprove()) setCurrentView('dashboard');
  }, [currentView, canManageRules, isCustomer, isWarehouse, canApprove]);

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
    setCurrentView('dashboard');
  };

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
        <SwitchAccountModal />
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
          {currentView === 'rules' && <RuleMatrixBuilder />}
          {currentView === 'chat' && <NegotiationChat initialQuoteId={activeQuoteId} />}
          {currentView === 'catalog' && <CatalogView />}
          {currentView === 'warehouse' && <WarehouseView />}
          {currentView === 'approvals' && <Dashboard onOpenQuote={handleOpenQuote} />}
        </main>
      </div>
      <SwitchAccountModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <MainLayout />
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
