/**
 * DealFlow360 - Native HTTP REST API Router & Request Dispatcher
 * Phase 2: REST API & Pricing Gateway
 * 
 * Provides clean, zero-dependency REST endpoints for quotations,
 * real-time pricing previews, customer tier evaluations, and approvals.
 * Enforces 1MB payload ceilings to protect against DoS attacks.
 */

import { PricingGateway } from "../services/pricing-gateway.js";
import { TierEngine } from "../domain/tier-engine.js";

const MAX_PAYLOAD_BYTES = 1048576; // 1 MB payload protection ceiling

/**
 * Parses JSON request bodies safely with size limit enforcement.
 * 
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<Object>}
 */
export function parseJsonRequestBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";
    let bytesReceived = 0;

    req.on("data", chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > MAX_PAYLOAD_BYTES) {
        const payloadError = new Error("Payload Too Large: Request body exceeds 1MB limit.");
        payloadError.statusCode = 413;
        req.destroy();
        reject(payloadError);
        return;
      }
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody || rawBody.trim().length === 0) {
        resolve({});
        return;
      }
      try {
        const parsedJson = JSON.parse(rawBody);
        resolve(parsedJson);
      } catch (parseError) {
        const syntaxError = new Error("Invalid JSON: Request body could not be parsed.");
        syntaxError.statusCode = 400;
        reject(syntaxError);
      }
    });

    req.on("error", err => reject(err));
  });
}

/**
 * Sends a standardized JSON success response.
 * 
 * @param {import('node:http').ServerResponse} res
 * @param {number} statusCode
 * @param {Object} data
 */
export function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify({ success: true, ...data }));
}

/**
 * Sends a standardized JSON error response without leaking stack traces.
 * 
 * @param {import('node:http').ServerResponse} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Object|null} [details=null]
 */
export function sendErrorResponse(res, statusCode, message, details = null) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  });
  const errorPayload = {
    success: false,
    error: message,
  };
  if (details) {
    errorPayload.details = details;
  }
  res.end(JSON.stringify(errorPayload));
}

/**
 * Creates and configures the REST API router handler.
 * 
 * @param {Object} context
 * @param {import('../services/quotation-service.js').QuotationService} context.quotationService
 * @param {Object} context.repositories
 * @returns {Function} Request handler function (req, res) => Promise<boolean>
 */
