/**
 * DealFlow360 - Multi-Warehouse Allocation & Splitting Engine (JavaScript Edition)
 * Phase 8: Multi-Warehouse Splitting (5+ Warehouses Allocation Engine)
 * 
 * Implements real-world enterprise B2B logistics routing:
 * - 6-Depot continental distribution network
 * - Available-to-Promise (ATP) formula: max(0, physicalStock - reservedStock - safetyBuffer)
 * - Optimal O(W * K) greedy allocation minimizing freight split packages
 * - Non-physical deliverable bypassing (Services & Subscriptions)
 * - Backorder ticket creation for stock shortfall
 */

export class WarehouseAllocationEngine {
  /**
   * Computes Available-to-Promise (ATP) for a given warehouse inventory record.
   * Enforces safety buffer invariants to prevent warehouse floor overselling.
   * 
   * @param {Object} inventory
   * @param {number} [inventory.physicalStock=0]
   * @param {number} [inventory.reservedStock=0]
   * @param {number} [inventory.safetyBuffer=0]
   * @returns {number} ATP integer units >= 0
   */
  static calculateATP(inventory) {
    if (!inventory) return 0;
    const physical = Math.max(0, inventory.physicalStock || 0);
    const reserved = Math.max(0, inventory.reservedStock || 0);
    const safety = Math.max(0, inventory.safetyBuffer || 0);
    return Math.max(0, physical - reserved - safety);
  }

  /**
   * Checks whether a product requires physical warehouse storage and freight dispatch.
   * Services and Subscriptions are purely intangible/digital deliverables.
   * 
   * @param {Object} product - Product entity or line item with category
   * @returns {boolean} True if item requires physical warehouse allocation
   */
  static isPhysicalItem(product) {
    if (!product) return true;
    const cat = (product.category || product.productCategory || '').toLowerCase();
    return cat !== 'service' && cat !== 'subscription';
  }

