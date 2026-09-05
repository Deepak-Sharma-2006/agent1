import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Shield, Layers } from 'lucide-react';

export function WarehouseView() {
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/warehouses').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([wData, pData]) => {
        if (wData.success) {
          setWarehouses(wData.warehouses || []);
          setInventory(wData.inventory || []);
        }
        if (pData.success) {
          const pMap = {};
          (pData.products || []).forEach((p) => {
            pMap[p.id] = p;
          });
          setProducts(pMap);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
          Multi-Warehouse Logistics & Inventory Heatmap
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Real-time physical stock levels, reservation allocations, and safety buffers across 5 regional depots.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading warehouse network telemetry...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {warehouses.map((wh) => {
            const whInventory = inventory.filter((inv) => inv.warehouseId === wh.id);
            const totalUnits = whInventory.reduce((sum, i) => sum + (i.physicalStock || 0), 0);
            const reservedUnits = whInventory.reduce((sum, i) => sum + (i.reservedStock || 0), 0);

            return (
              <div key={wh.id} className="card" style={{ marginBottom: 0 }}>
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="card-title" style={{ fontSize: '15px' }}>
                        {wh.name}
                      </span>
                      {wh.isPrimaryHub && (
                        <span className="badge badge-confirmed" style={{ fontSize: '10px' }}>
                          Primary Hub
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <MapPin size={12} />
                      <span>{wh.city}, {wh.state} ({wh.code})</span>
                    </div>
                  </div>
                  <Truck size={20} color="var(--primary)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Physical Units</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{totalUnits}</div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Reserved Units</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--warning)', marginTop: '2px' }}>{reservedUnits}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Stock Allocation by SKU:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {whInventory.map((item) => {
                      const prod = products[item.productId] || {};
                      const avail = (item.physicalStock || 0) - (item.reservedStock || 0);

                      return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            backgroundColor: '#f8fafc',
                            fontSize: '12px',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600 }}>{prod.name || item.productId}</span>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginLeft: '6px' }}>({prod.sku})</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Avail:</span>
                            <span style={{ fontWeight: 700, color: avail > 10 ? 'var(--success)' : 'var(--danger)' }}>
                              {avail} units
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
    </div>
  );
}
