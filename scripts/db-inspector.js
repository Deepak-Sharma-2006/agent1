/**
 * DealFlow360 - Database Inspector CLI
 * Inspects prisma/dev.db using node:sqlite and prints table stats & sample records.
 */

import { DatabaseSync } from 'node:sqlite';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'prisma', 'dev.db');

export function inspectDatabase() {
  if (!existsSync(dbPath)) {
    console.error(`❌ Database not found at: ${dbPath}`);
    return null;
  }

  const stats = statSync(dbPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  const db = new DatabaseSync(dbPath);

  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');
  const journalMode = db.prepare('PRAGMA journal_mode;').get()?.journal_mode || 'wal';

  // Get all user tables
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
    .all();

  const tableStats = [];

  for (const t of tables) {
    try {
      const countRow = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}";`).get();
      const columns = db.prepare(`PRAGMA table_info("${t.name}");`).all();
      tableStats.push({
        table: t.name,
        rowCount: countRow.count,
        columnCount: columns.length,
        columns: columns.map((c) => `${c.name} (${c.type})`).join(', '),
      });
    } catch (err) {
      tableStats.push({
        table: t.name,
        rowCount: 'Error',
        columnCount: 0,
        columns: err.message,
      });
    }
  }

  return {
    dbPath,
    sizeBytes: stats.size,
    sizeMb,
    journalMode,
    engine: 'SQLite 3 (via Node.js node:sqlite DatabaseSync)',
    tables: tableStats,
  };
}

// If run directly from CLI
if (process.argv[1]?.endsWith('db-inspector.js')) {
  console.log('\n================================================================================');
  console.log('                 DEALFLOW360 - SQLITE DATABASE INSPECTOR');
  console.log('================================================================================');

  const report = inspectDatabase();
  if (report) {
    console.log(`📁 File Location : ${report.dbPath}`);
    console.log(`💾 File Size     : ${report.sizeMb} MB (${report.sizeBytes.toLocaleString()} bytes)`);
    console.log(`⚙️  Engine        : ${report.engine}`);
    console.log(`📜 Journal Mode  : ${report.journalMode.toUpperCase()}`);
    console.log(`📊 Total Tables  : ${report.tables.length}\n`);

    console.log('--------------------------------------------------------------------------------');
    console.log('TABLE NAME                   | ROW COUNT   | COLUMNS');
    console.log('--------------------------------------------------------------------------------');
    for (const t of report.tables) {
      const nameCol = t.table.padEnd(28, ' ');
      const countCol = String(t.rowCount).padEnd(11, ' ');
      console.log(`${nameCol} | ${countCol} | ${t.columnCount} cols (${t.columns.slice(0, 50)}...)`);
    }
    console.log('--------------------------------------------------------------------------------\n');
  }
}
