import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pagination } from '../components/Pagination';
import {
  Package,
  ShieldCheck,
  Truck,
  CreditCard,
  BarChart3,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Layers,
  Search,
  ArrowUpRight,
  Sliders,
  RefreshCw,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Building,
  Check,
  X,
} from 'lucide-react';

export function AdminHub() {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Pagination states
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(10);
  const [warehousePage, setWarehousePage] = useState(1);
  const [warehousePageSize, setWarehousePageSize] = useState(10);
  const [analyticsPage, setAnalyticsPage] = useState(1);
  const [analyticsPageSize, setAnalyticsPageSize] = useState(10);

  // Tab 1: Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: 'Hardware',
    listPrice: '',
    costPrice: '',
    minMarginFloorPct: '15',
    unitDescription: 'Unit',
    isSubscription: false,
    billingFrequency: 'Monthly',
  });

  // Tab 3: Warehouses state
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [showAddWarehouseModal, setShowAddWarehouseModal] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    code: '',
    name: '',
    city: '',
    state: '',
    country: 'USA',
    safetyBuffer: '50',
    capacityUnits: '50000',
    isPrimaryHub: false,
  });

  // Tab 5: Analytics & Reporting state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterSalesRep, setFilterSalesRep] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Notification / Alert message
  const [actionMessage, setActionMessage] = useState(null);

  const showNotification = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Warehouses
  const fetchWarehouses = async () => {
    setLoadingWarehouses(true);
    try {
      const res = await fetch('/api/warehouses');
      const data = await res.json();
      if (data.warehouses) setWarehouses(data.warehouses);
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const params = new URLSearchParams();
      if (filterPeriod !== 'all') params.set('period', filterPeriod);
      if (filterSalesRep !== 'all') params.set('salesRepId', filterSalesRep);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterCategory !== 'all') params.set('category', filterCategory);

      const res = await fetch(`/api/reports/analytics?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [filterPeriod, filterSalesRep, filterStatus, filterCategory]);

  // Handle Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.listPrice || !newProduct.costPrice) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          listPriceCents: Math.round(parseFloat(newProduct.listPrice) * 100),
          costPriceCents: Math.round(parseFloat(newProduct.costPrice) * 100),
          minMarginFloorPct: parseFloat(newProduct.minMarginFloorPct) || 15,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Product "${data.product.name}" created successfully!`);
        setShowAddProductModal(false);
        setNewProduct({
          sku: '',
          name: '',
          category: 'Hardware',
          listPrice: '',
          costPrice: '',
          minMarginFloorPct: '15',
          unitDescription: 'Unit',
          isSubscription: false,
          billingFrequency: 'Monthly',
        });
        fetchProducts();
      } else {
        showNotification(data.error || 'Failed to create product.', 'error');
      }
    } catch (err) {
      showNotification('Error creating product: ' + err.message, 'error');
    }
  };

  // Handle Add Warehouse Submit
  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    if (!newWarehouse.code || !newWarehouse.name) {
      showNotification('Please fill in warehouse code and name.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newWarehouse,
          safetyBuffer: parseInt(newWarehouse.safetyBuffer, 10) || 50,
          capacityUnits: parseInt(newWarehouse.capacityUnits, 10) || 50000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Warehouse "${data.warehouse.name}" registered successfully!`);
        setShowAddWarehouseModal(false);
        setNewWarehouse({
          code: '',
          name: '',
          city: '',
          state: '',
          country: 'USA',
          safetyBuffer: '50',
          capacityUnits: '50000',
          isPrimaryHub: false,
        });
        fetchWarehouses();
      } else {
        showNotification(data.error || 'Failed to register warehouse.', 'error');
      }
    } catch (err) {
      showNotification('Error registering warehouse: ' + err.message, 'error');
    }
  };

  // CSV Export for Section A1 - Direct native browser download to local Downloads folder
  const handleExportCsv = () => {
    try {
      const params = new URLSearchParams();
      if (filterPeriod && filterPeriod !== 'all') params.set('period', filterPeriod);
      if (filterSalesRep && filterSalesRep !== 'all') params.set('salesRepId', filterSalesRep);
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus);
      if (filterCategory && filterCategory !== 'all') params.set('category', filterCategory);

      const downloadUrl = `/api/reports/export/csv?${params.toString()}`;
      const filename = `dealflow360_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;

      // Trigger native browser download directly via anchor with download attribute
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification('Executive Analytics CSV report downloaded to your local Downloads folder!');
    } catch (err) {
      console.warn('Native download failed, attempting blob fallback:', err);
      if (analyticsData && analyticsData.quotes && analyticsData.quotes.length > 0) {
        const headers = ['Quote ID', 'Quote Number', 'Customer ID', 'Sales Rep', 'Status', 'Net Total ($)', 'Gross Margin (%)', 'Items Count', 'Created At'];
        const rows = analyticsData.quotes.map((q) => [
          `"${q.id || ''}"`,
          `"${q.quoteNumber || 'N/A'}"`,
          `"${q.customerId || 'N/A'}"`,
          `"${q.salesRepName || 'N/A'}"`,
          `"${q.status || 'Draft'}"`,
          (q.netTotalCents / 100).toFixed(2),
          q.marginPercentage ? `${q.marginPercentage}%` : '0%',
          q.itemCount || 1,
          `"${q.createdAt || 'N/A'}"`,
        ]);
        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dealflow360_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotification('Executive Analytics CSV report downloaded to your local Downloads folder!');
      } else {
        showNotification('Failed to download CSV export: ' + err.message, 'error');
      }
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, productSearch]);

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productPageSize;
    return filteredProducts.slice(start, start + productPageSize);
  }, [filteredProducts, productPage, productPageSize]);

  const paginatedWarehouses = useMemo(() => {
    const start = (warehousePage - 1) * warehousePageSize;
    return warehouses.slice(start, start + warehousePageSize);
  }, [warehouses, warehousePage, warehousePageSize]);

  const rawAnalyticsQuotes = analyticsData?.quotes || [];
  const paginatedAnalyticsQuotes = useMemo(() => {
    const start = (analyticsPage - 1) * analyticsPageSize;
    return rawAnalyticsQuotes.slice(start, start + analyticsPageSize);
  }, [rawAnalyticsQuotes, analyticsPage, analyticsPageSize]);

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '24px 28px',
          borderRadius: '14px',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
          borderBottom: '3px solid #0284c7',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(2, 132, 199, 0.25)',
                color: '#38bdf8',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              Enterprise Admin Hub
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>DealFlow360 Executive Platform</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.4px' }}>
            Platform Administration & Executive Control Center
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#94a3b8' }}>
            Configure enterprise products, pricing tiers, discount approval matrices, warehouse logistics, and export multi-axis business analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {currentUser.avatar || 'DV'}
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{currentUser.role} (Platform Architect)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Message Toast */}
      {actionMessage && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 500,
            backgroundColor: actionMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: actionMessage.type === 'error' ? '#991b1b' : '#166534',
            border: actionMessage.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {actionMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'analytics', label: 'Executive Analytics & Multi-Axis Reports (A1)', icon: BarChart3 },
          { id: 'products', label: 'Products & Price Lists (A2)', icon: Package },
          { id: 'tiers', label: 'Discount Tiers & Approval Chains (A3)', icon: ShieldCheck },
          { id: 'warehouses', label: 'Multi-Depot Fulfillment (A4)', icon: Truck },
          { id: 'subscriptions', label: 'Subscriptions & Billing Plans (A5)', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #0284c7' : '3px solid transparent',
                color: isActive ? '#0284c7' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                marginBottom: '-2px',
              }}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB 5: Executive Analytics & Multi-Axis Reports (Section A1)        */}
      {/* ==================================================================== */}
      {activeTab === 'analytics' && (
        <div>
          {/* Section A1 Filter Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '18px 22px',
              marginBottom: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="#0284c7" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  Multi-Axis Reporting Dimensions (Section A1)
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>
                  Instant Aggregation
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={fetchAnalytics}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} className={loadingAnalytics ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#0284c7',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <Download size={14} />
                  <span>Export CSV Summary</span>
                </button>
              </div>
            </div>

            {/* 4 Multi-Axis Filters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {/* Axis 1: Period */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Axis 1: Reporting Period
                </label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Time (Historical)</option>
                  <option value="today">Today Only</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">Past 30 Days</option>
                  <option value="quarter">Past Quarter (90 Days)</option>
                </select>
              </div>

              {/* Axis 2: Sales Rep */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Axis 2: Sales Team / Rep
                </label>
                <select
                  value={filterSalesRep}
                  onChange={(e) => setFilterSalesRep(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Sales Representatives</option>
                  <option value="rep-01">Sales Rep</option>
                  <option value="mgr-01">Sales Manager</option>
                  <option value="fin-01">Finance</option>
                </select>
              </div>

              {/* Axis 3: Approval / Quote Status */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Axis 3: Approval & Deal Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Statuses (Full Pipeline)</option>
                  <option value="Confirmed">Confirmed Orders (Won)</option>
                  <option value="Approved">Approved by Management</option>
                  <option value="PendingApproval">Pending Approval (Inbox)</option>
                  <option value="Draft">Draft Quotations</option>
                  <option value="Rejected">Rejected Quotations</option>
                </select>
              </div>

              {/* Axis 4: Product Category */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Axis 4: Product & Service Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Hardware">Hardware Products</option>
                  <option value="Service">Professional Services</option>
                  <option value="Subscription">Recurring Subscriptions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Executive KPI Metric Tiles */}
          {analyticsData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Booked Revenue (Confirmed)
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  ${((analyticsData.kpis.totalBookedRevenueCents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '11.5px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={13} />
                  <span>{analyticsData.kpis.totalOrders} Confirmed Orders</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Pipeline Total Volume
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  ${((analyticsData.kpis.totalPipelineRevenueCents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Across {analyticsData.kpis.totalQuotations} Quotations
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Average Gross Margin
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {analyticsData.kpis.averageMarginPct}%
                </div>
                <div style={{ fontSize: '11.5px', color: analyticsData.kpis.averageMarginPct >= 30 ? '#16a34a' : '#d97706' }}>
                  {analyticsData.kpis.averageMarginPct >= 30 ? 'Healthy Target (>30%)' : 'Caution (Below 30%)'}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Win / Close Rate
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {analyticsData.kpis.winRatePct}%
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Confirmed vs Active Deals
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '18px 20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Catalog Coverage
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {products.length} SKUs
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {warehouses.length} Active Fulfillment Hubs
                </div>
              </div>
            </div>
          )}

          {/* Breakdowns Row: By Category & By Sales Rep */}
          {analyticsData && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Category Breakdown */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                  Revenue & Volume by Product Category
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analyticsData.breakdowns.byCategory.map((c) => {
                    const totalRev = analyticsData.kpis.totalPipelineRevenueCents || 1;
                    const pct = Math.min(100, Math.round((c.revenueCents / totalRev) * 100));
                    return (
                      <div key={c.category}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{c.category}</span>
                          <span style={{ color: '#0f172a', fontWeight: 700 }}>
                            ${(c.revenueCents / 100).toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              backgroundColor: c.category === 'Hardware' ? '#0284c7' : c.category === 'Service' ? '#10b981' : '#8b5cf6',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Tier Distribution */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                  Pipeline Distribution by Customer Tier
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analyticsData.breakdowns.byTier.map((t) => {
                    const totalRev = analyticsData.kpis.totalPipelineRevenueCents || 1;
                    const pct = Math.min(100, Math.round((t.revenueCents / totalRev) * 100));
                    return (
                      <div key={t.tier}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>Tier: {t.tier}</span>
                          <span style={{ color: '#0f172a', fontWeight: 700 }}>
                            ${(t.revenueCents / 100).toLocaleString()} ({t.count} deals)
                          </span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              backgroundColor: t.tier === 'Platinum' ? '#0284c7' : t.tier === 'Gold' ? '#f59e0b' : t.tier === 'Silver' ? '#94a3b8' : '#b45309',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quotes Ledger Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Filtered Quotations & Execution Ledger
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Showing {rawAnalyticsQuotes.length} matching entries
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '12px 18px' }}>Quote #</th>
                    <th style={{ padding: '12px 18px' }}>Customer ID</th>
                    <th style={{ padding: '12px 18px' }}>Sales Rep</th>
                    <th style={{ padding: '12px 18px' }}>Net Total</th>
                    <th style={{ padding: '12px 18px' }}>Gross Margin</th>
                    <th style={{ padding: '12px 18px' }}>Status</th>
                    <th style={{ padding: '12px 18px' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAnalyticsQuotes && paginatedAnalyticsQuotes.length > 0 ? (
                    paginatedAnalyticsQuotes.map((q) => (
                      <tr
                        key={q.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0284c7' }}>
                          {q.quoteNumber || q.id}
                        </td>
                        <td style={{ padding: '12px 18px', color: '#334155' }}>
                          {q.customerId}
                        </td>
                        <td style={{ padding: '12px 18px', color: '#334155' }}>
                          {q.salesRepName || 'Unassigned'}
                        </td>
                        <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>
                          ${(q.netTotalCents / 100).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              backgroundColor: q.marginPercentage >= 30 ? '#dcfce7' : '#fef3c7',
                              color: q.marginPercentage >= 30 ? '#15803d' : '#b45309',
                            }}
                          >
                            {q.marginPercentage}%
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              backgroundColor:
                                q.status === 'Confirmed'
                                  ? '#dcfce7'
                                  : q.status === 'Approved'
                                  ? '#e0f2fe'
                                  : q.status === 'PendingApproval'
                                  ? '#fef3c7'
                                  : '#f1f5f9',
                              color:
                                q.status === 'Confirmed'
                                  ? '#15803d'
                                  : q.status === 'Approved'
                                  ? '#0369a1'
                                  : q.status === 'PendingApproval'
                                  ? '#b45309'
                                  : '#475569',
                            }}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', color: '#64748b', fontSize: '12px' }}>
                          {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                        No quotations match the selected multi-axis filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {rawAnalyticsQuotes.length > 0 && (
              <Pagination
                currentPage={analyticsPage}
                totalItems={rawAnalyticsQuotes.length}
                pageSize={analyticsPageSize}
                pageSizeOptions={[10, 25, 50, 100]}
                onPageChange={setAnalyticsPage}
                onPageSizeChange={(newSize) => {
                  setAnalyticsPageSize(newSize);
                  setAnalyticsPage(1);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: Products & Price Lists (Section A2)                          */}
      {/* ==================================================================== */}
      {activeTab === 'products' && (
        <div>
          {/* Customer Tier Price List Matrix Reference (Section A2) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              marginBottom: '24px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
              Customer Tier Price List Matrix (Section A2)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Base list prices automatically apply discount curves according to customer tier standing:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>Bronze Tier</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#78350f', margin: '4px 0' }}>List Price (0%)</div>
                <div style={{ fontSize: '11px', color: '#92400e' }}>Standard Commercial Terms</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Silver Tier</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: '4px 0' }}>5% Off List</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>Annual spend &gt; $50,000</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#fef9c3', border: '1px solid #fef08a' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e' }}>Gold Tier</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#713f12', margin: '4px 0' }}>10% Off List</div>
                <div style={{ fontSize: '11px', color: '#854d0e' }}>Annual spend &gt; $150,000</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b21a8' }}>Platinum Tier</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#581c87', margin: '4px 0' }}>15% Off List</div>
                <div style={{ fontSize: '11px', color: '#6b21a8' }}>Strategic enterprise accounts</div>
              </div>
            </div>
          </div>

          {/* Products Catalog Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by SKU, name, or category..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#0284c7',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                }}
              >
                <Plus size={16} />
                <span>Add New Product (A2)</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '12px 18px' }}>SKU</th>
                    <th style={{ padding: '12px 18px' }}>Product Name</th>
                    <th style={{ padding: '12px 18px' }}>Category</th>
                    <th style={{ padding: '12px 18px' }}>List Price</th>
                    <th style={{ padding: '12px 18px' }}>Cost Price</th>
                    <th style={{ padding: '12px 18px' }}>Min Margin Floor</th>
                    <th style={{ padding: '12px 18px' }}>Billing Model</th>
                    <th style={{ padding: '12px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => {
                    const listPrice = (p.listPriceCents || p.list_price_cents || 0) / 100;
                    const costPrice = (p.costPriceCents || p.cost_price_cents || 0) / 100;
                    const margin = listPrice > 0 ? (((listPrice - costPrice) / listPrice) * 100).toFixed(1) : 0;
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0284c7' }}>{p.sku}</td>
                        <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              backgroundColor: p.category === 'Hardware' ? '#e0f2fe' : p.category === 'Service' ? '#dcfce7' : '#f3e8ff',
                              color: p.category === 'Hardware' ? '#0369a1' : p.category === 'Service' ? '#15803d' : '#6b21a8',
                            }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', fontWeight: 700 }}>${listPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 18px', color: '#64748b' }}>${costPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ fontWeight: 600, color: margin >= 20 ? '#16a34a' : '#d97706' }}>
                            {margin}% ({p.minMarginFloorPct || 15}% floor)
                          </span>
                        </td>
                        <td style={{ padding: '12px 18px', color: '#64748b' }}>
                          {p.isSubscription || p.is_subscription ? `Recurring (${p.billingFrequency || 'Monthly'})` : 'One-time Sale'}
                        </td>
                        <td style={{ padding: '12px 18px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534' }}>
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={productPage}
                totalItems={filteredProducts.length}
                pageSize={productPageSize}
                pageSizeOptions={[10, 25, 50]}
                onPageChange={setProductPage}
                onPageSizeChange={(newSize) => {
                  setProductPageSize(newSize);
                  setProductPage(1);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: Discount Tiers & Approval Chains (Section A3)                */}
      {/* ==================================================================== */}
      {activeTab === 'tiers' && (
        <div>
          {/* Approval Routing Rules Policy Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={20} color="#d97706" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Level 1: Sales Manager Approval Criteria
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                Quotes triggering any of the following conditions are automatically held in Managerial Inbox for review by Elena Vance:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#16a34a" />
                  <span><strong>Discount &gt; 15%</strong> across any line item or deal aggregate</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#16a34a" />
                  <span><strong>Gross Margin &lt; 25%</strong> below strategic floor threshold</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#16a34a" />
                  <span><strong>Deal Total &gt; $50,000</strong> high-value enterprise commitment</span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={20} color="#dc2626" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Level 2: Corporate Finance Dual-Approval
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                Severe margin breaches or non-standard terms require explicit second-key authorization by Marcus Sterling:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#dc2626" />
                  <span><strong>Discount &gt; 25%</strong> hard breach requiring financial controller sign-off</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#dc2626" />
                  <span><strong>Gross Margin &lt; 15%</strong> near cost floor transaction</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                  <Check size={16} color="#dc2626" />
                  <span><strong>Payment Terms &gt; Net 60</strong> extended corporate liability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category-Specific Discount Ceilings Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Category Discount Ceilings & Auto-Lock Parameters
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 18px' }}>Category</th>
                  <th style={{ padding: '12px 18px' }}>Standard AE Authority</th>
                  <th style={{ padding: '12px 18px' }}>Manager Discretion Cap</th>
                  <th style={{ padding: '12px 18px' }}>Finance Hard Limit</th>
                  <th style={{ padding: '12px 18px' }}>COGS Margin Floor</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0284c7' }}>Hardware Products</td>
                  <td style={{ padding: '12px 18px' }}>Up to 10%</td>
                  <td style={{ padding: '12px 18px' }}>Up to 20%</td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#dc2626' }}>25% Max</td>
                  <td style={{ padding: '12px 18px' }}>15% Floor</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#16a34a' }}>Professional Services</td>
                  <td style={{ padding: '12px 18px' }}>Up to 15%</td>
                  <td style={{ padding: '12px 18px' }}>Up to 25%</td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#dc2626' }}>30% Max</td>
                  <td style={{ padding: '12px 18px' }}>25% Floor</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#8b5cf6' }}>Subscriptions / SaaS</td>
                  <td style={{ padding: '12px 18px' }}>Up to 15%</td>
                  <td style={{ padding: '12px 18px' }}>Up to 30%</td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#dc2626' }}>40% Max</td>
                  <td style={{ padding: '12px 18px' }}>40% Floor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: Multi-Depot Warehouse Setup (Section A4)                     */}
      {/* ==================================================================== */}
      {activeTab === 'warehouses' && (
        <div>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Enterprise Multi-Depot Fulfillment Network (Section A4)
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Configured distribution centers participating in automated ATP order splitting and multi-depot routing.
                </p>
              </div>

              <button
                onClick={() => setShowAddWarehouseModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#0284c7',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                }}
              >
                <Plus size={16} />
                <span>Register Warehouse Depot (A4)</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '12px 18px' }}>Depot Code</th>
                    <th style={{ padding: '12px 18px' }}>Facility Name</th>
                    <th style={{ padding: '12px 18px' }}>Location</th>
                    <th style={{ padding: '12px 18px' }}>Type / Hub Role</th>
                    <th style={{ padding: '12px 18px' }}>Safety Buffer</th>
                    <th style={{ padding: '12px 18px' }}>Capacity Units</th>
                    <th style={{ padding: '12px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWarehouses.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0284c7' }}>{w.code}</td>
                      <td style={{ padding: '12px 18px', fontWeight: 600, color: '#0f172a' }}>{w.name}</td>
                      <td style={{ padding: '12px 18px', color: '#334155' }}>
                        {w.city ? `${w.city}, ${w.state || 'USA'}` : w.location || 'Regional'}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        {w.isPrimaryHub || w.is_primary_hub ? (
                          <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e' }}>
                            Primary Central Hub
                          </span>
                        ) : (
                          <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569' }}>
                            Regional Depot
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 18px', color: '#64748b' }}>{w.safetyBuffer || 50} units</td>
                      <td style={{ padding: '12px 18px', color: '#64748b' }}>
                        {(w.capacityUnits || w.capacity_units || 50000).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534' }}>
                          Operational
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {warehouses.length > 0 && (
              <Pagination
                currentPage={warehousePage}
                totalItems={warehouses.length}
                pageSize={warehousePageSize}
                pageSizeOptions={[5, 10, 25]}
                onPageChange={setWarehousePage}
                onPageSizeChange={(newSize) => {
                  setWarehousePageSize(newSize);
                  setWarehousePage(1);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: Subscriptions & Billing Plans (Section A5)                   */}
      {/* ==================================================================== */}
      {activeTab === 'subscriptions' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                Cadence 1: Monthly Flexible
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '8px 0 12px 0' }}>
                Monthly Recurring Billing
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Standard monthly recurring revenue (MRR) cycle. Proration computed on exact day count of calendar month.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                <div>• <strong>Proration:</strong> Exact daily rate (Day / DaysInMonth)</div>
                <div>• <strong>Auto-Renewal:</strong> Enabled by default</div>
                <div>• <strong>Cancellation Notice:</strong> 15 Calendar Days</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                Cadence 2: Quarterly Commitment
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '8px 0 12px 0' }}>
                Quarterly Advance Plan
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Quarterly billing with built-in 5% multi-month incentive. Invoiced on day 1 of each fiscal quarter.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                <div>• <strong>Term Incentive:</strong> 5% Automatic Tier Discount</div>
                <div>• <strong>Invoice Schedule:</strong> 1st of Jan, Apr, Jul, Oct</div>
                <div>• <strong>Grace Period:</strong> 10 Business Days</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
                Cadence 3: Annual Enterprise
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '8px 0 12px 0' }}>
                Annual Upfront Contract
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Full-year prepayment with 15% upfront discount, guaranteed SLAs, and dedicated customer success manager.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                <div>• <strong>Annual Discount:</strong> 15% Prepaid Credit</div>
                <div>• <strong>Contract Lock:</strong> 365 Days Guaranteed Pricing</div>
                <div>• <strong>Payment Terms:</strong> Net 30 with Corporate PO</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: Add New Product (Section A2)                                 */}
      {/* ==================================================================== */}
      {showAddProductModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '520px',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Configure New Product Catalog Item (A2)
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Industrial Sensor Node v2"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Auto-generated if blank"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Service">Professional Service</option>
                    <option value="Subscription">Recurring Subscription</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    List Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.listPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, listPrice: e.target.value })}
                    placeholder="e.g. 450.00"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Cost Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                    placeholder="e.g. 270.00"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Unit Description
                  </label>
                  <input
                    type="text"
                    value={newProduct.unitDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, unitDescription: e.target.value })}
                    placeholder="Unit, Hour, License..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Min Margin Floor (%)
                  </label>
                  <input
                    type="number"
                    value={newProduct.minMarginFloorPct}
                    onChange={(e) => setNewProduct({ ...newProduct, minMarginFloorPct: e.target.value })}
                    placeholder="15"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="isSub"
                  checked={newProduct.isSubscription}
                  onChange={(e) => setNewProduct({ ...newProduct, isSubscription: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                />
                <label htmlFor="isSub" style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  Recurring Subscription Product
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: Add Warehouse Depot (Section A4)                             */}
      {/* ==================================================================== */}
      {showAddWarehouseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '500px',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Register Warehouse Depot (A4)
              </h3>
              <button
                onClick={() => setShowAddWarehouseModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddWarehouse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Depot Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWarehouse.code}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
                    placeholder="WH-DEN-01"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Depot Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    placeholder="Denver Regional Depot"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.city}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, city: e.target.value })}
                    placeholder="Denver"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.state}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, state: e.target.value })}
                    placeholder="CO"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Safety Buffer Units
                  </label>
                  <input
                    type="number"
                    value={newWarehouse.safetyBuffer}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, safetyBuffer: e.target.value })}
                    placeholder="50"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Storage Capacity
                  </label>
                  <input
                    type="number"
                    value={newWarehouse.capacityUnits}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, capacityUnits: e.target.value })}
                    placeholder="50000"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="isHub"
                  checked={newWarehouse.isPrimaryHub}
                  onChange={(e) => setNewWarehouse({ ...newWarehouse, isPrimaryHub: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                />
                <label htmlFor="isHub" style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                  Designate as Primary National Hub
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddWarehouseModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Register Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
