import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { getRepositories } from "./db/database-factory.js";
import { QuotationService } from "./services/quotation-service.js";
import { createApiRouter } from "./api/routes.js";
import { NativeWebSocketServer, ChannelManager, EventBroadcaster } from "./realtime/index.js";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

export const defaultConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  serviceName: "dealflow360-enterprise-service",
  version: "1.0.0",
};

/**
 * Creates the DealFlow360 HTTP server with REST API and Real-Time WebSocket Gateway mounted.
 * 
 * @param {Object} [config=defaultConfig]
 * @param {Object|null} [customDependencies=null]
 * @returns {import('node:http').Server}
 */
export function createServer(config = defaultConfig, customDependencies = null) {
  let apiRouter;
  let quotationService;
  let repositories;
  let channelManager;
  let eventBroadcaster;
  let wsServer;

  if (customDependencies) {
    quotationService = customDependencies.quotationService;
    repositories = customDependencies.repositories;
    channelManager = customDependencies.channelManager || new ChannelManager({ quotationService });
    eventBroadcaster = customDependencies.eventBroadcaster || new EventBroadcaster(channelManager);
    wsServer = customDependencies.wsServer || new NativeWebSocketServer({ path: "/ws" });
    apiRouter = createApiRouter({ quotationService, repositories });
  } else {
    const provider = process.env.DB_PROVIDER || "sqlite";
    repositories = getRepositories(provider);

    channelManager = new ChannelManager();
    eventBroadcaster = new EventBroadcaster(channelManager);
    wsServer = new NativeWebSocketServer({ path: "/ws" });

    quotationService = new QuotationService({
      quotationRepository: repositories.quotationRepository,
      customerRepository: repositories.customerRepository,
      productRepository: repositories.productRepository,
      incentiveRuleRepository: repositories.incentiveRuleRepository,
      inventoryRepository: repositories.inventoryRepository,
      warehouseRepository: repositories.warehouseRepository,
      shipmentRepository: repositories.shipmentRepository,
      backorderRepository: repositories.backorderRepository,
      subscriptionRepository: repositories.subscriptionRepository,
      invoiceRepository: repositories.invoiceRepository,
      eventBroadcaster,
      database: repositories.database || null,
    });

    channelManager.quotationService = quotationService;
    apiRouter = createApiRouter({ quotationService, repositories });
  }

  // Handle client connections and wire real-time events
  wsServer.on("connection", (client) => {
    channelManager.registerClient(client);
  });

  channelManager.on("chatMessage", (data) => {
    try {
      quotationService.addNegotiationMessage({
        quoteId: data.quoteId,
        senderId: data.senderId,
        senderRole: data.senderRole,
        senderName: data.senderName,
        message: data.message,
      });
    } catch (err) {
      if (data.client && data.client.readyState === 1) {
        data.client.send({
          type: "ERROR",
          error: `Chat persistence error: ${err.message}`,
        });
      }
    }
  });

  const server = createHttpServer(async (req, res) => {
    try {
      const handled = await apiRouter(req, res);
      if (handled) return;

      const url = req.url || "/";

      if (url === "/health" || url === "/api/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "healthy",
            uptimeSeconds: Math.floor(process.uptime()),
            service: config.serviceName,
            version: config.version,
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      if (url === "/api/info") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            service: config.serviceName,
            version: config.version,
            environment: config.environment,
            engine: `Node.js ${process.version}`,
          })
        );
        return;
      }

      const pathname = url.split("?")[0];

      // WebSocket endpoint requires upgrade header; standard HTTP request returns 400
      if (pathname === "/ws" || pathname.startsWith("/ws/")) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "WebSocket upgrade required" }));
        return;
      }

      // Static Asset & SPA Fallback Serving
      if (req.method === "GET" || req.method === "HEAD") {
        const distDir = resolve(process.cwd(), "dist");
        const clientPublicDir = resolve(process.cwd(), "client", "public");

        // Helper to determine if file is PWA service worker or manifest
        const getPwaCacheHeader = (filePath, ext) => {
          const fileName = filePath.split(/[\/\\]/).pop().toLowerCase();
          if (ext === ".html" || fileName === "sw.js" || fileName === "manifest.json" || ext === ".webmanifest") {
            return "no-cache, no-store, must-revalidate";
          }
          return "public, max-age=31536000, immutable";
        };

        // 1. Check dist directory
        if (existsSync(distDir)) {
          let filePath = resolve(distDir, pathname.replace(/^\//, ""));

          if (filePath.startsWith(distDir) && existsSync(filePath) && statSync(filePath).isFile()) {
            const ext = extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || "application/octet-stream";
            res.writeHead(200, {
              "Content-Type": contentType,
              "Cache-Control": getPwaCacheHeader(filePath, ext),
            });
            if (req.method === "HEAD") {
              res.end();
            } else {
              createReadStream(filePath).pipe(res);
            }
            return;
          }

          // SPA Fallback for client-side routing
          const indexPath = join(distDir, "index.html");
          if (!pathname.startsWith("/api") && !extname(pathname) && existsSync(indexPath)) {
            res.writeHead(200, {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            });
            if (req.method === "HEAD") {
              res.end();
            } else {
              createReadStream(indexPath).pipe(res);
            }
            return;
          }
        }

        // 2. Fallback check in client/public for development mode assets (e.g. sw.js, manifest.json)
        if (existsSync(clientPublicDir)) {
          let publicFilePath = resolve(clientPublicDir, pathname.replace(/^\//, ""));
          if (publicFilePath.startsWith(clientPublicDir) && existsSync(publicFilePath) && statSync(publicFilePath).isFile()) {
            const ext = extname(publicFilePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || "application/octet-stream";
            res.writeHead(200, {
              "Content-Type": contentType,
              "Cache-Control": getPwaCacheHeader(publicFilePath, ext),
            });
            if (req.method === "HEAD") {
              res.end();
            } else {
              createReadStream(publicFilePath).pipe(res);
            }
            return;
          }
        }
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Not Found", path: url }));
    } catch (unexpectedError) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Internal Server Error" }));
      }
    }
  });

  // Attach WebSocket Server to the HTTP Server instance
  wsServer.attach(server);

  server.repositories = repositories;
  server.quotationService = quotationService;
  server.channelManager = channelManager;
  server.eventBroadcaster = eventBroadcaster;
  server.wsServer = wsServer;

  return server;
}

/**
 * Accessor for the real-time gateway components mounted on the server.
 * @param {import('node:http').Server} server
 * @returns {{ wsServer: NativeWebSocketServer, channelManager: ChannelManager, eventBroadcaster: EventBroadcaster }}
 */
export function getRealtimeGateway(server) {
  return {
    wsServer: server.wsServer,
    channelManager: server.channelManager,
    eventBroadcaster: server.eventBroadcaster,
  };
}

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("index.js")
);

if (isMain) {
  const server = createServer();
  server.listen(defaultConfig.port, () => {
    console.log(`🚀 [Server Bootstrapped] ${defaultConfig.serviceName} v${defaultConfig.version} listening on port ${defaultConfig.port} (${defaultConfig.environment})`);
  });
}

