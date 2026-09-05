import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initDB,
  enqueueMutation,
  getPendingMutations,
  removeMutation,
} from '../offline/indexeddb';

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeConflict, setActiveConflict] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Refresh pending count from IndexedDB
  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingMutations();
      setPendingCount(pending ? pending.length : 0);
    } catch (err) {
      console.warn('Could not read pending mutations count:', err);
    }
  }, []);

  // Sync Engine: FIFO queue replay
  const triggerSync = useCallback(async () => {
    if (isSyncing || !navigator.onLine || activeConflict) {
      return;
    }

    setIsSyncing(true);
    try {
      const queue = await getPendingMutations();
      if (!queue || queue.length === 0) {
        setPendingCount(0);
        setIsSyncing(false);
        setLastSyncTime(Date.now());
        return;
      }

      for (const mutation of queue) {
        try {
          const res = await fetch(mutation.endpoint, {
            method: mutation.method,
            headers: {
              'Content-Type': 'application/json',
              ...(mutation.headers || {}),
            },
            body: mutation.payload ? JSON.stringify(mutation.payload) : undefined,
          });

          if (res.status === 409) {
            // Optimistic Concurrency Control Conflict detected!
            let serverData = null;
            try {
              serverData = await res.json();
            } catch (e) {
              serverData = { error: 'Version mismatch detected on server.' };
            }

            setActiveConflict({
              mutation,
              serverState: serverData.currentQuote || serverData.quote || serverData,
              clientState: mutation.payload,
            });
            // Stop replay to let user resolve
            break;
          }

          if (res.ok) {
            await removeMutation(mutation.id);
            setPendingCount((prev) => Math.max(0, prev - 1));
          } else {
            // Non-409 server error (e.g. 500 or 503) - halt replay until next sync
            console.warn(`Sync failed for ${mutation.endpoint} with status ${res.status}`);
            break;
          }
        } catch (fetchErr) {
          // Network connection drop during sync
          console.warn('Network error during offline mutation replay:', fetchErr);
          break;
        }
      }

      await refreshPendingCount();
      setLastSyncTime(Date.now());
    } catch (syncErr) {
      console.error('Error during triggerSync:', syncErr);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, activeConflict, refreshPendingCount]);

  // Conflict Resolution handler
  const resolveConflict = useCallback(
    async (decision) => {
      if (!activeConflict) return;

      const { mutation, serverState } = activeConflict;

      if (decision === 'force_client') {
        // Overwrite: re-send with updated revision or force flag
        try {
          const payloadWithServerVersion = {
            ...mutation.payload,
            version: serverState && serverState.version ? serverState.version : undefined,
            _forceOverwrite: true,
          };

          const res = await fetch(mutation.endpoint, {
            method: mutation.method,
            headers: {
              'Content-Type': 'application/json',
              ...(mutation.headers || {}),
              'x-force-overwrite': 'true',
            },
            body: JSON.stringify(payloadWithServerVersion),
          });

          if (res.ok) {
            await removeMutation(mutation.id);
            setActiveConflict(null);
            await refreshPendingCount();
            // Resume replay
            setTimeout(() => triggerSync(), 100);
            return;
          }
        } catch (err) {
          console.error('Failed to force client mutation:', err);
        }
      } else if (decision === 'accept_server') {
        // Discard local client change
        await removeMutation(mutation.id);
        setActiveConflict(null);
        await refreshPendingCount();
        // Resume replay of remaining queue
        setTimeout(() => triggerSync(), 100);
      }
    },
    [activeConflict, refreshPendingCount, triggerSync]
  );

  // Enqueue action helper
  const enqueueAction = useCallback(
    async ({
      endpoint,
      method = 'POST',
      payload = null,
      headers = {},
      entityId = null,
      entityType = 'quote',
      description = 'Commercial Mutation',
    }) => {
      const mut = await enqueueMutation({
        endpoint,
        method,
        payload,
        headers,
        entityId,
        entityType,
        description,
      });

      await refreshPendingCount();

      if (navigator.onLine && !activeConflict) {
        // Attempt immediate background sync
        triggerSync();
      }

      return mut;
    },
    [refreshPendingCount, activeConflict, triggerSync]
  );

  // Connectivity event listeners
  useEffect(() => {
    // Initial IndexedDB connection & count
    initDB()
      .then(() => refreshPendingCount())
      .catch((err) => console.warn('IndexedDB initial connection failed:', err));

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshPendingCount, triggerSync]);

  const value = {
    isOnline,
    pendingCount,
    isSyncing,
    activeConflict,
    lastSyncTime,
    enqueueAction,
    triggerSync,
    resolveConflict,
    refreshPendingCount,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
