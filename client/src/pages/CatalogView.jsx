import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Pagination } from '../components/Pagination';
import {
  Package,
  Server,
  Wrench,
  ShieldCheck,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  UserCheck,
  Building,
} from 'lucide-react';

export function CatalogView({ onOpenQuote }) {
  const { currentUser, isCustomer, canViewInternalMargins } = useAuth();
  const [products, setProducts] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Customer Procurement Cart state
  const [cart, setCart] = useState([]);
  const [cardQuantities, setCardQuantities] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState(null);

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

  const formatCurrency = (cents) =>
    `$${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hardware':
        return Server;
      case 'Service':
        return Wrench;
      case 'Subscription':
        return ShieldCheck;
      default:
        return Package;
    }
  };

  const handleCardQtyChange = (productId, delta) => {
    setCardQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product) => {
    const qty = cardQuantities[product.id] || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    // Reset card quantity to 1
    setCardQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleUpdateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartCents = cart.reduce(
    (sum, item) => sum + (item.product.listPriceCents || 0) * item.quantity,
    0
  );

  const handleSubmitOrderRequest = async () => {
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      const lines = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitDiscountPercentage: 0,
      }));

      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.customerId || 'cust-acme-01',
          salesRepId: 'usr-rep-01',
          salesRepName: 'Sarah Jenkins',
          lines,
        }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.quotation)) {
        const createdQuote = data.quotation;
        setCart([]);
        setIsCartOpen(false);
        setSubmittedQuote(createdQuote);
      } else {
        alert(data.error || 'Failed to submit order request. Please try again.');
      }
    } catch (err) {
      alert('Network error while submitting order request: ' + err.message);
    } finally {
      setSubmitting(false);
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
    <div style={{ position: 'relative' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-main)',
              margin: 0,
            }}
          >
            Enterprise Commercial Product Catalog
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {isCustomer()
              ? 'Browse certified hardware, deployment services, and SLAs. Add items to submit a formal order request.'
              : 'High-margin infrastructure hardware, certified deployment services, and mission-critical SLAs.'}
          </p>
        </div>

        {/* Action Controls & Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {isCustomer() && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCartOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            >
              <ShoppingCart size={16} />
              <span>Procurement Cart</span>
              {totalCartUnits > 0 && (
                <span
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '999px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {totalCartUnits}
                </span>
              )}
            </button>
          )}

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
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

      {/* Success Modal / Banner after Order Request is Created */}
      {submittedQuote && (
        <div
          className="card"
          style={{
            marginBottom: '20px',
            borderColor: 'var(--success, #10b981)',
            backgroundColor: '#f0fdf4',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="var(--success, #10b981)" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#065f46' }}>
                  Order Request Submitted Successfully!
                </div>
                <div style={{ fontSize: '12.5px', color: '#047857', marginTop: '2px' }}>
                  Quotation <strong>{submittedQuote.quoteNumber || submittedQuote.id}</strong> has been created in{' '}
                  <strong>Draft</strong> state. Your Account Executive (Sarah Jenkins) will review and optimize enterprise volume discounts.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {typeof onOpenQuote === 'function' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenQuote(submittedQuote.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} />
                  <span>View Proposal in Portal</span>
                  <ArrowRight size={14} />
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSubmittedQuote(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading product catalog records...
        </div>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {paginatedProducts.map((product) => {
              const Icon = getCategoryIcon(product.category);
              const margin =
                product.listPriceCents > 0
                  ? (((product.listPriceCents - product.costPriceCents) / product.listPriceCents) * 100).toFixed(1)
                  : 0;
              const cardQty = cardQuantities[product.id] || 1;

              return (
                <div
                  key={product.id}
                  className="card"
                  style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}
                >
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
                        <span className="card-title" style={{ fontSize: '14.5px' }}>
                          {product.name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.sku}</span>
                      </div>
                    </div>
                    <span className="badge badge-draft">{product.category}</span>
                  </div>

                  <p
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                      marginBottom: '16px',
                      flex: 1,
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: canViewInternalMargins() ? '4px' : 0,
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Base List Price:</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary, #0284c7)' }}>
                        {formatCurrency(product.listPriceCents)}
                      </span>
                    </div>

                    {canViewInternalMargins() && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11.5px',
                        }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>Standard Gross Margin:</span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: margin >= 25 ? 'var(--success)' : 'var(--warning)',
                          }}
                        >
                          {margin}%
                        </span>
                      </div>
                    )}
                  </div>

                  {product.variants?.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          marginBottom: '4px',
                        }}
                      >
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
                          <span style={{ fontWeight: 600, color: 'var(--primary, #0284c7)' }}>
                            +{formatCurrency(v.priceDeltaCents)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customer Order Request Action */}
                  {isCustomer() && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleCardQtyChange(product.id, -1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '6px 9px',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            minWidth: '24px',
                            textAlign: 'center',
                          }}
                        >
                          {cardQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCardQtyChange(product.id, 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '6px 9px',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <ShoppingCart size={14} />
                        <span>Add to Order</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}
          >
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

      {/* Procurement Cart Drawer / Modal for Customers */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={18} color="var(--primary)" />
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  Procurement Order Request
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Account & AE Details */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                <Building size={14} color="var(--primary)" />
                <span>Account: <strong>Acme Industrial (Gold Tier)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <UserCheck size={14} color="#10b981" />
                <span>Assigned Account Executive: <strong>Sarah Jenkins</strong></span>
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={40} color="var(--text-light)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Your Procurement Cart is Empty</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Select products from the catalog to build an order request proposal.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => {
                    const itemTotal = (item.product.listPriceCents || 0) * item.quantity;
                    return (
                      <div
                        key={item.product.id}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.product.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.product.sku} • {formatCurrency(item.product.listPriceCents)} each
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, -1)}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                minWidth: '20px',
                                textAlign: 'center',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.product.id, 1)}
                              style={{
                                border: 'none',
                                background: 'none',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>
                            {formatCurrency(itemTotal)}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Catalog Subtotal:</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(totalCartCents)}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    backgroundColor: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    marginBottom: '14px',
                    lineHeight: 1.4,
                  }}
                >
                  Submitting creates a draft quotation proposal. Your Account Executive will review, apply Gold-tier volume discounts, and publish the terms for your digital signoff.
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitOrderRequest}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {submitting ? 'Creating Quotation...' : 'Submit Order Request to Sales Rep'}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CatalogView;
