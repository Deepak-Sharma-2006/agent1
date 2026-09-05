import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Truck,
  MapPin,
  Package,
  Shield,
  Layers,
  Home,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  Filter,
  CheckSquare,
  Square,
  Box,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function WarehouseView() {
  const { currentUser, isWarehouse } = useAuth();
  const { addToast } = useWebSocket();

  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState({});
  const [shipments, setShipments] = useState([]);
  const [backorders, setBackorders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab navigation: 'fleet' | 'shipments' | 'backorders'
  const [activeTab, setActiveTab] = useState('fleet');

  // Filters
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dispatch Modal state
  const [activeShipment, setActiveShipment] = useState(null);
  const [dispatchCarrier, setDispatchCarrier] = useState('FedEx Ground Priority');
  const [dispatchTracking, setDispatchTracking] = useState('');
  const [pickedItems, setPickedItems] = useState({});
  const [dispatching, setDispatching] = useState(false);

  // Initial load
  const loadData = async () => {
    try {
      setLoading(true);
      const [wRes, pRes, sRes, bRes] = await Promise.all([
        fetch('/api/warehouses').then((r) => r.json()).catch(() => ({})),
        fetch('/api/products').then((r) => r.json()).catch(() => ({})),
        fetch('/api/shipments').then((r) => r.json()).catch(() => ({})),
        fetch('/api/backorders').then((r) => r.json()).catch(() => ({})),
      ]);

      if (wRes.success) {
        setWarehouses(wRes.warehouses || []);
        setInventory(wRes.inventory || []);
      }
      if (pRes.success) {
        const pMap = {};
        (pRes.products || []).forEach((p) => {
          pMap[p.id] = p;
        });
        setProducts(pMap);
      }
      if (sRes.success) {
        setShipments(sRes.shipments || []);
      }
      if (bRes.success) {
        setBackorders(bRes.backorders || []);
      }
    } catch (err) {
      console.error('Failed to load warehouse operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Default home depot filter for warehouse operator
  useEffect(() => {
    if (isWarehouse() && currentUser.warehouseId && warehouses.length > 0) {
      setWarehouseFilter(currentUser.warehouseId);
    }
  }, [warehouses, currentUser]);

  // Handle open dispatch modal
  const handleOpenDispatchModal = (shipment) => {
    setActiveShipment(shipment);
    setDispatchCarrier('FedEx Ground Priority');
    setDispatchTracking(`TRK-FX-${Math.floor(10000000 + Math.random() * 90000000)}`);
    // Pre-populate checklist
    const checks = {};
    (shipment.items || []).forEach((item, idx) => {
      checks[item.id || idx] = true;
    });
    setPickedItems(checks);
  };

  const handleTogglePicked = (id) => {
    setPickedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Submit dispatch
  const handleConfirmDispatch = async () => {
    if (!activeShipment) return;
    try {
      setDispatching(true);
      const res = await fetch(`/api/shipments/${activeShipment.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: dispatchCarrier,
          trackingNumber: dispatchTracking,
          dispatchedBy: currentUser.name || 'Warehouse Lead',
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (addToast) {
          addToast(
            'Shipment Dispatched',
            `Order ${activeShipment.id} successfully handed off to ${dispatchCarrier} (${dispatchTracking}).`,
            'success'
          );
        }
        setActiveShipment(null);
        await loadData();
      } else {
        alert(data.error || 'Failed to dispatch shipment');
      }
    } catch (err) {
      alert('Error dispatching shipment: ' + err.message);
    } finally {
      setDispatching(false);
    }
  };

  // Filtered shipments
  const filteredShipments = shipments.filter((s) => {
    const matchesWh = warehouseFilter === 'ALL' || s.warehouseId === warehouseFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesWh && matchesStatus;
  });

  // Calculate network-wide totals
  const totalPhysical = inventory.reduce((sum, i) => sum + (i.physicalStock || 0), 0);
  const totalReserved = inventory.reduce((sum, i) => sum + (i.reservedStock || 0), 0);
  const totalSafety = inventory.reduce((sum, i) => sum + (i.safetyBuffer || 0), 0);
  const totalATP = inventory.reduce(
    (sum, i) => sum + Math.max(0, (i.physicalStock || 0) - (i.reservedStock || 0) - (i.safetyBuffer || 0)),
    0
  );

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            {isWarehouse()
              ? `${currentUser.company || 'Continental Logistics'} — Depot Logistics Station`
              : 'Multi-Warehouse Splitting & 6-Depot Network Telemetry'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time multi-depot allocation engine with live ATP formula (Physical - Reserved - SafetyBuffer), split shipment dispatch manifests, and backorder tracking.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={loadData}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Sync Network</span>
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Depots</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
            {warehouses.length} Regional Hubs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Chicago Hub + 5 Satellites</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Physical Units</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', whiteSpace: 'nowrap' }}>
            {totalPhysical.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Floor inventory across depots</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Reserved for Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning)', marginTop: '4px', whiteSpace: 'nowrap' }}>
            {totalReserved.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Locked by confirmed quotations</div>
        </div>

        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Available-To-Promise (ATP)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginTop: '4px', whiteSpace: 'nowrap' }}>
            {totalATP.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Net allocatable minus buffers</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}
      >
        <button
          className="btn"
          style={{
            borderRadius: '6px 6px 0 0',
            borderBottom: activeTab === 'fleet' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'fleet' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '13px',
            backgroundColor: activeTab === 'fleet' ? '#fff' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
          }}
          onClick={() => setActiveTab('fleet')}
        >
          <Layers size={16} />
          <span>6-Depot Network & Live ATP Heatmap</span>
        </button>

        <button
          className="btn"
          style={{
            borderRadius: '6px 6px 0 0',
            borderBottom: activeTab === 'shipments' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'shipments' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '13px',
            backgroundColor: activeTab === 'shipments' ? '#fff' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
          }}
          onClick={() => setActiveTab('shipments')}
        >
          <Truck size={16} />
          <span>Split Shipment Dispatch Queue ({shipments.length})</span>
        </button>

        <button
          className="btn"
          style={{
            borderRadius: '6px 6px 0 0',
            borderBottom: activeTab === 'backorders' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'backorders' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '13px',
            backgroundColor: activeTab === 'backorders' ? '#fff' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
          }}
          onClick={() => setActiveTab('backorders')}
        >
          <Package size={16} />
          <span>Network Backorder Ledger ({backorders.length})</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: '10px' }} />
          <div>Synchronizing 6-Depot Logistics Telemetry...</div>
        </div>
      ) : (
        <>
          {/* TAB 1: 6-Depot Fleet & Live ATP Heatmap */}
          {activeTab === 'fleet' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {warehouses.map((wh) => {
                const whInventory = inventory.filter((inv) => inv.warehouseId === wh.id);
                const totalUnits = whInventory.reduce((sum, i) => sum + (i.physicalStock || 0), 0);
                const reservedUnits = whInventory.reduce((sum, i) => sum + (i.reservedStock || 0), 0);
                const safetyUnits = whInventory.reduce((sum, i) => sum + (i.safetyBuffer || 0), 0);
                const atpUnits = whInventory.reduce(
                  (sum, i) => sum + Math.max(0, (i.physicalStock || 0) - (i.reservedStock || 0) - (i.safetyBuffer || 0)),
                  0
                );
                const isHomeDepot = isWarehouse() && (wh.id === currentUser.warehouseId || wh.code === 'ORD-01');

                return (
                  <div
                    key={wh.id}
                    className="card"
                    style={{
                      marginBottom: 0,
                      border: isHomeDepot ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      boxShadow: isHomeDepot ? '0 4px 14px -2px rgba(2, 132, 199, 0.2)' : 'var(--shadow-sm)',
                    }}
                  >
                    <div className="card-header" style={{ paddingBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="card-title" style={{ fontSize: '15px', fontWeight: 700 }}>
                            {wh.name}
                          </span>
                          {isHomeDepot && (
                            <span className="badge badge-approved" style={{ fontSize: '10px' }}>
                              Your Home Depot
                            </span>
                          )}
                          {wh.isPrimaryHub && (
                            <span className="badge badge-confirmed" style={{ fontSize: '10px' }}>
                              Primary Hub
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          <MapPin size={13} />
                          <span>
                            {wh.city}, {wh.state} ({wh.code})
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                        }}
                      >
                        <Truck size={18} />
                      </div>
                    </div>

                    {/* Depot Aggregate Stats */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px',
                        marginBottom: '16px',
                        padding: '10px',
                        backgroundColor: 'var(--bg-canvas)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>PHYSICAL</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {totalUnits.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>u</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>RESERVED</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {reservedUnits.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>u</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>SAFETY</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {safetyUnits.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>u</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>LIVE ATP</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          {atpUnits.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>u</span>
                        </div>
                      </div>
                    </div>

                    {/* Itemized Stock Allocation by SKU */}
                    <div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        SKU Inventory & Live ATP Telemetry:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {whInventory.map((item) => {
                          const prod = products[item.productId] || {};
                          const physical = item.physicalStock || 0;
                          const reserved = item.reservedStock || 0;
                          const safety = item.safetyBuffer || 0;
                          const atp = Math.max(0, physical - reserved - safety);

                          return (
                            <div
                              key={item.id}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-canvas)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-main)' }}>
                                  {prod.name || item.productId}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                                  SKU: {prod.sku || 'SKU-GEN'} • Phys: {physical.toLocaleString()} | Res: {reserved.toLocaleString()} | Buf: {safety.toLocaleString()}
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <span
                                  className={atp > 15 ? 'badge badge-approved' : atp > 0 ? 'badge badge-pending' : 'badge badge-rejected'}
                                  style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 700 }}
                                >
                                  {atp.toLocaleString()} ATP units
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Split Shipment Dispatch Queue */}
          {activeTab === 'shipments' && (
            <div>
              {/* Filter Controls Bar */}
              <div
                className="card"
                style={{
                  marginBottom: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={15} color="var(--text-muted)" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Depot Filter:</span>
                    <select
                      className="form-control"
                      value={warehouseFilter}
                      onChange={(e) => setWarehouseFilter(e.target.value)}
                      style={{ fontSize: '12px', padding: '4px 8px', height: '32px' }}
                    >
                      <option value="ALL">All Continental Depots</option>
                      {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name} ({wh.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ fontSize: '12px', padding: '4px 8px', height: '32px' }}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Placed">Ready to Dispatch (Placed)</option>
                      <option value="Shipped">Dispatched (Shipped)</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Showing <strong>{filteredShipments.length}</strong> of {shipments.length} total split manifests
                </div>
              </div>

              {/* Shipments List */}
              {filteredShipments.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Truck size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>No Split Shipments Found</div>
                  <div style={{ fontSize: '12.5px', marginTop: '4px' }}>
                    Shipment manifests are automatically created upon Customer Digital Confirmation of hardware quotations.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredShipments.map((ship) => {
                    const isShipped = ship.status === 'Shipped' || ship.status === 'Delivered';
                    const wh = warehouses.find((w) => w.id === ship.warehouseId) || {};

                    return (
                      <div
                        key={ship.id}
                        className="card"
                        style={{
                          marginBottom: 0,
                          borderLeft: isShipped ? '4px solid var(--success)' : '4px solid var(--warning)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '12px',
                            borderBottom: '1px solid var(--border-subtle)',
                            paddingBottom: '12px',
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
                                {ship.id}
                              </span>
                              <span
                                className={isShipped ? 'badge badge-approved' : 'badge badge-pending'}
                                style={{ fontSize: '11px', textTransform: 'uppercase' }}
                              >
                                {isShipped ? 'Dispatched / In Transit' : 'Placed / Ready to Pick'}
                              </span>
                            </div>

                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              Origin Depot:{' '}
                              <strong>
                                {wh.name || ship.warehouseId} ({wh.city || 'Depot'}, {wh.state || 'USA'})
                              </strong>{' '}
                              • Linked Quote: <strong>{ship.quotationId}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isShipped ? (
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                  Carrier: <strong>{ship.carrier}</strong>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                                  {ship.trackingNumber}
                                </div>
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenDispatchModal(ship)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                              >
                                <Truck size={14} />
                                <span>Prepare & Dispatch</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Allocated Line Items */}
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Physical Picking Manifest:
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                            {(ship.items || []).map((item, idx) => {
                              const prod = products[item.productId] || {};
                              return (
                                <div
                                  key={item.id || idx}
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: 'var(--bg-canvas)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                                      {item.productName || prod.name || item.productId}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                      SKU: {item.sku || prod.sku || 'SKU-HW'}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {item.quantity} units
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Network Backorder Ledger */}
          {activeTab === 'backorders' && (
            <div>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <AlertTriangle size={20} color="var(--warning)" />
                <div style={{ fontSize: '12.5px', color: '#92400e' }}>
                  <strong>Automated Manufacturer Restocking Tickets:</strong> Generated automatically when aggregate continental network ATP is fully exhausted. Purchase requisitions are triggered to maintain fulfillment SLAs.
                </div>
              </div>

              {backorders.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={36} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                    Zero Unfulfilled Backorders
                  </div>
                  <div style={{ fontSize: '12.5px', marginTop: '4px' }}>
                    All current quotation hardware demand has been satisfied across the 6 regional fulfillment depots.
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Ticket ID</th>
                        <th style={{ padding: '12px 16px' }}>Quotation Ref</th>
                        <th style={{ padding: '12px 16px' }}>Product & SKU</th>
                        <th style={{ padding: '12px 16px' }}>Shortfall Qty</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Created Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backorders.map((bo) => {
                        const prod = products[bo.productId] || {};
                        return (
                          <tr key={bo.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700 }}>
                              {bo.id}
                            </td>
                            <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 600 }}>
                              {bo.quotationId}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 600 }}>{bo.productName || prod.name || bo.productId}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: {bo.sku || prod.sku}</div>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--danger)' }}>
                              {bo.quantity} units
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="badge badge-pending" style={{ fontSize: '10.5px' }}>
                                {bo.status || 'Pending Restock'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              {new Date(bo.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Picker Checklist & Dispatch Carrier Modal */}
      {activeShipment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '540px', marginBottom: 0 }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <span className="card-title" style={{ fontSize: '16px', fontWeight: 700 }}>
                  Picker Manifest & Dispatch Order
                </span>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Shipment: <strong style={{ fontFamily: 'monospace' }}>{activeShipment.id}</strong>
                </div>
              </div>
              <Truck size={22} color="var(--primary)" />
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Picker Checklist */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  1. Warehouse Picker Verification Checklist:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(activeShipment.items || []).map((item, idx) => {
                    const itemId = item.id || idx;
                    const isPicked = !!pickedItems[itemId];

                    return (
                      <div
                        key={itemId}
                        onClick={() => handleTogglePicked(itemId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: isPicked ? 'var(--primary-light)' : 'var(--bg-canvas)',
                          border: isPicked ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        {isPicked ? (
                          <CheckSquare size={16} color="var(--primary)" />
                        ) : (
                          <Square size={16} color="var(--text-muted)" />
                        )}
                        <div style={{ flex: 1, fontSize: '12.5px' }}>
                          <span style={{ fontWeight: 600 }}>{item.productName || item.productId}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                            ({item.sku || 'SKU-HW'})
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {item.quantity} units
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carrier Selection */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. Select Commercial Carrier:
                </div>
                <select
                  className="form-control"
                  value={dispatchCarrier}
                  onChange={(e) => setDispatchCarrier(e.target.value)}
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  <option value="FedEx Ground Priority">FedEx Ground Priority (Continental Expedited)</option>
                  <option value="UPS Commercial Freight">UPS Commercial Freight (LTL Logistics)</option>
                  <option value="DHL Express Worldwide">DHL Express Worldwide (Air Priority)</option>
                  <option value="FreightQuote LTL Direct">FreightQuote LTL Direct (Bulk Fleet)</option>
                </select>
              </div>

              {/* Tracking Number Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    3. Tracking Manifest Number:
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '2px 8px' }}
                    onClick={() => setDispatchTracking(`TRK-FX-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={dispatchTracking}
                  onChange={(e) => setDispatchTracking(e.target.value)}
                  style={{ width: '100%', fontFamily: 'monospace', fontWeight: 600 }}
                  placeholder="e.g. TRK-FX-99283741"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveShipment(null)}
                disabled={dispatching}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmDispatch}
                disabled={dispatching || !dispatchTracking.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Truck size={15} />
                <span>{dispatching ? 'Confirming Dispatch...' : 'Confirm Carrier Dispatch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WarehouseView;
