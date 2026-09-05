import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/index.js";
import { seedDatabase } from "../src/db/seed.js";

/**
 * Promisified helper to wait for a WebSocket message matching a predicate.
 * @param {WebSocket} ws
 * @param {(data: Object) => boolean} predicate
 * @param {number} [timeoutMs=3000]
 * @returns {Promise<Object>}
 */
function waitForMessage(ws, predicate, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.removeEventListener("message", onMsg);
      reject(new Error(`Timeout (${timeoutMs}ms) waiting for WebSocket message`));
    }, timeoutMs);
    if (timer.unref) timer.unref();

    function onMsg(event) {
      try {
        const data = JSON.parse(event.data);
        if (predicate(data)) {
          clearTimeout(timer);
          ws.removeEventListener("message", onMsg);
          resolve(data);
        }
      } catch {
        // Ignore unparseable frames
      }
    }

    ws.addEventListener("message", onMsg);
  });
}

/**
 * Promisified helper to open a WebSocket connection.
 * @param {string} url
 * @returns {Promise<WebSocket>}
 */
function connectWebSocket(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const timer = setTimeout(() => {
      try { ws.close(); } catch {}
      reject(new Error("WebSocket connection timeout"));
    }, 3000);
    if (timer.unref) timer.unref();

    ws.onopen = () => {
      clearTimeout(timer);
      resolve(ws);
    };
    ws.onerror = (err) => {
      clearTimeout(timer);
      reject(new Error(err?.message || "WebSocket connection failed"));
    };
    ws.onclose = (event) => {
      if (event.code !== 1000) {
        clearTimeout(timer);
        reject(new Error(`WebSocket connection closed with code ${event.code}`));
      }
    };
  });
}

/**
 * Safely closes a client WebSocket and awaits closure.
 * @param {WebSocket} ws
 * @returns {Promise<void>}
 */
function closeWebSocket(ws) {
  return new Promise((resolve) => {
    if (!ws || ws.readyState === 3) {
      resolve();
      return;
    }
    ws.onclose = () => resolve();
    try { ws.close(); } catch { resolve(); }
    const fallback = setTimeout(resolve, 100);
    if (fallback.unref) fallback.unref();
  });
}

/**
 * Helper to make HTTP requests using native fetch.
 * @param {string} baseUrl
 * @param {string} path
 * @param {RequestInit} [options={}]
 */
async function apiRequest(baseUrl, path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  return { status: response.status, headers: response.headers, body };
}