export function createApiRouter({ quotationService, repositories }) {
  const {
    customerRepository,
    productRepository,
    incentiveRuleRepository,
    warehouseRepository,
    inventoryRepository,
  } = repositories;

  return async function handleApiRequest(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = parsedUrl.pathname;
    const method = (req.method || "GET").toUpperCase();

    // 1. Health & Service Telemetry
    if (pathname === "/api/health" && method === "GET") {
      sendJsonResponse(res, 200, {
        status: "healthy",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      });
      return true;
    }

    if (pathname === "/api/info" && method === "GET") {
      sendJsonResponse(res, 200, {
        service: "DealFlow360 Autonomous Sales Operations Platform",
        version: "1.0.0",
        phase: 2,
        runtime: `Node.js ${process.version}`,
      });
      return true;
    }

    // 2. Customers Endpoints
    if (pathname === "/api/customers" && method === "GET") {
      const customers = customerRepository.findAll();
      sendJsonResponse(res, 200, { count: customers.length, customers });
      return true;
    }

    const customerMatch = pathname.match(/^\/api\/customers\/([^/]+)$/);
    if (customerMatch && method === "GET") {
      const customerId = customerMatch[1];
      const customer = customerRepository.findById(customerId);
      if (!customer) {
        sendErrorResponse(res, 404, `Customer '${customerId}' not found.`);
        return true;
      }
      sendJsonResponse(res, 200, { customer });
      return true;
    }

    const customerTierMatch = pathname.match(/^\/api\/customers\/([^/]+)\/evaluate-tier$/);
    if (customerTierMatch && method === "POST") {
      const customerId = customerTierMatch[1];
      const customer = customerRepository.findById(customerId);
      if (!customer) {
        sendErrorResponse(res, 404, `Customer '${customerId}' not found.`);
        return true;
      }
      const tierEvaluation = TierEngine.evaluateCustomerTier(customer);
      sendJsonResponse(res, 200, { customerId, tierEvaluation });
      return true;
    }

    // 3. Products Catalog Endpoints
    if (pathname === "/api/products" && method === "GET") {
      const products = productRepository.findAll();
      sendJsonResponse(res, 200, { count: products.length, products });
      return true;
    }

    if (pathname === "/api/products" && method === "POST") {
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.name || !body.category) {
          sendErrorResponse(res, 400, "Product name and category are required.");
          return true;
        }

        const sku = body.sku || `SKU-${body.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        const existingProd = productRepository.findBySku ? productRepository.findBySku(sku) : null;
        const id = body.id || (existingProd ? existingProd.id : `prod-${Date.now()}`);
        const listPriceCents = body.listPriceCents !== undefined
          ? Math.round(Number(body.listPriceCents))
          : Math.round(Number(body.listPrice || 0) * 100);
        const costPriceCents = body.costPriceCents !== undefined
          ? Math.round(Number(body.costPriceCents))
          : Math.round(Number(body.costPrice || 0) * 100);

        const newProduct = {
          id,
          sku,
          name: body.name.trim(),
          category: body.category,
          listPriceCents,
          costPriceCents,
          list_price_cents: listPriceCents,
          cost_price_cents: costPriceCents,
          minMarginFloorPct: body.minMarginFloorPct !== undefined ? Number(body.minMarginFloorPct) : 15,
          unitDescription: body.unitDescription || 'Unit',
          isSubscription: Boolean(body.isSubscription),
          is_subscription: Boolean(body.isSubscription) ? 1 : 0,
          billingFrequency: body.billingFrequency || null,
          billing_frequency: body.billingFrequency || null,
          active: body.active !== undefined ? (body.active ? 1 : 0) : 1,
          description: body.description || `${body.name} (${body.category})`,
          data_json: JSON.stringify({
            unitDescription: body.unitDescription || 'Unit',
            minMarginFloorPct: body.minMarginFloorPct !== undefined ? Number(body.minMarginFloorPct) : 15,
            leadTimeDays: body.leadTimeDays || 3,
          }),
        };

        const saved = productRepository.save(newProduct);
        sendJsonResponse(res, 201, { product: saved });
        return true;
      } catch (err) {
        sendErrorResponse(res, 400, `Failed to create product: ${err.message}`);
        return true;
      }
    }

    // 4. Incentive Rules Endpoints
    if (pathname === "/api/incentives" && method === "GET") {
      const rules = incentiveRuleRepository.findAll();
      sendJsonResponse(res, 200, { count: rules.length, rules });
      return true;
    }

    // 5. Warehouses & Inventory Endpoints
    if (pathname === "/api/warehouses" && method === "GET") {
      const warehouses = warehouseRepository.findAll();
      const rawInventory = inventoryRepository.findAll();
      const inventory = rawInventory.map((inv) => ({
        ...inv,
        atp: Math.max(0, (inv.physicalStock || 0) - (inv.reservedStock || 0) - (inv.safetyBuffer || 0)),
      }));
      sendJsonResponse(res, 200, { count: warehouses.length, warehouses, inventory });
      return true;
    }

    if (pathname === "/api/warehouses" && method === "POST") {
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.code || !body.name) {
          sendErrorResponse(res, 400, "Warehouse code and name are required.");
          return true;
        }

        const code = body.code.toUpperCase().trim();
        const existingWh = warehouseRepository.findByCode
          ? warehouseRepository.findByCode(code)
          : (warehouseRepository.findAll() || []).find((w) => w.code === code);
        const id = body.id || (existingWh ? existingWh.id : `wh-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
        const newWarehouse = {
          id,
          code: body.code.toUpperCase().trim(),
          name: body.name.trim(),
          city: body.city || body.location || 'Central Hub',
          state: body.state || 'IL',
          country: body.country || 'USA',
          isPrimaryHub: Boolean(body.isPrimaryHub),
          is_primary_hub: Boolean(body.isPrimaryHub) ? 1 : 0,
          active: body.active !== undefined ? (body.active ? 1 : 0) : 1,
          capacityUnits: body.capacityUnits ? Number(body.capacityUnits) : 50000,
          capacity_units: body.capacityUnits ? Number(body.capacityUnits) : 50000,
          safetyBuffer: body.safetyBuffer ? Number(body.safetyBuffer) : 50,
          shippingRatePerKgCents: body.shippingRatePerKgCents ? Number(body.shippingRatePerKgCents) : 150,
          data_json: JSON.stringify({
            safetyBuffer: body.safetyBuffer ? Number(body.safetyBuffer) : 50,
            shippingRatePerKgCents: body.shippingRatePerKgCents ? Number(body.shippingRatePerKgCents) : 150,
            location: body.location || `${body.city || 'Central'}, ${body.state || 'IL'}`,
          }),
        };

        const saved = warehouseRepository.save(newWarehouse);
        sendJsonResponse(res, 201, { warehouse: saved });
        return true;
      } catch (err) {
        sendErrorResponse(res, 400, `Failed to create warehouse: ${err.message}`);
        return true;
      }
    }

    // 6. Pricing Real-Time Preview
    if (pathname === "/api/pricing/preview" && method === "POST") {
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.customerId) {
          sendErrorResponse(res, 400, "customerId is required for pricing preview.");
          return true;
        }
        const customer = customerRepository.findById(body.customerId);
        if (!customer) {
          sendErrorResponse(res, 404, `Customer '${body.customerId}' not found.`);
          return true;
        }

        const categoryRules = [];
        const productCatalog = productRepository.findAll();
        const preview = PricingGateway.calculateQuotationPreview(
          body,
          customer,
          categoryRules,
          productCatalog
        );

        sendJsonResponse(res, 200, { preview });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // 7. Quotation Lifecycle Endpoints
    // Create Quote
    if (pathname === "/api/quotes" && method === "POST") {
      try {
        const body = await parseJsonRequestBody(req);
        const newQuote = quotationService.createDraftQuotation({
          salesRepId: body.salesRepId,
          salesRepName: body.salesRepName,
          customerId: body.customerId,
          validityPeriodDays: body.validityPeriodDays,
        });
        if (Array.isArray(body.lines) && body.lines.length > 0) {
          const updatedQuote = quotationService.updateQuotation(
            newQuote.id,
            { lines: body.lines },
            newQuote.version
          );
          updatedQuote.version = 1;
          quotationService.quotationRepository.save(updatedQuote);
          sendJsonResponse(res, 201, { success: true, quotation: updatedQuote });
        } else {
          sendJsonResponse(res, 201, { success: true, quotation: newQuote });
        }
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // List Quotes
    if (pathname === "/api/quotes" && method === "GET") {
      const status = parsedUrl.searchParams.get("status") || undefined;
      const customerId = parsedUrl.searchParams.get("customerId") || undefined;
      const salesRepId = parsedUrl.searchParams.get("salesRepId") || undefined;

      const quotes = quotationService.listQuotations({ status, customerId, salesRepId });
      sendJsonResponse(res, 200, { count: quotes.length, quotations: quotes });
      return true;
    }

    // Single Quote Details
    const singleQuoteMatch = pathname.match(/^\/api\/quotes\/([^/]+)$/);
    if (singleQuoteMatch && method === "GET") {
      const quoteId = singleQuoteMatch[1];
      try {
        const quotation = quotationService.getQuotationById(quoteId);
        if (quotation && quotation.lines && productRepository) {
          for (const l of quotation.lines) {
            if (!l.productName || !l.sku || !l.category) {
              const prod = productRepository.findById(l.productId);
              if (prod) {
                l.productName = l.productName || prod.name;
                l.sku = l.sku || prod.sku;
                l.category = l.category || prod.category;
                l.description = l.description || prod.description || prod.name;
              }
            }
          }
        }
        sendJsonResponse(res, 200, { quotation });
        return true;
      } catch (err) {
        const status = err.statusCode || 404;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    if (singleQuoteMatch && method === "PUT") {
      const quoteId = singleQuoteMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const updatedQuote = quotationService.updateQuotation(quoteId, body, expectedVersion);
        sendJsonResponse(res, 200, { success: true, quotation: updatedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        let currentQuote = null;
        try {
          currentQuote = quotationService.quotationRepository.findById(quoteId);
        } catch (_) {}
        sendErrorResponse(res, status, err.message, currentQuote ? { currentQuote } : null);
        return true;
      }
    }

    // Customer Portal View (Sanitized & Cloaked Proposal with zero internal cost metrics)
    const portalQuoteMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/portal$/);
    if (portalQuoteMatch && method === "GET") {
      const quoteId = portalQuoteMatch[1];
      try {
        const quotation = quotationService.getQuotationById(quoteId);
        const customer = customerRepository.findById(quotation.customerId);

        // Strip internal margins, COGS, risk score, and profit metrics before network egress
        const netTotal = quotation.netTotalCents !== undefined ? quotation.netTotalCents : quotation.totalCents;
        const subtotal = quotation.subtotalCents || 0;
        const discountTotal = quotation.discountTotalCents !== undefined ? quotation.discountTotalCents : (quotation.discountAmountCents || 0);
        const discountPct = quotation.discountPercentage !== undefined
          ? quotation.discountPercentage
          : (subtotal > 0 ? Math.round((discountTotal / subtotal) * 100) : 0);

        const sanitizedQuote = {
          id: quotation.id,
          quoteNumber: quotation.quoteNumber || quotation.id,
          customerId: quotation.customerId,
          salesRepId: quotation.salesRepId,
          status: quotation.status,
          version: quotation.version,
          subtotalCents: subtotal,
          discountAmountCents: discountTotal,
          discountTotalCents: discountTotal,
          discountPercentage: discountPct,
          discountPct: discountPct,
          taxAmountCents: quotation.taxAmountCents || 0,
          totalCents: netTotal,
          netTotalCents: netTotal,
          customerCounterNotes: quotation.customerCounterNotes || "",
          lastApprovedSnapshot: quotation.lastApprovedSnapshot
            ? {
                version: quotation.lastApprovedSnapshot.version,
                discountPercentage: quotation.lastApprovedSnapshot.discountPercentage !== undefined
                  ? quotation.lastApprovedSnapshot.discountPercentage
                  : quotation.lastApprovedSnapshot.approvedDiscountPct,
                totalCents: quotation.lastApprovedSnapshot.totalCents !== undefined
                  ? quotation.lastApprovedSnapshot.totalCents
                  : quotation.lastApprovedSnapshot.approvedNetTotalCents,
                approvedBy: quotation.lastApprovedSnapshot.approvedBy || quotation.lastApprovedSnapshot.approverName || "Management",
                approvedAt: quotation.lastApprovedSnapshot.approvedAt,
              }
            : null,
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
          expiresAt: quotation.expiresAt || quotation.validUntil,
          lines: (quotation.lines || []).map((l) => {
            const prod = productRepository ? productRepository.findById(l.productId) : null;
            const productName = l.productName || (prod ? prod.name : null) || l.description || l.productId;
            const category = l.category || (prod ? prod.category : null) || "Hardware";
            const sku = l.sku || (prod ? prod.sku : null) || l.productId;
            const description = l.description || (prod ? prod.description : null) || productName;

            return {
              id: l.id,
              productId: l.productId,
              variantId: l.variantId,
              sku,
              productName,
              description,
              quantity: l.quantity,
              listPriceCents: l.listPriceCents !== undefined ? l.listPriceCents : l.unitListPriceCents,
              unitListPriceCents: l.unitListPriceCents !== undefined ? l.unitListPriceCents : l.listPriceCents,
              discountPercentage: l.discountPercentage !== undefined ? l.discountPercentage : (l.discountPct || 0),
              discountPct: l.discountPct !== undefined ? l.discountPct : (l.discountPercentage || 0),
              netPriceCents: l.netPriceCents !== undefined ? l.netPriceCents : l.netUnitPriceCents,
              netUnitPriceCents: l.netUnitPriceCents !== undefined ? l.netUnitPriceCents : l.netPriceCents,
              lineTotalCents: l.lineTotalCents !== undefined ? l.lineTotalCents : l.lineSubtotalCents,
              lineSubtotalCents: l.lineSubtotalCents !== undefined ? l.lineSubtotalCents : l.lineTotalCents,
              category,
            };
          }),
        };

        sendJsonResponse(res, 200, {
          success: true,
          quotation: sanitizedQuote,
          customer: customer
            ? { id: customer.id, name: customer.name, tier: customer.tier }
            : { id: quotation.customerId, name: "Customer", tier: "Bronze" },
        });
        return true;
      } catch (err) {
        const status = err.statusCode || 404;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Add Line Item
    const addLineMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/lines$/);
    if (addLineMatch && method === "POST") {
      const quoteId = addLineMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const updatedQuote = quotationService.addLineItemToQuotation(quoteId, body, expectedVersion);
        sendJsonResponse(res, 200, { quotation: updatedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Update Line Item
    const updateLineMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/lines\/([^/]+)$/);
    if (updateLineMatch && method === "PUT") {
      const quoteId = updateLineMatch[1];
      const lineId = updateLineMatch[2];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const updatedQuote = quotationService.updateLineItemDetails(quoteId, lineId, body, expectedVersion);
        sendJsonResponse(res, 200, { quotation: updatedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Delete Line Item
    if (updateLineMatch && method === "DELETE") {
      const quoteId = updateLineMatch[1];
      const lineId = updateLineMatch[2];
      try {
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : undefined;

        const updatedQuote = quotationService.removeLineItemFromQuotation(quoteId, lineId, expectedVersion);
        sendJsonResponse(res, 200, { quotation: updatedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Apply Incentive Rule
    const applyIncentiveMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/incentives$/);
    if (applyIncentiveMatch && method === "POST") {
      const quoteId = applyIncentiveMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.ruleCode) {
          sendErrorResponse(res, 400, "ruleCode is required.");
          return true;
        }
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const updatedQuote = quotationService.applyHistoricalIncentiveRule(
          quoteId,
          body.ruleCode,
          expectedVersion
        );
        sendJsonResponse(res, 200, { quotation: updatedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Submit for Approval
    const submitMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/submit$/);
    if (submitMatch && method === "POST") {
      const quoteId = submitMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const submittedQuote = quotationService.submitQuotationForApproval(
          quoteId,
          body.justificationNote || "",
          expectedVersion
        );
        sendJsonResponse(res, 200, { quotation: submittedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Approve Quote
    const approveMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/approve$/);
    if (approveMatch && method === "POST") {
      const quoteId = approveMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.approverRole) {
          sendErrorResponse(res, 400, "approverRole ('SalesManager' or 'Finance') is required.");
          return true;
        }
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const approvedQuote = quotationService.approveQuotation(
          quoteId,
          {
            approverRole: body.approverRole,
            approverName: body.approverName || "Authorized Manager",
            approvalNote: body.approvalNote || "",
          },
          expectedVersion
        );
        sendJsonResponse(res, 200, { quotation: approvedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Reject & Graceful Fallback
    const rejectMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/reject$/);
    if (rejectMatch && method === "POST") {
      const quoteId = rejectMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const revertedQuote = quotationService.rejectQuotationAndFallback(
          quoteId,
          {
            approverRole: body.approverRole || "Finance",
            approverName: body.approverName || "Approver",
            rejectionReason: body.rejectionReason || "Commercial terms rejected.",
          },
          expectedVersion
        );
        sendJsonResponse(res, 200, { quotation: revertedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Customer Counter-Offer
    const counterMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/counter$/);
    if (counterMatch && method === "POST") {
      const quoteId = counterMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        if (body.requestedDiscountPercentage === undefined) {
          sendErrorResponse(res, 400, "requestedDiscountPercentage is required.");
          return true;
        }
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body.expectedVersion;

        const counterQuote = quotationService.submitCustomerCounterOffer(
          quoteId,
          {
            requestedDiscountPercentage: body.requestedDiscountPercentage,
            customerNotes: body.customerNotes || "",
          },
          expectedVersion
        );
        sendJsonResponse(res, 200, { quotation: counterQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Customer 1-Click Confirmation
    const confirmMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/confirm$/);
    if (confirmMatch && method === "POST") {
      const quoteId = confirmMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const expectedVersion = req.headers["if-match"]
          ? parseInt(req.headers["if-match"], 10)
          : body?.expectedVersion;

        const confirmedQuote = quotationService.confirmFinalQuotation(quoteId, expectedVersion);
        sendJsonResponse(res, 200, { quotation: confirmedQuote });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // 8. Commercial Negotiation Chat Endpoints (Phase 4 Real-Time & Phase 7 Portal)
    const messagesMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/messages$/);
    if (messagesMatch && method === "GET") {
      const quoteId = messagesMatch[1];
      try {
        const messages = quotationService.getNegotiationMessages(quoteId);
        sendJsonResponse(res, 200, { count: messages.length, messages });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    if (messagesMatch && method === "POST") {
      const quoteId = messagesMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
          sendErrorResponse(res, 400, "message is required and must be non-empty.");
          return true;
        }

        const messageRecord = quotationService.addNegotiationMessage({
          quoteId,
          senderId: body.senderId || "anonymous",
          senderRole: body.senderRole || "Customer",
          senderName: body.senderName || body.senderRole || "Participant",
          message: body.message,
          proposedDiscountPercent: body.proposedDiscountPercent,
        });

        sendJsonResponse(res, 201, { message: messageRecord });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // 9. Phase 8 Multi-Warehouse Split & Dispatch Endpoints
    // Get Quote Shipments & Backorders
    const quoteShipmentsMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/shipments$/);
    if (quoteShipmentsMatch && method === "GET") {
      const quoteId = quoteShipmentsMatch[1];
      try {
        const result = quotationService.getQuotationShipments(quoteId);
        sendJsonResponse(res, 200, result);
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Allocate Quote Shipments
    const quoteAllocateMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/allocate$/);
    if (quoteAllocateMatch && method === "POST") {
      const quoteId = quoteAllocateMatch[1];
      try {
        const body = await parseJsonRequestBody(req).catch(() => ({}));
        const allocation = quotationService.allocateQuotationShipments(quoteId, body);
        sendJsonResponse(res, 200, allocation);
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // List All Shipments (supports ?warehouseId= & ?status=)
    if (pathname === "/api/shipments" && method === "GET") {
      const warehouseId = parsedUrl.searchParams.get("warehouseId") || undefined;
      const status = parsedUrl.searchParams.get("status") || undefined;
      const shipments = quotationService.listAllShipments({ warehouseId, status });
      sendJsonResponse(res, 200, { count: shipments.length, shipments });
      return true;
    }

    // List All Backorders (supports ?quotationId=)
    if (pathname === "/api/backorders" && method === "GET") {
      const quotationId = parsedUrl.searchParams.get("quotationId") || undefined;
      const backorders = quotationService.listAllBackorders ? quotationService.listAllBackorders({ quotationId }) : [];
      sendJsonResponse(res, 200, { count: backorders.length, backorders });
      return true;
    }

    // Dispatch Shipment Order
    const dispatchMatch = pathname.match(/^\/api\/shipments\/([^/]+)\/dispatch$/);
    if (dispatchMatch && method === "POST") {
      const shipmentId = dispatchMatch[1];
      try {
        const body = await parseJsonRequestBody(req).catch(() => ({}));
        const updatedShipment = quotationService.dispatchShipment(shipmentId, {
          carrier: body.carrier,
          trackingNumber: body.trackingNumber,
          dispatchedBy: body.dispatchedBy,
        });
        sendJsonResponse(res, 200, { shipment: updatedShipment });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // =========================================================================
    // Phase 10: Hybrid Subscriptions & Proration Endpoints
    // =========================================================================

    // List All Subscriptions
    if (pathname === "/api/subscriptions" && method === "GET") {
      const customerId = parsedUrl.searchParams.get("customerId") || undefined;
      const status = parsedUrl.searchParams.get("status") || undefined;
      const subscriptions = quotationService.listSubscriptions({ customerId, status });
      const totalMrrCents = subscriptions.reduce((sum, s) => sum + (s.mrrCents || 0), 0);
      sendJsonResponse(res, 200, { count: subscriptions.length, totalMrrCents, subscriptions });
      return true;
    }

    // Get Subscription Detail
    const subDetailMatch = pathname.match(/^\/api\/subscriptions\/([^/]+)$/);
    if (subDetailMatch && method === "GET") {
      const subId = subDetailMatch[1];
      const subscription = quotationService.getSubscriptionById(subId);
      if (!subscription) {
        sendErrorResponse(res, 404, `Subscription '${subId}' not found.`);
        return true;
      }
      sendJsonResponse(res, 200, { subscription });
      return true;
    }

    // Standalone Mid-Cycle Proration Calculation (Simulator)
    if (pathname === "/api/subscriptions/prorate" && method === "POST") {
      try {
        const body = await parseJsonRequestBody(req);
        const { calculateProration } = await import("../domain/billing-engine.js");
        const proration = calculateProration({
          cycleStartDate: body.cycleStartDate || body.periodStartDate,
          effectiveDate: body.effectiveDate,
          cycleEndDate: body.cycleEndDate || body.periodEndDate,
          currentPriceCents: body.currentPriceCents || 0,
          newPriceCents: body.newPriceCents || body.monthlyRateCents || Math.round((body.monthlyRate || 0) * 100),
        });
        sendJsonResponse(res, 200, { proration });
        return true;
      } catch (err) {
        sendErrorResponse(res, 400, err.message);
        return true;
      }
    }

    // Calculate Mid-Cycle Proration
    const subProrateMatch = pathname.match(/^\/api\/subscriptions\/([^/]+)\/prorate$/);
    if (subProrateMatch && method === "POST") {
      const subId = subProrateMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const proration = quotationService.calculateSubscriptionProration(subId, body);
        sendJsonResponse(res, 200, { proration });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Create Subscription from Quote
    const quoteSubMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/subscriptions$/);
    if (quoteSubMatch && method === "POST") {
      const quoteId = quoteSubMatch[1];
      try {
        const body = await parseJsonRequestBody(req).catch(() => ({}));
        const contract = quotationService.createSubscriptionContract(quoteId, body);
        sendJsonResponse(res, 201, { subscription: contract });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // =========================================================================
    // Phase 10: GAAP Invoicing & Payment Reconciliation Endpoints
    // =========================================================================

    // List All Invoices
    if (pathname === "/api/invoices" && method === "GET") {
      const status = parsedUrl.searchParams.get("status") || undefined;
      const quotationId = parsedUrl.searchParams.get("quotationId") || undefined;
      const invoices = quotationService.listInvoices({ status, quotationId });
      sendJsonResponse(res, 200, { count: invoices.length, invoices });
      return true;
    }

    // Reconcile and Generate Invoice for Quote
    const invoiceReconcileMatch = pathname.match(/^\/api\/invoices\/reconcile\/([^/]+)$/);
    if (invoiceReconcileMatch && method === "POST") {
      const quoteId = invoiceReconcileMatch[1];
      try {
        const result = quotationService.reconcileInvoicesForQuotation(quoteId);
        sendJsonResponse(res, result.canGenerateInvoice ? 201 : 200, result);
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Get Invoice Detail
    const invoiceDetailMatch = pathname.match(/^\/api\/invoices\/([^/]+)$/);
    if (invoiceDetailMatch && method === "GET") {
      const invId = invoiceDetailMatch[1];
      const invoice = quotationService.getInvoiceById(invId);
      if (!invoice) {
        sendErrorResponse(res, 404, `Invoice '${invId}' not found.`);
        return true;
      }
      sendJsonResponse(res, 200, { invoice });
      return true;
    }

    // Record Invoice Payment
    const invoicePayMatch = pathname.match(/^\/api\/invoices\/([^/]+)\/payments$/);
    if (invoicePayMatch && method === "POST") {
      const invId = invoicePayMatch[1];
      try {
        const body = await parseJsonRequestBody(req);
        const result = quotationService.recordInvoicePayment(invId, {
          paymentAmountCents: body.paymentAmountCents || body.amountCents,
          paymentMethod: body.paymentMethod || "WireTransfer",
        });
        sendJsonResponse(res, 200, result);
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // =========================================================================
    // Phase 10: Deal Health & Pipeline Anomaly Surveillance Endpoints
    // =========================================================================

    // Pipeline-Wide Deal Health
    if (pathname === "/api/deal-health" && method === "GET") {
      try {
        const healthReport = quotationService.evaluatePipelineDealHealth();
        sendJsonResponse(res, 200, { report: healthReport });
        return true;
      } catch (err) {
        const status = err.statusCode || 500;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // Single Quote Deal Health
    const quoteHealthMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/deal-health$/);
    if (quoteHealthMatch && method === "GET") {
      const quoteId = quoteHealthMatch[1];
      try {
        const quoteHealth = quotationService.evaluateQuoteDealHealth(quoteId);
        sendJsonResponse(res, 200, { dealHealth: quoteHealth });
        return true;
      } catch (err) {
        const status = err.statusCode || 400;
        sendErrorResponse(res, status, err.message);
        return true;
      }
    }

    // =========================================================================
    // Database Telemetry & Live Inspector Endpoints
    // =========================================================================

    // Database Status & Table Summary
    if (pathname === "/api/database/status" && method === "GET") {
      try {
        const { inspectDatabase } = await import("../../scripts/db-inspector.js");
        const status = inspectDatabase();
        sendJsonResponse(res, 200, status || { error: "Database not found" });
        return true;
      } catch (err) {
        sendErrorResponse(res, 500, err.message);
        return true;
      }
    }

    // Table Schema & Paginated Records
    const dbTableMatch = pathname.match(/^\/api\/database\/tables\/([^/]+)$/);
    if (dbTableMatch && method === "GET") {
      const tableName = dbTableMatch[1];
      try {
        const { DatabaseSync } = await import("node:sqlite");
        const { join } = await import("node:path");
        const dbPath = join(process.cwd(), "prisma", "dev.db");
        const db = new DatabaseSync(dbPath);

        const page = Math.max(1, parseInt(parsedUrl.searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(parsedUrl.searchParams.get("limit") || "15", 10)));
        const offset = (page - 1) * limit;

        const countRow = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}";`).get();
        const columns = db.prepare(`PRAGMA table_info("${tableName}");`).all();
        const rows = db.prepare(`SELECT * FROM "${tableName}" LIMIT ? OFFSET ?;`).all(limit, offset);

        sendJsonResponse(res, 200, {
          table: tableName,
          totalRows: countRow.count,
          page,
          limit,
          totalPages: Math.ceil(countRow.count / limit),
          columns,
          rows,
        });
        return true;
      } catch (err) {
        sendErrorResponse(res, 400, `Failed to query table '${tableName}': ${err.message}`);
        return true;
      }
    }

    // =========================================================================
    // 11. Executive Analytics & Multi-Axis Reporting Engine (Section A7)
    // =========================================================================
    if (pathname === "/api/reports/analytics" && method === "GET") {
      try {
        const period = (parsedUrl.searchParams.get("period") || "all").toLowerCase();
        const salesRepId = parsedUrl.searchParams.get("salesRepId") || undefined;
        const statusFilter = parsedUrl.searchParams.get("status") || undefined;
        const categoryFilter = parsedUrl.searchParams.get("category") || undefined;

        // Fetch all quotations
        const allQuotes = quotationService.listQuotations({});
        const now = new Date();

        let minDate = null;
        if (period === "today") {
          minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === "week") {
          minDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === "month") {
          minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (period === "quarter") {
          minDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }

        const filteredQuotes = allQuotes.filter((q) => {
          if (minDate && q.createdAt) {
            const qDate = new Date(q.createdAt);
            if (qDate < minDate) return false;
          }

          if (salesRepId && salesRepId !== "all" && q.salesRepId !== salesRepId) {
            return false;
          }

          if (statusFilter && statusFilter !== "all" && q.status !== statusFilter) {
            return false;
          }

          if (categoryFilter && categoryFilter !== "all") {
            const hasCat = (q.lines || []).some(
              (l) => (l.category || "").toLowerCase() === categoryFilter.toLowerCase()
            );
            if (!hasCat) return false;
          }

          return true;
        });

        let totalRevenueCents = 0;
        let totalBookedRevenueCents = 0;
        let totalMarginCents = 0;
        let confirmedOrdersCount = 0;
        let nonDraftCount = 0;

        const byStatusMap = {};
        const byRepMap = {};
        const byCategoryMap = {
          Hardware: { category: 'Hardware', count: 0, revenueCents: 0 },
          Service: { category: 'Service', count: 0, revenueCents: 0 },
          Subscription: { category: 'Subscription', count: 0, revenueCents: 0 },
        };
        const byTierMap = {
          Bronze: { tier: 'Bronze', count: 0, revenueCents: 0 },
          Silver: { tier: 'Silver', count: 0, revenueCents: 0 },
          Gold: { tier: 'Gold', count: 0, revenueCents: 0 },
          Platinum: { tier: 'Platinum', count: 0, revenueCents: 0 },
        };

        for (const q of filteredQuotes) {
          const rev = q.netTotalCents !== undefined ? q.netTotalCents : (q.totalCents || 0);
          const margin = q.marginCents !== undefined ? q.marginCents : 0;

          totalRevenueCents += rev;
          totalMarginCents += margin;

          if (q.status === "Confirmed") {
            confirmedOrdersCount++;
            totalBookedRevenueCents += rev;
          }
          if (q.status !== "Draft") {
            nonDraftCount++;
          }

          // Status breakdown
          const st = q.status || "Unknown";
          if (!byStatusMap[st]) byStatusMap[st] = { status: st, count: 0, revenueCents: 0 };
          byStatusMap[st].count++;
          byStatusMap[st].revenueCents += rev;

          // Sales Rep breakdown
          const repId = q.salesRepId || "unassigned";
          const repName = q.salesRepName || "Unassigned Rep";
          if (!byRepMap[repId]) byRepMap[repId] = { salesRepId: repId, salesRepName: repName, count: 0, revenueCents: 0, marginCents: 0 };
          byRepMap[repId].count++;
          byRepMap[repId].revenueCents += rev;
          byRepMap[repId].marginCents += margin;

          // Category breakdown from line items
          if (q.lines && q.lines.length > 0) {
            for (const line of q.lines) {
              const cat = line.category || "Hardware";
              if (!byCategoryMap[cat]) byCategoryMap[cat] = { category: cat, count: 0, revenueCents: 0 };
              byCategoryMap[cat].count += line.quantity || 1;
              const lineRev = (line.quantity || 1) * (line.unitPriceCents || 0);
              byCategoryMap[cat].revenueCents += lineRev;
            }
          }

          // Customer Tier
          const customer = customerRepository ? customerRepository.findById(q.customerId) : null;
          const tier = customer?.tier || "Bronze";
          if (byTierMap[tier]) {
            byTierMap[tier].count++;
            byTierMap[tier].revenueCents += rev;
          }
        }

        const avgMarginPct = totalRevenueCents > 0
          ? Number(((totalMarginCents / totalRevenueCents) * 100).toFixed(1))
          : 0;

        const winRatePct = nonDraftCount > 0
          ? Number(((confirmedOrdersCount / nonDraftCount) * 100).toFixed(1))
          : 0;

        const byRepList = Object.values(byRepMap).map((r) => ({
          ...r,
          avgMarginPct: r.revenueCents > 0 ? Number(((r.marginCents / r.revenueCents) * 100).toFixed(1)) : 0,
        }));

        sendJsonResponse(res, 200, {
          filters: { period, salesRepId, status: statusFilter, category: categoryFilter },
          kpis: {
            totalQuotations: filteredQuotes.length,
            totalPipelineRevenueCents: totalRevenueCents,
            totalBookedRevenueCents,
            totalOrders: confirmedOrdersCount,
            averageMarginPct: avgMarginPct,
            winRatePct,
          },
          breakdowns: {
            byStatus: Object.values(byStatusMap),
            bySalesRep: byRepList,
            byCategory: Object.values(byCategoryMap),
            byTier: Object.values(byTierMap),
          },
          quotes: filteredQuotes.slice(0, 100).map((q) => ({
            id: q.id,
            quoteNumber: q.quoteNumber,
            customerId: q.customerId,
            salesRepName: q.salesRepName,
            status: q.status,
            netTotalCents: q.netTotalCents !== undefined ? q.netTotalCents : (q.totalCents || 0),
            marginPercentage: q.marginPercentage || 0,
            itemCount: (q.lines || []).length,
            createdAt: q.createdAt,
          })),
        });
        return true;
      } catch (err) {
        sendErrorResponse(res, 500, `Analytics calculation error: ${err.message}`);
        return true;
      }
    }

    // Native CSV Export for Admin / Reports (Direct download to Downloads folder)
    if ((pathname === "/api/reports/export/csv" || pathname === "/api/admin/export/csv") && method === "GET") {
      try {
        const period = (parsedUrl.searchParams.get("period") || "all").toLowerCase();
        const salesRepId = parsedUrl.searchParams.get("salesRepId") || undefined;
        const statusFilter = parsedUrl.searchParams.get("status") || undefined;
        const categoryFilter = parsedUrl.searchParams.get("category") || undefined;

        const allQuotes = quotationService.listQuotations({});
        const now = new Date();

        let minDate = null;
        if (period === "today") {
          minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === "week") {
          minDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (period === "month") {
          minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (period === "quarter") {
          minDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }

        let exportQuotes = allQuotes.filter((q) => {
          if (minDate && q.createdAt) {
            const qDate = new Date(q.createdAt);
            if (qDate < minDate) return false;
          }
          if (salesRepId && salesRepId !== "all" && q.salesRepId !== salesRepId) {
            return false;
          }
          if (statusFilter && statusFilter !== "all" && q.status !== statusFilter) {
            return false;
          }
          if (categoryFilter && categoryFilter !== "all") {
            const hasCat = (q.lines || []).some(
              (l) => (l.category || "").toLowerCase() === categoryFilter.toLowerCase()
            );
            if (!hasCat) return false;
          }
          return true;
        });

        // If strict filter yielded empty, fallback to all quotes so user gets populated records
        if (exportQuotes.length === 0 && allQuotes.length > 0 && period === "all") {
          exportQuotes = allQuotes;
        }

        const headers = [
          "Quote ID",
          "Quote Number",
          "Customer ID",
          "Customer Name",
          "Sales Rep",
          "Status",
          "Net Total ($)",
          "Gross Margin (%)",
          "Items Count",
          "Created At",
        ];

        const rows = exportQuotes.map((q) => {
          const cust = customerRepository ? customerRepository.findById(q.customerId) : null;
          const custName = cust ? cust.name : (q.customerId || "N/A");
          const netTotal = ((q.netTotalCents !== undefined ? q.netTotalCents : (q.totalCents || 0)) / 100).toFixed(2);
          const margin = q.marginPercentage !== undefined ? `${q.marginPercentage}%` : "0%";
          const itemCount = Array.isArray(q.lines) ? q.lines.length : 1;

          return [
            `"${q.id || ''}"`,
            `"${q.quoteNumber || q.id || ''}"`,
            `"${q.customerId || ''}"`,
            `"${custName.replace(/"/g, '""')}"`,
            `"${(q.salesRepName || q.salesRepId || 'N/A').replace(/"/g, '""')}"`,
            `"${q.status || 'Draft'}"`,
            netTotal,
            `"${margin}"`,
            itemCount,
            `"${q.createdAt || ''}"`,
          ].join(",");
        });

        const csvString = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
        const dateSlug = new Date().toISOString().slice(0, 10);
        const filename = `dealflow360_analytics_report_${dateSlug}.csv`;

        res.writeHead(200, {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": Buffer.byteLength(csvString, "utf-8"),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        });
        res.end(csvString);
        return true;
      } catch (err) {
        sendErrorResponse(res, 500, `CSV Export generation error: ${err.message}`);
        return true;
      }
    }

    // Route not handled by API
    return false;
  };
}
