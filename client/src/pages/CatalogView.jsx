import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pagination } from '../components/Pagination';
import { Package, Tag, Layers, Server, Network, Wrench, ShieldCheck, Search, Filter } from 'lucide-react';

export function CatalogView() {
  const { canViewInternalMargins } = useAuth();
  const [products, setProducts] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>
            Enterprise Commercial Product Catalog
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            High-margin infrastructure hardware, certified deployment services, and mission-critical SLAs.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search catalog by name, SKU..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #cbd5e1)',
                fontSize: '12.5px',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle, #cbd5e1)',
                fontSize: '12.5px',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Hardware">Hardware</option>
              <option value="Service">Services</option>
              <option value="Subscription">Subscriptions</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading product catalog records...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Package size={36} color="var(--text-light)" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>No Products Found</div>
          <div style={{ fontSize: '12.5px', marginTop: '4px' }}>
            No catalog records match the selected category filter or search query.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {paginatedProducts.map((product) => {
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
                          backgroundColor: 'var(--primary-light, #e0f2fe)',
                          color: 'var(--primary, #0284c7)',
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
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary, #0284c7)' }}>
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
                          <span style={{ fontWeight: 600, color: 'var(--primary, #0284c7)' }}>+{formatCurrency(v.priceDeltaCents)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              pageSizeOptions={[6, 12, 24, 48]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CatalogView;
