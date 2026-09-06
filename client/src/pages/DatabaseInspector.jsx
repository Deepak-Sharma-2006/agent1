import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  HardDrive,
  Layers,
  FileCode,
  RefreshCw,
  Search,
  CheckCircle,
  Key,
  Shield,
  Clock,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export function DatabaseInspector() {
  const [dbStatus, setDbStatus] = useState(null);
  const [selectedTable, setSelectedTable] = useState('quotations');
  const [tableData, setTableData] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
        if (data.tables && data.tables.length > 0) {
          // If current selectedTable isn't in tables, pick first
          if (!data.tables.some((t) => t.table === selectedTable)) {
            setSelectedTable(data.tables[0].table);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load database telemetry:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchTableData = async (tableName, pageNum = 1, limitNum = pageSize) => {
    try {
      setLoadingTable(true);
      const res = await fetch(`/api/database/tables/${tableName}?page=${pageNum}&limit=${limitNum}`);
      if (res.ok) {
        const data = await res.json();
        setTableData(data);
      }
    } catch (err) {
      console.error(`Failed to load table ${tableName}:`, err);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      setPage(1);
      fetchTableData(selectedTable, 1, pageSize);
    }
  }, [selectedTable, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTableData(selectedTable, newPage, pageSize);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
    fetchTableData(selectedTable, 1, newSize);
  };

  const filteredRows = (tableData?.rows || []).filter((row) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(query));
  });

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Live SQLite Database Explorer
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
              }}
            >
              Jury Architecture Telemetry
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: '4px 0 0 0' }}>
            Inspect physical database tables, relational schemas, ACID journal mode, and live records powered by native Node.js <code>node:sqlite</code>.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStatus();
            if (selectedTable) fetchTableData(selectedTable, page, pageSize);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh Inspector
        </button>
      </div>

      {/* Database Status Cards */}
      {dbStatus && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Database Engine
              </span>
              <Database size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>SQLite 3 (node:sqlite)</div>
            <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '2px' }}>Native DatabaseSync Driver</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Journaling Mode
              </span>
              <Shield size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              {dbStatus.journalMode?.toUpperCase()} Mode
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Concurrent Reads & Writes</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                File on Disk
              </span>
              <HardDrive size={16} color="#16a34a" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{dbStatus.sizeMb} MB</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
              prisma/dev.db
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Relational Tables
              </span>
              <Layers size={16} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              {dbStatus.tables?.length || 18} Tables
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
              Normalized relational schema
            </div>
          </div>
        </div>
      )}

      {/* Main Section: Tables Directory + Live Records */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Tables Catalog */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
            Database Tables ({dbStatus?.tables?.length || 0})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '600px', overflowY: 'auto' }}>
            {(dbStatus?.tables || []).map((t) => {
              const isSelected = selectedTable === t.table;
              return (
                <button
                  key={t.table}
                  type="button"
                  onClick={() => setSelectedTable(t.table)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #0284c7' : '1px solid transparent',
                    backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                    color: isSelected ? '#0284c7' : '#334155',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Table size={14} color={isSelected ? '#0284c7' : '#94a3b8'} />
                    <span>{t.table}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: isSelected ? '#0284c7' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {t.rowCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Table Schema & Live Records */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          {/* Table Header & Search */}
          <div
            style={{
              padding: '18px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Table: <code>{selectedTable}</code>
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {tableData?.totalRows ?? 0} total records
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                Showing columns: {tableData?.columns?.map((c) => c.name).join(', ')}
              </div>
            </div>

            {/* In-page search filter */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search
                size={14}
                color="#94a3b8"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Filter loaded rows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table Records Grid */}
          {loadingTable ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              Querying table records from SQLite...
            </div>
          ) : !tableData || (tableData.rows || []).length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No records in table <code>{selectedTable}</code>.
            </div>
          ) : (
            <div>
              <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      {(tableData.columns || []).map((col) => (
                        <th
                          key={col.name}
                          style={{
                            padding: '10px 14px',
                            fontWeight: 700,
                            fontSize: '11.5px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {col.pk === 1 && <Key size={11} color="#f59e0b" />}
                            <span>{col.name}</span>
                            <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 500 }}>
                              ({col.type})
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#fafafa',
                        }}
                      >
                        {(tableData.columns || []).map((col) => {
                          const val = row[col.name];
                          const strVal = val === null || val === undefined ? 'NULL' : String(val);
                          const isPk = col.pk === 1;

                          return (
                            <td
                              key={col.name}
                              style={{
                                padding: '10px 14px',
                                color: val === null ? '#94a3b8' : isPk ? '#0284c7' : '#0f172a',
                                fontWeight: isPk ? 600 : 400,
                                fontFamily: isPk || col.type === 'INTEGER' ? 'monospace' : 'inherit',
                                fontSize: isPk ? '11.5px' : '12.5px',
                                maxWidth: '260px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={strVal}
                            >
                              {strVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <Pagination
                currentPage={page}
                totalItems={tableData?.totalRows || 0}
                pageSize={pageSize}
                pageSizeOptions={[10, 25, 50, 100]}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