  /**
   * Allocates quotation lines across 5+ regional warehouses using a greedy
   * O(W * K) optimization algorithm.
   * 
   * @param {Object} quotation - Quotation entity with line items
   * @param {Array<Object>} warehouses - List of active regional warehouses
   * @param {Array<Object>} inventoryList - Complete stock inventory records
   * @param {Object} [options={}]
   * @param {string} [options.preferredWarehouseId] - Customer's regional home depot ID
   * @returns {Object} AllocationResult with split shipments and backorder tickets
   */
  static allocateQuotation(quotation, warehouses = [], inventoryList = [], options = {}) {
    if (!quotation || !Array.isArray(quotation.lines) || quotation.lines.length === 0) {
      return {
        quotationId: quotation?.id || 'unknown',
        shipments: [],
        backorders: [],
        summary: {
          totalLines: 0,
          physicalLines: 0,
          digitalLines: 0,
          totalUnitsRequested: 0,
          totalUnitsAllocated: 0,
          totalUnitsBackordered: 0,
          isFullyAllocated: true,
          totalSplits: 0,
        },
      };
    }

    // Index warehouses by ID
    const warehouseMap = new Map();
    warehouses.forEach((wh) => {
      if (wh.active !== false) {
        warehouseMap.set(wh.id, wh);
      }
    });

    // Determine primary/preferred depot
    const preferredId = options.preferredWarehouseId ||
      warehouses.find((w) => w.isPrimaryHub)?.id ||
      warehouses[0]?.id;

    // Index inventory by productId -> warehouseId -> invRecord (cloned for working ATP)
    const workingInventory = new Map(); // key: `${productId}:${warehouseId}`
    inventoryList.forEach((inv) => {
      workingInventory.set(`${inv.productId}:${inv.warehouseId}`, {
        ...inv,
        workingPhysical: inv.physicalStock || 0,
        workingReserved: inv.reservedStock || 0,
        safetyBuffer: inv.safetyBuffer || 0,
        currentATP: this.calculateATP(inv),
      });
    });

    const warehouseAllocations = new Map(); // warehouseId -> Array<{ lineId, productId, quantity, sku, productName }>
    const backorders = [];
    let physicalLinesCount = 0;
    let digitalLinesCount = 0;
    let totalRequested = 0;
    let totalAllocated = 0;
    let totalBackordered = 0;

    // Process each quotation line
    for (const line of quotation.lines) {
      totalRequested += line.quantity;

      // 1. Non-physical item bypass (Services & Subscriptions)
      if (!this.isPhysicalItem(line)) {
        digitalLinesCount++;
        continue;
      }

      physicalLinesCount++;
      let remainingToFulfill = line.quantity;

      // 2. Gather all active warehouses with inventory for this product
      const candidateDepots = [];
      for (const wh of warehouses) {
        if (wh.active === false) continue;
        const key = `${line.productId}:${wh.id}`;
        const inv = workingInventory.get(key);
        const atp = inv ? inv.currentATP : 0;
        candidateDepots.push({
          warehouse: wh,
          invKey: key,
          atp,
          isPreferred: wh.id === preferredId,
        });
      }

      // Sort candidate depots:
      // Primary/Preferred depot FIRST if it has ATP > 0;
      // Remaining depots sorted by descending ATP to minimize package count.
      candidateDepots.sort((a, b) => {
        if (a.isPreferred && a.atp > 0 && !(b.isPreferred && b.atp > 0)) return -1;
        if (b.isPreferred && b.atp > 0 && !(a.isPreferred && a.atp > 0)) return 1;
        return b.atp - a.atp;
      });

      // 3. Greedily allocate from available depots
      for (const candidate of candidateDepots) {
        if (remainingToFulfill <= 0) break;
        if (candidate.atp <= 0) continue;

        const allocQty = Math.min(candidate.atp, remainingToFulfill);
        if (allocQty > 0) {
          const whId = candidate.warehouse.id;
          if (!warehouseAllocations.has(whId)) {
            warehouseAllocations.set(whId, []);
          }

          warehouseAllocations.get(whId).push({
            quotationLineId: line.id,
            productId: line.productId,
            productName: line.productName || line.name || line.productId,
            sku: line.sku || line.productSku || 'SKU-GEN',
            quantity: allocQty,
            unitListPriceCents: line.listPriceCents || line.unitListPriceCents || 0,
            unitCostPriceCents: line.costPriceCents || line.unitCostPriceCents || 0,
          });

          // Deduct from working ATP and increment working reserved
          const invRecord = workingInventory.get(candidate.invKey);
          if (invRecord) {
            invRecord.workingReserved += allocQty;
            invRecord.currentATP = Math.max(
              0,
              invRecord.workingPhysical - invRecord.workingReserved - invRecord.safetyBuffer
            );
          }

          remainingToFulfill -= allocQty;
          totalAllocated += allocQty;
        }
      }

      // 4. If aggregate network ATP is exhausted, issue Backorder Ticket
      if (remainingToFulfill > 0) {
        backorders.push({
          id: `bo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          quotationId: quotation.id,
          quotationLineId: line.id,
          productId: line.productId,
          productName: line.productName || line.productId,
          sku: line.sku || line.productSku || 'SKU-GEN',
          quantity: remainingToFulfill,
          status: 'Pending',
          reason: 'Aggregate network ATP exhausted across all regional fulfillment centers.',
          estimatedLeadDays: 14,
          createdAt: new Date().toISOString(),
        });
        totalBackordered += remainingToFulfill;
      }
    }

    // 5. Build structured ShipmentOrder manifests
    const shipments = [];
    for (const [whId, items] of warehouseAllocations.entries()) {
      const wh = warehouseMap.get(whId);
      const totalUnitsInShipment = items.reduce((sum, item) => sum + item.quantity, 0);

      // Default carrier selection based on region/capacity
      let defaultCarrier = 'FedEx Priority Ground';
      if (wh?.code === 'WH-DFW') defaultCarrier = 'UPS Freight Regional';
      if (wh?.code === 'WH-RNO') defaultCarrier = 'OnTrac Pacific West';
      if (wh?.code === 'WH-EWR') defaultCarrier = 'Eastern Express Logistics';
      if (totalUnitsInShipment > 50) defaultCarrier = 'FreightDirect Heavy Haul';

      shipments.push({
        id: `ship-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        quotationId: quotation.id,
        quoteNumber: quotation.quoteNumber || quotation.id,
        warehouseId: whId,
        warehouseCode: wh?.code || whId,
        warehouseName: wh?.name || whId,
        city: wh?.city || 'Chicago',
        state: wh?.state || 'IL',
        status: 'Placed',
        carrier: defaultCarrier,
        trackingNumber: null,
        totalUnits: totalUnitsInShipment,
        items,
        shippedAt: null,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      quotationId: quotation.id,
      shipments,
      backorders,
      summary: {
        totalLines: quotation.lines.length,
        physicalLines: physicalLinesCount,
        digitalLines: digitalLinesCount,
        totalUnitsRequested: totalRequested,
        totalUnitsAllocated: totalAllocated,
        totalUnitsBackordered: totalBackordered,
        isFullyAllocated: totalBackordered === 0,
        totalSplits: shipments.length,
      },
    };
  }
}
