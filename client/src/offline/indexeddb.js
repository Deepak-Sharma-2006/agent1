/**
 * DealFlow360 - Enterprise Native IndexedDB Storage Engine
 * Phase 9: Offline-First Synchronization Architecture
 * Zero Ghost Packages: Implemented using standard W3C IndexedDB API.
 */

const DB_NAME = 'DealFlow360_OfflineDB';
const DB_VERSION = 1;

let dbInstance = null;

/**
 * Open and initialize the native IndexedDB database instance.
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Product Catalog Store
      if (!db.objectStoreNames.contains('catalog')) {
        db.createObjectStore('catalog', { keyPath: 'id' });
      }

      // 2. Customer Directory Store
      if (!db.objectStoreNames.contains('customers')) {
        db.createObjectStore('customers', { keyPath: 'id' });
      }

      // 3. Local Quotation Drafts & Offline Revisions
      if (!db.objectStoreNames.contains('quotes')) {
        db.createObjectStore('quotes', { keyPath: 'id' });
      }

      // 4. Ordered Offline Mutation Queue
      if (!db.objectStoreNames.contains('mutation_queue')) {
        const queueStore = db.createObjectStore('mutation_queue', { keyPath: 'id' });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Execute a transaction on a specific store.
 */
function runStoreTx(storeName, mode, callback) {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], mode);
      const store = tx.objectStore(storeName);

      let result;
      try {
        result = callback(store);
      } catch (err) {
        reject(err);
        return;
      }

      tx.oncomplete = () => resolve(result);
      tx.onerror = (e) => reject(e.target.error);
    });
  });
}

// ----------------------------------------------------
// Product Catalog Store Operations
// ----------------------------------------------------

export async function cacheCatalog(products) {
  if (!Array.isArray(products)) return;
  return runStoreTx('catalog', 'readwrite', (store) => {
    products.forEach((prod) => {
      if (prod && prod.id) {
        store.put(prod);
      }
    });
  });
}

export async function getCachedCatalog() {
  return runStoreTx('catalog', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }).then((p) => p);
}

// ----------------------------------------------------
// Customer Directory Store Operations
// ----------------------------------------------------

export async function cacheCustomers(customers) {
  if (!Array.isArray(customers)) return;
  return runStoreTx('customers', 'readwrite', (store) => {
    customers.forEach((cust) => {
      if (cust && cust.id) {
        store.put(cust);
      }
    });
  });
}

export async function getCachedCustomers() {
  return runStoreTx('customers', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }).then((p) => p);
}

// ----------------------------------------------------
// Quotations & Drafts Store Operations
// ----------------------------------------------------

export async function saveOfflineQuote(quote) {
  if (!quote || !quote.id) {
    throw new Error('Quote must possess a valid identifier');
  }
  const record = {
    ...quote,
    _savedLocallyAt: Date.now(),
  };
  return runStoreTx('quotes', 'readwrite', (store) => {
    store.put(record);
  }).then(() => record);
}

export async function getOfflineQuote(id) {
  return runStoreTx('quotes', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }).then((p) => p);
}

export async function getAllOfflineQuotes() {
  return runStoreTx('quotes', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }).then((p) => p);
}

// ----------------------------------------------------
// Mutation Queue Operations (FIFO Replay Engine)
// ----------------------------------------------------

export async function enqueueMutation({
  endpoint,
  method = 'POST',
  payload = null,
  headers = {},
  entityId = null,
  entityType = 'quote',
  description = 'Commercial Mutation',
}) {
  const mutationId = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const mutation = {
    id: mutationId,
    endpoint,
    method: method.toUpperCase(),
    payload,
    headers,
    entityId,
    entityType,
    description,
    timestamp: Date.now(),
    retryCount: 0,
    status: 'pending',
  };

  await runStoreTx('mutation_queue', 'readwrite', (store) => {
    store.put(mutation);
  });

  return mutation;
}

export async function getPendingMutations() {
  return runStoreTx('mutation_queue', 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const index = store.index('timestamp');
      const req = index.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }).then((p) => p);
}

export async function removeMutation(id) {
  return runStoreTx('mutation_queue', 'readwrite', (store) => {
    store.delete(id);
  });
}

export async function clearMutations() {
  return runStoreTx('mutation_queue', 'readwrite', (store) => {
    store.clear();
  });
}
