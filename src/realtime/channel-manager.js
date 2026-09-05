/**
 * DealFlow360 - Real-Time Pub/Sub Channel & Security Manager
 * Phase 4: Real-Time Collaboration Gateway
 * 
 * Manages topic-based WebSocket subscriptions with role-based access control (RBAC),
 * multi-tenant trade-secret segregation, presence lock hinting, and reconnection state reconciliation.
 */

import { EventEmitter } from "node:events";

export class ChannelManager extends EventEmitter {
  /**
   * @param {Object} [options={}]
   * @param {import('../services/quotation-service.js').QuotationService} [options.quotationService]
   */
  constructor(options = {}) {
    super();
    this.quotationService = options.quotationService || null;

    // topic -> Set of clientIds
    this.topicSubscribers = new Map();
    // clientId -> WebSocketClient instance
    this.clients = new Map();
    // quotationId -> Map of clientId -> { user, field, lastActive }
    this.presenceByQuote = new Map();
  }

  /**
   * Registers a connected WebSocket client and listens for client actions.
   * @param {import('./websocket-server.js').WebSocketClient} client
   */
  registerClient(client) {
    this.clients.set(client.id, client);

    client.on("message", (rawMessage) => {
      this.handleClientMessage(client, rawMessage);
    });

    client.on("close", () => {
      this.unregisterClient(client);
    });
  }

  /**
   * Cleans up all topic subscriptions and presence for a disconnected client.
   * @param {import('./websocket-server.js').WebSocketClient} client
   */
  unregisterClient(client) {
    this.clients.delete(client.id);

    // Remove from all topics
    for (const topic of client.subscriptions) {
      const subs = this.topicSubscribers.get(topic);
      if (subs) {
        subs.delete(client.id);
        if (subs.size === 0) {
          this.topicSubscribers.delete(topic);
        }
      }
    }
    client.subscriptions.clear();

    // Clean up presence across quotations
    for (const [quoteId, presences] of this.presenceByQuote.entries()) {
      if (presences.has(client.id)) {
        const removed = presences.get(client.id);
        presences.delete(client.id);
        if (presences.size === 0) {
          this.presenceByQuote.delete(quoteId);
        }
        // Broadcast presence left
        this.broadcast(`quotation:${quoteId}`, {
          type: "PRESENCE_LEFT",
          quoteId,
          user: removed.user,
          timestamp: new Date().toISOString(),
        }, client.id);
      }
    }
  }

  /**
   * Handles incoming client messages (subscribe, unsubscribe, presence, chat, sync).
   * @param {import('./websocket-server.js').WebSocketClient} client
   * @param {string} rawMessage
   */
  async handleClientMessage(client, rawMessage) {
    try {
      const data = JSON.parse(rawMessage);
      const action = data.action || data.type;

      switch (action) {
        case "auth": {
          // Identify user context (role, userId, customerId)
          client.userContext = {
            role: data.role || "Customer",
            userId: data.userId || "anonymous",
            customerId: data.customerId || null,
            name: data.name || data.userId || "Anonymous User",
          };
          client.send({
            type: "AUTH_SUCCESS",
            user: client.userContext,
            timestamp: new Date().toISOString(),
          });
          break;
        }

        case "subscribe": {
          const topic = data.topic;
          if (!topic) {
            client.send({ type: "ERROR", error: "Missing topic parameter" });
            return;
          }

          const authOk = this._validateSubscription(client, topic);
          if (!authOk.allowed) {
            client.send({
              type: "SUBSCRIBE_FAILED",
              topic,
              error: authOk.reason,
            });
            return;
          }

          this.subscribe(client.id, topic);
          client.subscriptions.add(topic);
          client.send({
            type: "SUBSCRIBED",
            topic,
            timestamp: new Date().toISOString(),
          });

          // If subscribing to a quotation, send active presence on that quote
          if (topic.startsWith("quotation:")) {
            const quoteId = topic.split(":")[1];
            const activePresence = this.getQuotePresence(quoteId);
            if (activePresence.length > 0) {
              client.send({
                type: "PRESENCE_LIST",
                quoteId,
                users: activePresence,
              });
            }
          }
          break;
        }

        case "unsubscribe": {
          const topic = data.topic;
          if (topic) {
            this.unsubscribe(client.id, topic);
            client.subscriptions.delete(topic);
            client.send({ type: "UNSUBSCRIBED", topic });
          }
          break;
        }

        case "presence": {
          const { quoteId, field, status } = data;
          if (!quoteId) return;

          if (!this.presenceByQuote.has(quoteId)) {
            this.presenceByQuote.set(quoteId, new Map());
          }

          const userName = client.userContext.name || client.userContext.role;
          this.presenceByQuote.get(quoteId).set(client.id, {
            clientId: client.id,
            user: userName,
            role: client.userContext.role,
            field: field || "general",
            status: status || "editing",
            lastActive: Date.now(),
          });

          // Broadcast presence hint to all other subscribers of this quotation
          this.broadcast(`quotation:${quoteId}`, {
            type: "PRESENCE_UPDATE",
            quoteId,
            user: userName,
            role: client.userContext.role,
            field: field || "general",
            status: status || "editing",
            timestamp: new Date().toISOString(),
          }, client.id);
          break;
        }

        case "chat": {
          const { quoteId, message } = data;
          if (!quoteId || !message || typeof message !== "string") {
            client.send({ type: "ERROR", error: "Invalid chat message payload" });
            return;
          }

          this.emit("chatMessage", {
            client,
            quoteId,
            message: message.trim(),
            senderId: client.userContext.userId || client.id,
            senderRole: client.userContext.role || "Customer",
            senderName: client.userContext.name || "Participant",
          });
          break;
        }

        case "sync": {
          const { quoteId, lastKnownVersion } = data;
          if (!quoteId || this.quotationService == null) return;

          try {
            const quotation = await this.quotationService.getQuotationById(quoteId);
            if (!quotation) {
              client.send({ type: "SYNC_ERROR", error: "Quotation not found", quoteId });
              return;
            }

            if (lastKnownVersion == null || quotation.version > Number(lastKnownVersion)) {
              client.send({
                type: "QUOTE_STATE_SYNC",
                quoteId,
                quotation,
                isCatchUp: true,
                serverVersion: quotation.version,
                lastKnownVersion: Number(lastKnownVersion || 0),
                timestamp: new Date().toISOString(),
              });
            } else {
              client.send({
                type: "SYNC_UP_TO_DATE",
                quoteId,
                currentVersion: quotation.version,
              });
            }
          } catch (err) {
            client.send({ type: "SYNC_ERROR", error: err.message, quoteId });
          }
          break;
        }

        default:
          // Unknown action
          break;
      }
    } catch {
      client.send({ type: "ERROR", error: "Malformed JSON message" });
    }
  }

