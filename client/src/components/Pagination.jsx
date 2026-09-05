import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderTop: '1px solid var(--border-subtle, #e2e8f0)',
        backgroundColor: '#ffffff',
        fontSize: '12.5px',
        color: 'var(--text-muted, #64748b)',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Left: Summary & Page Size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of <strong>{totalItems}</strong> records
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px' }}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* First Page */}
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(1)}
          title="First Page"
          style={{
            padding: '5px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: safeCurrentPage === 1 ? '#f1f5f9' : '#ffffff',
            color: safeCurrentPage === 1 ? '#94a3b8' : '#334155',
            cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronsLeft size={14} />
        </button>

        {/* Prev Page */}
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          title="Previous Page"
          style={{
            padding: '5px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: safeCurrentPage === 1 ? '#f1f5f9' : '#ffffff',
            color: safeCurrentPage === 1 ? '#94a3b8' : '#334155',
            cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#94a3b8' }}>
                …
              </span>
            );
          }
          const isActive = p === safeCurrentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '28px',
                height: '28px',
                padding: '0 6px',
                borderRadius: '6px',
                border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: isActive ? '#0284c7' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          title="Next Page"
          style={{
            padding: '5px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: safeCurrentPage === totalPages ? '#f1f5f9' : '#ffffff',
            color: safeCurrentPage === totalPages ? '#94a3b8' : '#334155',
            cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Last Page"
          style={{
            padding: '5px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: safeCurrentPage === totalPages ? '#f1f5f9' : '#ffffff',
            color: safeCurrentPage === totalPages ? '#94a3b8' : '#334155',
            cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
