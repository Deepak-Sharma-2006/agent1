import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import {
  CustomerRepository,
  ProductRepository,
  WarehouseRepository,
  InventoryRepository,
  IncentiveRuleRepository,
  DiscountRuleRepository,
  QuotationRepository,
} from "./db/memory-store.js";
import { seedDatabase } from "./db/seed.js";
import { QuotationService } from "./services/quotation-service.js";
import { createApiRouter } from "./api/routes.js";

export const defaultConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  serviceName: "dealflow360-enterprise-service",
  version: "1.0.0",
};

/**
 * Creates the DealFlow360 HTTP server with the Phase 2 REST API router mounted.
 * 
 * @param {Object} [config=defaultConfig]
 * @param {Object|null} [customDependencies=null]
 * @returns {import('node:http').Server}
 */
export function createServer(config = defaultConfig, customDependencies = null) {
  let apiRouter;
  let quotationService;
  let repositories;

  if (customDependencies) {
    quotationService = customDependencies.quotationService;
    repositories = customDependencies.repositories;
    apiRouter = createApiRouter({ quotationService, repositories });
  } else {
    seedDatabase();
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const warehouseRepository = new WarehouseRepository();
    const inventoryRepository = new InventoryRepository();
    const incentiveRuleRepository = new IncentiveRuleRepository();
    const discountRuleRepository = new DiscountRuleRepository();
    const quotationRepository = new QuotationRepository();

    repositories = {
      customerRepository,
      productRepository,
      warehouseRepository,
      inventoryRepository,
      incentiveRuleRepository,
      discountRuleRepository,
      quotationRepository,
    };

    quotationService = new QuotationService({
      quotationRepository,
      customerRepository,
      productRepository,
      incentiveRuleRepository,
      inventoryRepository,
    });

    apiRouter = createApiRouter({ quotationService, repositories });
  }

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

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Not Found", path: url }));
    } catch (unexpectedError) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Internal Server Error" }));
      }
    }
  });

  server.repositories = repositories;
  server.quotationService = quotationService;

  return server;
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

