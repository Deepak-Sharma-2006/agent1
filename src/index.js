import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";

export const defaultConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  serviceName: "dealflow360-enterprise-service",
  version: "1.0.0",
};

export function createServer(config = defaultConfig) {
  return createHttpServer((req, res) => {
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
    res.end(JSON.stringify({ error: "Not Found", path: url }));
  });
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
