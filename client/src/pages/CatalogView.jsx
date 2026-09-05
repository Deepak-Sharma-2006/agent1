import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Tag, Layers, Server, Network, Wrench, ShieldCheck } from 'lucide-react';

export function CatalogView() {
  const { canViewInternalMargins } = useAuth();
  const [products, setProducts] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/incentives').then((r) => r.json()),
    ])
      .then(([pData, iData]) => {
        if (pData.success) setProducts(pData.products || []);
        if (iData.success) setIncentives(iData.rules || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (cents) => `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hardware': return Server;
      case 'Service': return Wrench;
      case 'Subscription': return ShieldCheck;
      default: return Package;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
          Enterprise Commercial Product Catalog
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          High-margin infrastructure hardware, certified deployment services, and mission-critical SLAs.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading product catalog records...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {products.map((product) => {
            const Icon = getCategoryIcon(product.category);
            const margin = product.listPriceCents > 0
              ? (((product.listPriceCents - product.costPriceCents) / product.listPriceCents) * 100).toFixed(1)
              : 0;

            return (
              <div key={product.id} className="card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="card-title" style={{ fontSize: '14.5px' }}>{product.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.sku}</span>
                    </div>
                  </div>
                  <span className="badge badge-draft">{product.category}</span>
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>
                  {product.description}
                </p>

                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: canViewInternalMargins() ? '4px' : 0 }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Base List Price:</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatCurrency(product.listPriceCents)}
                    </span>
                  </div>

                  {canViewInternalMargins() && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Standard Gross Margin:</span>
                      <span style={{ fontWeight: 600, color: margin >= 25 ? 'var(--success)' : 'var(--warning)' }}>
                        {margin}%
                      </span>
                    </div>
                  )}
                </div>

                {product.variants?.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Configurable Options:
                    </div>
                    {product.variants.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '11.5px',
                          padding: '4px 0',
                          borderBottom: '1px dashed var(--border-subtle)',
                        }}
                      >
                        <span>{v.name}</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>+{formatCurrency(v.priceDeltaCents)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
