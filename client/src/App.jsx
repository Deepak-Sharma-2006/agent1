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

function MainLayout() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeQuoteId, setActiveQuoteId] = useState(null);

  const handleOpenQuote = (id) => {
    setActiveQuoteId(id);
    setCurrentView('quotes');
  };

  const handleBackToDashboard = () => {
    setActiveQuoteId(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-main">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="app-content">
          {currentView === 'dashboard' && <Dashboard onOpenQuote={handleOpenQuote} />}
          {currentView === 'quotes' && (
            <QuotationStudio quoteId={activeQuoteId} onBack={handleBackToDashboard} />
          )}
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