test("Phase 4: Real-Time Collaboration Gateway (WebSocket Pub/Sub Engine)", async (t) => {
  let server;
  let baseUrl;
  let wsUrl;

  t.before(async () => {
    seedDatabase();
    server = createServer({
      port: 0,
      environment: "test",
      serviceName: "dealflow360-realtime-test",
      version: "1.0.0",
    });

    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
    wsUrl = `ws://127.0.0.1:${address.port}/ws`;
  });

  t.after(async () => {
    if (server) {
      if (server.wsServer) {
        server.wsServer.close();
      }
      if (typeof server.closeAllConnections === "function") {
        server.closeAllConnections();
      }
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // =========================================================================
  // Layer 1: Native RFC 6455 Handshake, Upgrades & Backpressure
  // =========================================================================
  await t.test("1. RFC 6455 Handshake & Connection Security", async (t) => {
    await t.test("Upgrades valid connection to 101 Switching Protocols on /ws", async () => {
      const ws = await connectWebSocket(wsUrl);
      assert.equal(ws.readyState, 1); // OPEN
      await closeWebSocket(ws);
    });

    await t.test("Rejects handshake on invalid path with 404", async () => {
      const address = server.address();
      const badWsUrl = `ws://127.0.0.1:${address.port}/unknown-path`;
      await assert.rejects(
        async () => {
          await connectWebSocket(badWsUrl);
        },
        /timeout|closed|failed|error/i
      );
    });

    await t.test("Handles standard HTTP GET on /ws gracefully with 400 Bad Request", async () => {
      const res = await apiRequest(baseUrl, "/ws", { method: "GET" });
      assert.ok(res.status === 400 || res.status === 404);
    });
  });

  // =========================================================================
  // Layer 2: Role-Guarded Subscriptions & Multi-Tenant Isolation
  // =========================================================================
  await t.test("2. Role-Guarded Subscriptions & Multi-Tenant Isolation", async (t) => {
    await t.test("Authenticates client and confirms identity", async () => {
      const ws = await connectWebSocket(wsUrl);

      const authPromise = waitForMessage(ws, (m) => m.type === "AUTH_SUCCESS");
      ws.send(JSON.stringify({
        action: "auth",
        role: "SalesRep",
        userId: "rep-007",
        name: "James Bond",
      }));

      const authMsg = await authPromise;
      assert.equal(authMsg.user.role, "SalesRep");
      assert.equal(authMsg.user.userId, "rep-007");
      await closeWebSocket(ws);
    });

    await t.test("Restricts role:manager channel from Customer clients (Access Denied)", async () => {
      const ws = await connectWebSocket(wsUrl);

      // Identify as Customer
      ws.send(JSON.stringify({ action: "auth", role: "Customer", customerId: "cust-acme-01" }));
      await waitForMessage(ws, (m) => m.type === "AUTH_SUCCESS");

      // Attempt to eavesdrop on managerial channel
      const failedPromise = waitForMessage(ws, (m) => m.type === "SUBSCRIBE_FAILED");
      ws.send(JSON.stringify({ action: "subscribe", topic: "role:manager" }));

      const failedMsg = await failedPromise;
      assert.equal(failedMsg.topic, "role:manager");
      assert.match(failedMsg.error, /restricted to managers/i);
      await closeWebSocket(ws);
    });

    await t.test("Allows SalesManager and Finance to subscribe to role:manager", async () => {
      const ws = await connectWebSocket(wsUrl);

      ws.send(JSON.stringify({ action: "auth", role: "SalesManager", userId: "mgr-101" }));
      await waitForMessage(ws, (m) => m.type === "AUTH_SUCCESS");

      const subPromise = waitForMessage(ws, (m) => m.type === "SUBSCRIBED");
      ws.send(JSON.stringify({ action: "subscribe", topic: "role:manager" }));

      const subMsg = await subPromise;
      assert.equal(subMsg.topic, "role:manager");
      await closeWebSocket(ws);
    });

    await t.test("Prevents Customer from subscribing to another customer's private feed", async () => {
      const ws = await connectWebSocket(wsUrl);

      ws.send(JSON.stringify({ action: "auth", role: "Customer", customerId: "cust-acme-01" }));
      await waitForMessage(ws, (m) => m.type === "AUTH_SUCCESS");

      // Attempt to subscribe to competitor's feed
      const failedPromise = waitForMessage(ws, (m) => m.type === "SUBSCRIBE_FAILED");
      ws.send(JSON.stringify({ action: "subscribe", topic: "customer:cust-competitor-99" }));

      const failedMsg = await failedPromise;
      assert.equal(failedMsg.topic, "customer:cust-competitor-99");
      assert.match(failedMsg.error, /another customer's private/i);
      await closeWebSocket(ws);
    });
  });

  // =========================================================================
  // Layer 3: Multi-Party Presence Locking Hints
  // =========================================================================
  await t.test("3. Multi-Party Presence Locking Hints", async (t) => {
    await t.test("Broadcasts presence updates when a user edits quotation fields", async () => {
      const wsAlice = await connectWebSocket(wsUrl);
      const wsBob = await connectWebSocket(wsUrl);

      wsAlice.send(JSON.stringify({ action: "auth", role: "SalesRep", name: "Alice" }));
      await waitForMessage(wsAlice, (m) => m.type === "AUTH_SUCCESS");
      wsAlice.send(JSON.stringify({ action: "subscribe", topic: "quotation:Q-TEST-01" }));
      await waitForMessage(wsAlice, (m) => m.type === "SUBSCRIBED");

      wsBob.send(JSON.stringify({ action: "auth", role: "Customer", name: "Bob" }));
      await waitForMessage(wsBob, (m) => m.type === "AUTH_SUCCESS");
      wsBob.send(JSON.stringify({ action: "subscribe", topic: "quotation:Q-TEST-01" }));
      await waitForMessage(wsBob, (m) => m.type === "SUBSCRIBED");

      // Alice starts editing the discount field
      const presencePromise = waitForMessage(wsBob, (m) => m.type === "PRESENCE_UPDATE");
      wsAlice.send(JSON.stringify({
        action: "presence",
        quoteId: "Q-TEST-01",
        field: "discountPercentage",
        status: "editing",
      }));

      const presence = await presencePromise;
      assert.equal(presence.quoteId, "Q-TEST-01");
      assert.equal(presence.user, "Alice");
      assert.equal(presence.field, "discountPercentage");
      assert.equal(presence.status, "editing");

      // Alice disconnects -> Bob receives PRESENCE_LEFT
      const leftPromise = waitForMessage(wsBob, (m) => m.type === "PRESENCE_LEFT");
      await closeWebSocket(wsAlice);

      const leftMsg = await leftPromise;
      assert.equal(leftMsg.quoteId, "Q-TEST-01");
      assert.equal(leftMsg.user, "Alice");

      await closeWebSocket(wsBob);
    });
  });

  // =========================================================================
  // Layer 4: Quotation Lifecycle Real-Time Broadcasts
  // =========================================================================
  await t.test("4. Lifecycle Real-Time Event Broadcasts", async (t) => {
    await t.test("Broadcasts QUOTE_UPDATED on line item additions", async () => {
      // Create quote via REST
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-john-01",
          salesRepName: "Sarah Connor",
          customerId: "cust-acme-01",
          validityPeriodDays: 30,
        }),
      });
      assert.equal(createRes.status, 201);
      const quoteId = createRes.body.quotation.id;

      // Connect WebSocket client and subscribe to quote
      const ws = await connectWebSocket(wsUrl);
      ws.send(JSON.stringify({ action: "subscribe", topic: `quotation:${quoteId}` }));
      await waitForMessage(ws, (m) => m.type === "SUBSCRIBED");

      // Add line item via REST
      const updatePromise = waitForMessage(ws, (m) => m.type === "QUOTE_UPDATED");
      const addLineRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({
          productId: "prod-srv-03",
          quantity: 2,
        }),
      });
      assert.equal(addLineRes.status, 200);

      const updateEvent = await updatePromise;
      assert.equal(updateEvent.quoteId, quoteId);
      assert.equal(updateEvent.action, "LINE_ADDED");
      assert.equal(updateEvent.linesCount, 1);
      assert.ok(updateEvent.netTotalCents > 0);
      assert.equal(updateEvent.version, 2);

      await closeWebSocket(ws);
    });

    await t.test("Broadcasts APPROVAL_REQUIRED to role:manager on discount escalation", async () => {
      // 1. Create quote
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-john-01",
          customerId: "cust-acme-01",
        }),
      });
      assert.equal(createRes.status, 201);
      const quoteId = createRes.body.quotation.id;

      // 2. Add line item with 15% discount (exceeds Rep authority 10%, requires Manager)
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({
          productId: "prod-srv-03",
          quantity: 1,
          unitDiscountPercentage: 15.0,
        }),
      });

      // 3. Connect Manager WebSocket client
      const wsManager = await connectWebSocket(wsUrl);
      wsManager.send(JSON.stringify({ action: "auth", role: "SalesManager", userId: "mgr-01" }));
      await waitForMessage(wsManager, (m) => m.type === "AUTH_SUCCESS");
      wsManager.send(JSON.stringify({ action: "subscribe", topic: "role:manager" }));
      await waitForMessage(wsManager, (m) => m.type === "SUBSCRIBED");

      // 4. Submit quote for approval
      const approvalRequiredPromise = waitForMessage(wsManager, (m) => m.type === "APPROVAL_REQUIRED");
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/submit`, {
        method: "POST",
        body: JSON.stringify({ justificationNote: "Competitive enterprise deal" }),
      });

      const alert = await approvalRequiredPromise;
      assert.equal(alert.quoteId, quoteId);
      assert.equal(alert.requiredTier, "SalesManager");
      assert.ok(alert.escalationReason);

      await closeWebSocket(wsManager);
    });

    await t.test("Broadcasts APPROVAL_GRANTED, COUNTER_OFFER_RECEIVED, and FALLBACK_REVERTED", async () => {
      // 1. Create and prepare escalated quote
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({ salesRepId: "rep-john-01", customerId: "cust-acme-01" }),
      });
      assert.equal(createRes.status, 201);
      const quoteId = createRes.body.quotation.id;

      await apiRequest(baseUrl, `/api/quotes/${quoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({ productId: "prod-srv-03", quantity: 1, unitDiscountPercentage: 15.0 }),
      });

      await apiRequest(baseUrl, `/api/quotes/${quoteId}/submit`, {
        method: "POST",
        body: JSON.stringify({ justificationNote: "Volume purchase" }),
      });

      // Connect quote observer
      const ws = await connectWebSocket(wsUrl);
      ws.send(JSON.stringify({ action: "subscribe", topic: `quotation:${quoteId}` }));
      await waitForMessage(ws, (m) => m.type === "SUBSCRIBED");

      // 2. Approve quote
      const approvedPromise = waitForMessage(ws, (m) => m.type === "APPROVAL_GRANTED");
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/approve`, {
        method: "POST",
        body: JSON.stringify({ approverRole: "SalesManager", approverName: "Chief Commander" }),
      });
      const approvedEvent = await approvedPromise;
      assert.equal(approvedEvent.status, "Approved");
      assert.equal(approvedEvent.approverRole, "SalesManager");

      // 3. Customer Counter-Offer
      const counterPromise = waitForMessage(ws, (m) => m.type === "COUNTER_OFFER_RECEIVED");
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/counter`, {
        method: "POST",
        body: JSON.stringify({ requestedDiscountPercentage: 25.0, customerNotes: "Need more budget headroom" }),
      });
      const counterEvent = await counterPromise;
      assert.equal(counterEvent.requestedDiscountPct, 25.0);

      // 4. Reject Counter-Offer and trigger Fallback Reversion
      const revertPromise = waitForMessage(ws, (m) => m.type === "FALLBACK_REVERTED");
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/reject`, {
        method: "POST",
        body: JSON.stringify({ approverRole: "Finance", rejectionReason: "Margin unviable" }),
      });
      const revertEvent = await revertPromise;
      assert.equal(revertEvent.revertedToLastApproved, true);
      assert.equal(revertEvent.status, "Approved");

      // 5. Customer 1-Click Confirm
      const confirmPromise = waitForMessage(ws, (m) => m.type === "QUOTE_CONFIRMED");
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/confirm`, { method: "POST" });
      const confirmEvent = await confirmPromise;
      assert.equal(confirmEvent.status, "Confirmed");

      await closeWebSocket(ws);
    });
  });

  // =========================================================================
  // Layer 5: Real-Time Commercial Chat & Negotiation Timeline
  // =========================================================================
  await t.test("5. Real-Time Commercial Negotiation Chat", async (t) => {
    await t.test("Transmits chat messages via WebSocket and persists in database", async () => {
      // Create quote
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({ salesRepId: "rep-john-01", customerId: "cust-acme-01" }),
      });
      assert.equal(createRes.status, 201);
      const quoteId = createRes.body.quotation.id;

      // Two users join negotiation channel
      const wsRep = await connectWebSocket(wsUrl);
      wsRep.send(JSON.stringify({ action: "auth", role: "SalesRep", name: "Rep Dave" }));
      await waitForMessage(wsRep, (m) => m.type === "AUTH_SUCCESS");
      wsRep.send(JSON.stringify({ action: "subscribe", topic: `quotation:${quoteId}` }));
      await waitForMessage(wsRep, (m) => m.type === "SUBSCRIBED");

      const wsCustomer = await connectWebSocket(wsUrl);
      wsCustomer.send(JSON.stringify({ action: "auth", role: "Customer", customerId: "cust-acme-01", name: "Client Carol" }));
      await waitForMessage(wsCustomer, (m) => m.type === "AUTH_SUCCESS");
      wsCustomer.send(JSON.stringify({ action: "subscribe", topic: `quotation:${quoteId}` }));
      await waitForMessage(wsCustomer, (m) => m.type === "SUBSCRIBED");

      // Rep receives Carol's chat message in real time
      const chatPromise = waitForMessage(wsRep, (m) => m.type === "CHAT_MESSAGE");
      wsCustomer.send(JSON.stringify({
        action: "chat",
        quoteId,
        message: "Can you provide expedited shipping if we sign this week?",
      }));

      const chatMsg = await chatPromise;
      assert.equal(chatMsg.quoteId, quoteId);
      assert.equal(chatMsg.senderRole, "Customer");
      assert.equal(chatMsg.senderName, "Client Carol");
      assert.match(chatMsg.message, /expedited shipping/);

      // Verify chat message is queryable via REST endpoint
      const listRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/messages`);
      assert.equal(listRes.status, 200);
      assert.equal(listRes.body.count, 1);
      assert.equal(listRes.body.messages[0].message, "Can you provide expedited shipping if we sign this week?");

      // Post chat message via REST -> broadcasts to WebSocket
      const restChatPromise = waitForMessage(wsCustomer, (m) => m.type === "CHAT_MESSAGE");
      const postChatRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          senderRole: "SalesRep",
          senderName: "Rep Dave",
          message: "Approved! Standard delivery upgraded to express.",
        }),
      });
      assert.equal(postChatRes.status, 201);

      const receivedViaWs = await restChatPromise;
      assert.equal(receivedViaWs.senderRole, "SalesRep");
      assert.match(receivedViaWs.message, /upgraded to express/);

      await closeWebSocket(wsRep);
      await closeWebSocket(wsCustomer);
    });
  });

  // =========================================================================
  // Layer 6: Field Sales Reconnection Catch-Up Sync
  // =========================================================================
  await t.test("6. Field Sales Reconnection Catch-Up Sync", async (t) => {
    await t.test("Synchronizes latest state when client reconnects with stale version", async () => {
      // 1. Create quote
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({ salesRepId: "rep-john-01", customerId: "cust-acme-01" }),
      });
      assert.equal(createRes.status, 201);
      const quoteId = createRes.body.quotation.id;

      // 2. Mutate to advance version
      await apiRequest(baseUrl, `/api/quotes/${quoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({ productId: "prod-srv-03", quantity: 5 }),
      });

      // 3. Connect client simulating tunnel reconnect with lastKnownVersion: 1
      const ws = await connectWebSocket(wsUrl);
      const syncPromise = waitForMessage(ws, (m) => m.type === "QUOTE_STATE_SYNC");
      ws.send(JSON.stringify({
        action: "sync",
        quoteId,
        lastKnownVersion: 1,
      }));

      const syncData = await syncPromise;
      assert.equal(syncData.quoteId, quoteId);
      assert.equal(syncData.isCatchUp, true);
      assert.equal(syncData.serverVersion, 2);
      assert.equal(syncData.quotation.lines.length, 1);

      // 4. Test when client is already up-to-date
      const upToDatePromise = waitForMessage(ws, (m) => m.type === "SYNC_UP_TO_DATE");
      ws.send(JSON.stringify({
        action: "sync",
        quoteId,
        lastKnownVersion: 2,
      }));

      const upToDate = await upToDatePromise;
      assert.equal(upToDate.quoteId, quoteId);
      assert.equal(upToDate.currentVersion, 2);

      await closeWebSocket(ws);
    });
  });
});
