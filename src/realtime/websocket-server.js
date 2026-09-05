/**
 * DealFlow360 - Native RFC 6455 WebSocket Server
 * Phase 4: Real-Time Collaboration Gateway
 * 
 * Implements a production-grade, zero-ghost-dependency WebSocket server over native
 * Node.js node:http and node:crypto modules.
 * Compliant with RFC 6455: handles handshakes, masked client frame parsing,
 * unmasked server frame serialization, ping/pong heartbeats, and backpressure protection.
 */

import { createHash, randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";

const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1 MB payload ceiling (consistent with REST DoS shield)
const MAX_BUFFER_SIZE = 256 * 1024;  // 256 KB backpressure ceiling
const HEARTBEAT_INTERVAL_MS = 30000; // 30-second ping interval

export class WebSocketClient extends EventEmitter {
  /**
   * @param {import('node:net').Socket} socket
   * @param {import('node:http').IncomingMessage} request
   */
  constructor(socket, request) {
    super();
    this.id = `ws-${Date.now()}-${randomUUID().slice(0, 8)}`;
    this.socket = socket;
    this.request = request;
    this.ip = socket.remoteAddress || "127.0.0.1";
    this.isAlive = true;
    this.readyState = 1; // 1 = OPEN, 2 = CLOSING, 3 = CLOSED
    this.buffer = Buffer.alloc(0);
    this.subscriptions = new Set();
    this.userContext = {
      role: "Guest",
      userId: null,
      customerId: null,
    };

    this._setupSocketListeners();
  }

  _setupSocketListeners() {
    this.socket.on("data", (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this._processBuffer();
    });

    this.socket.on("close", () => {
      this._handleClose(1006, "Connection dropped abruptly");
    });

    this.socket.on("error", (err) => {
      if (this.listenerCount("error") > 0) {
        this.emit("error", err);
      }
      this._handleClose(1006, err.message);
    });
  }

  _processBuffer() {
    while (this.buffer.length >= 2) {
      const firstByte = this.buffer[0];
      const secondByte = this.buffer[1];

      const fin = (firstByte & 0x80) !== 0;
      const opcode = firstByte & 0x0f;
      const isMasked = (secondByte & 0x80) !== 0;
      let payloadLength = secondByte & 0x7f;

      let offset = 2;

      // RFC 6455 Sec 5.1: Client-to-server frames MUST be masked
      if (!isMasked) {
        this.close(1002, "Protocol error: client frames must be masked");
        return;
      }

      if (payloadLength === 126) {
        if (this.buffer.length < offset + 2) return; // Wait for full header
        payloadLength = this.buffer.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        if (this.buffer.length < offset + 8) return; // Wait for full header
        const high = this.buffer.readUInt32BE(offset);
        const low = this.buffer.readUInt32BE(offset + 4);
        if (high !== 0) {
          this.close(1009, "Payload exceeds 4GB ceiling");
          return;
        }
        payloadLength = low;
        offset += 8;
      }

      if (payloadLength > MAX_PAYLOAD_SIZE) {
        this.close(1009, `Payload exceeds 1MB ceiling (${payloadLength} bytes)`);
        return;
      }

      // Check if masking key (4 bytes) and complete payload are present
      const maskKeyLength = 4;
      const totalFrameLength = offset + maskKeyLength + payloadLength;

      if (this.buffer.length < totalFrameLength) {
        return; // Wait for more chunks to arrive
      }

      const maskKey = this.buffer.subarray(offset, offset + maskKeyLength);
      offset += maskKeyLength;

      const rawPayload = this.buffer.subarray(offset, offset + payloadLength);
      const unmaskedPayload = Buffer.allocUnsafe(payloadLength);

      for (let i = 0; i < payloadLength; i++) {
        unmaskedPayload[i] = rawPayload[i] ^ maskKey[i % 4];
      }

      // Advance buffer past this frame
      this.buffer = this.buffer.subarray(totalFrameLength);

      // Handle Opcode
      this._handleFrame(opcode, unmaskedPayload);
    }
  }

  _handleFrame(opcode, payload) {
    switch (opcode) {
      case 0x1: { // Text frame
        const text = payload.toString("utf-8");
        this.emit("message", text);
        break;
      }
      case 0x2: { // Binary frame
        this.emit("binary", payload);
        break;
      }
      case 0x8: { // Close frame
        let code = 1000;
        let reason = "Normal Closure";
        if (payload.length >= 2) {
          code = payload.readUInt16BE(0);
          reason = payload.subarray(2).toString("utf-8");
        }
        if (this.readyState === 1) {
          this._sendFrame(0x08, payload);
        }
        this._handleClose(code, reason);
        break;
      }
      case 0x9: { // Ping frame -> Respond with Pong (Opcode 0xA)
        this.isAlive = true;
        this._sendFrame(0x0a, payload);
        break;
      }
      case 0xa: { // Pong frame
        this.isAlive = true;
        break;
      }
      default:
        // Ignore unsupported opcodes or extensions
        break;
    }
  }

  /**
   * Sends a JSON or text message to the client.
   * @param {string|Object} message
   * @returns {boolean}
   */
  send(message) {
    if (this.readyState !== 1) return false;

    // Backpressure protection: avoid unbounded memory buffering on slow consumers
    if (this.socket.bufferSize > MAX_BUFFER_SIZE) {
      this.close(1008, "Policy violation: socket backpressure exceeded 256KB");
      return false;
    }

    const text = typeof message === "string" ? message : JSON.stringify(message);
    const payload = Buffer.from(text, "utf-8");
    return this._sendFrame(0x01, payload);
  }

  /**
   * Encodes and transmits a WebSocket frame (Server-to-Client frames are unmasked).
   * @param {number} opcode
   * @param {Buffer} payload
   */
  _sendFrame(opcode, payload) {
    const payloadLength = payload.length;
    let headerLength = 2;

    if (payloadLength >= 65536) {
      headerLength += 8;
    } else if (payloadLength >= 126) {
      headerLength += 2;
    }

    const frame = Buffer.allocUnsafe(headerLength + payloadLength);

    // FIN = 1, RSV1-3 = 0, Opcode
    frame[0] = 0x80 | (opcode & 0x0f);

    // MASK = 0 (Server to client frames MUST NOT be masked)
    if (payloadLength >= 65536) {
      frame[1] = 127;
      frame.writeUInt32BE(0, 2);
      frame.writeUInt32BE(payloadLength, 6);
    } else if (payloadLength >= 126) {
      frame[1] = 126;
      frame.writeUInt16BE(payloadLength, 2);
    } else {
      frame[1] = payloadLength;
    }

    payload.copy(frame, headerLength);

    try {
      return this.socket.write(frame);
    } catch {
      this._handleClose(1006, "Socket write failure");
      return false;
    }
  }

  /**
   * Sends a heartbeat Ping to the client.
   */
  ping() {
    if (this.readyState === 1) {
      this.isAlive = false;
      this._sendFrame(0x09, Buffer.alloc(0));
    }
  }

  /**
   * Initiates graceful closing handshake.
   * @param {number} [code=1000]
   * @param {string} [reason=""]
   */
  close(code = 1000, reason = "") {
    if (this.readyState === 3) return;

    this.readyState = 2; // CLOSING
    const reasonBuffer = Buffer.from(reason, "utf-8");
    const payload = Buffer.allocUnsafe(2 + reasonBuffer.length);
    payload.writeUInt16BE(code, 0);
    reasonBuffer.copy(payload, 2);

    this._sendFrame(0x08, payload);

    if (this.socket && !this.socket.destroyed) {
      this.socket.end();
    }
    this._handleClose(code, reason);
  }

  _handleClose(code, reason) {
    if (this.readyState === 3) return;
    this.readyState = 3; // CLOSED
    this.emit("close", code, reason);
    if (this.socket && !this.socket.destroyed) {
      this.socket.destroy();
    }
  }
}

export class NativeWebSocketServer extends EventEmitter {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.path="/ws"]
   */
  constructor(options = {}) {
    super();
    this.path = options.path || "/ws";
    this.clients = new Map();
    this.pingInterval = null;

    this._startHeartbeat();
  }

  /**
   * Attaches the WebSocket server to an existing Node.js HTTP server.
   * @param {import('node:http').Server} httpServer
   */
  attach(httpServer) {
    httpServer.on("upgrade", (req, socket, head) => {
      this.handleUpgrade(req, socket, head);
    });

    httpServer.on("close", () => {
      this.close();
    });
  }

  /**
   * Handles incoming HTTP Upgrade requests.
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:net').Socket} socket
   * @param {Buffer} head
   */
  handleUpgrade(req, socket, head) {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname !== this.path) {
      // Not our WebSocket endpoint
      socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    const upgradeHeader = req.headers["upgrade"];
    const connectionHeader = req.headers["connection"];
    const key = req.headers["sec-websocket-key"];
    const version = req.headers["sec-websocket-version"];

    if (
      !upgradeHeader ||
      upgradeHeader.toLowerCase() !== "websocket" ||
      !connectionHeader ||
      !connectionHeader.toLowerCase().includes("upgrade") ||
      !key ||
      version !== "13"
    ) {
      socket.write("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    // Generate Sec-WebSocket-Accept
    const acceptKey = createHash("sha1")
      .update(key + WS_GUID)
      .digest("base64");

    const responseHeaders = [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptKey}`,
      "\r\n",
    ];

    socket.write(responseHeaders.join("\r\n"));

    const client = new WebSocketClient(socket, req);
    this.clients.set(client.id, client);

    client.on("error", () => {});
    client.on("close", () => {
      this.clients.delete(client.id);
    });

    if (head && head.length > 0) {
      client.buffer = Buffer.concat([client.buffer, head]);
      client._processBuffer();
    }

    this.emit("connection", client, req);
  }

  _startHeartbeat() {
    this.pingInterval = setInterval(() => {
      for (const client of this.clients.values()) {
        if (!client.isAlive) {
          // Client failed to pong back within heartbeat window
          client.close(1006, "Heartbeat timeout (dead connection)");
          continue;
        }
        client.ping();
      }
    }, HEARTBEAT_INTERVAL_MS);

    if (this.pingInterval.unref) {
      this.pingInterval.unref();
    }
  }

  /**
   * Broadcasts a message to all connected clients.
   * @param {string|Object} message
   */
  broadcastAll(message) {
    const text = typeof message === "string" ? message : JSON.stringify(message);
    for (const client of this.clients.values()) {
      if (client.readyState === 1) {
        client.send(text);
      }
    }
  }

  /**
   * Closes all active client connections and stops the heartbeat timer.
   */
  close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    for (const client of this.clients.values()) {
      client.close(1001, "Server shutting down");
    }
    this.clients.clear();
  }
}