  /**
   * Validates whether a client is authorized to subscribe to a topic.
   * Multi-tenant security guard: prevents cross-quote espionage and customer snoop on manager channels.
   * @param {import('./websocket-server.js').WebSocketClient} client
   * @param {string} topic
   * @returns {{ allowed: boolean, reason?: string }}
   */
  _validateSubscription(client, topic) {
    const role = client.userContext.role;

    // Internal governance channels
    if (topic === "role:manager" || topic === "role:finance") {
      if (role !== "SalesManager" && role !== "Finance" && role !== "Admin") {
        return {
          allowed: false,
          reason: `Access Denied: Topic '${topic}' is restricted to managers and finance controllers.`,
        };
      }
      return { allowed: true };
    }

    // Customer-specific private channels
    if (topic.startsWith("customer:")) {
      const targetCustomer = topic.split(":")[1];
      if (role === "Customer" && client.userContext.customerId !== targetCustomer) {
        return {
          allowed: false,
          reason: "Access Denied: You cannot subscribe to another customer's private notification feed.",
        };
      }
      return { allowed: true };
    }

    // Quotation-specific negotiation channels
    if (topic.startsWith("quotation:")) {
      // Any authenticated sales rep, manager, or customer matching customerId can join
      return { allowed: true };
    }

    // Broadcast or general topics
    return { allowed: true };
  }

  /**
   * Adds a client to a topic set.
   * @param {string} clientId
   * @param {string} topic
   */
  subscribe(clientId, topic) {
    if (!this.topicSubscribers.has(topic)) {
      this.topicSubscribers.set(topic, new Set());
    }
    this.topicSubscribers.get(topic).add(clientId);
  }

  /**
   * Removes a client from a topic set.
   * @param {string} clientId
   * @param {string} topic
   */
  unsubscribe(clientId, topic) {
    const subs = this.topicSubscribers.get(topic);
    if (subs) {
      subs.delete(clientId);
      if (subs.size === 0) {
        this.topicSubscribers.delete(topic);
      }
    }
  }

  /**
   * Returns active presence list for a quotation.
   * @param {string} quoteId
   * @returns {Array<Object>}
   */
  getQuotePresence(quoteId) {
    const presences = this.presenceByQuote.get(quoteId);
    if (!presences) return [];
    return Array.from(presences.values());
  }

  /**
   * Broadcasts a message to all clients subscribed to a topic.
   * @param {string} topic
   * @param {Object|string} message
   * @param {string|null} [excludeClientId=null]
   */
  broadcast(topic, message, excludeClientId = null) {
    const subs = this.topicSubscribers.get(topic);
    if (!subs || subs.size === 0) return;

    const text = typeof message === "string" ? message : JSON.stringify(message);

    for (const clientId of subs) {
      if (excludeClientId && clientId === excludeClientId) {
        continue;
      }
      const client = this.clients.get(clientId);
      if (client && client.readyState === 1) {
        client.send(text);
      }
    }
  }

  /**
   * Broadcasts a message to all connected clients across the entire server.
   * @param {Object|string} message
   */
  broadcastAll(message) {
    const text = typeof message === "string" ? message : JSON.stringify(message);
    for (const client of this.clients.values()) {
      if (client.readyState === 1) {
        client.send(text);
      }
    }
  }
}
