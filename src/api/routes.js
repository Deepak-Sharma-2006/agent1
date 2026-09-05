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

    // 4. Incentive Rules Endpoints
    if (pathname === "/api/incentives" && method === "GET") {
      const rules = incentiveRuleRepository.findAll();
      sendJsonResponse(res, 200, { count: rules.length, rules });
      return true;
    }

    // 5. Warehouses & Inventory Endpoints
    if (pathname === "/api/warehouses" && method === "GET") {
      const warehouses = warehouseRepository.findAll();
      const inventory = inventoryRepository.findAll();
      sendJsonResponse(res, 200, { count: warehouses.length, warehouses, inventory });
      return true;
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
        sendJsonResponse(res, 201, { quotation: newQuote });
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
        sendJsonResponse(res, 200, { quotation });
        return true;
      } catch (err) {
        const status = err.statusCode || 404;
        sendErrorResponse(res, status, err.message);
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
          lines: (quotation.lines || []).map((l) => ({
            id: l.id,
            productId: l.productId,
            variantId: l.variantId,
            description: l.description || l.productName,
            productName: l.productName || l.description,
            quantity: l.quantity,
            listPriceCents: l.listPriceCents !== undefined ? l.listPriceCents : l.unitListPriceCents,
            unitListPriceCents: l.unitListPriceCents !== undefined ? l.unitListPriceCents : l.listPriceCents,
            discountPercentage: l.discountPercentage !== undefined ? l.discountPercentage : (l.discountPct || 0),
            discountPct: l.discountPct !== undefined ? l.discountPct : (l.discountPercentage || 0),
            netPriceCents: l.netPriceCents !== undefined ? l.netPriceCents : l.netUnitPriceCents,
            netUnitPriceCents: l.netUnitPriceCents !== undefined ? l.netUnitPriceCents : l.netPriceCents,
            lineTotalCents: l.lineTotalCents !== undefined ? l.lineTotalCents : l.lineSubtotalCents,
            lineSubtotalCents: l.lineSubtotalCents !== undefined ? l.lineSubtotalCents : l.lineTotalCents,
            category: l.category,
          })),
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

    // Route not handled by API
    return false;
  };
}
