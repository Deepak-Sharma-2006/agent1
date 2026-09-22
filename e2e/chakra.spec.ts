import { test, expect } from "@playwright/test";

test.describe("Project CHAKRA: Comprehensive Maximum-Accuracy E2E Suite", () => {
  test("Full Elemental & Architectural Verification: All 5 Stages, 5-Tier RBAC, and Invariants", async ({ page }) => {
    // 1. Capture all browser console messages
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 2. Navigate to CHAKRA Operations Dashboard
    const response = await page.goto("http://localhost:5173/");
    expect(response?.status()).toBe(200);

    // Wait for the application to be fully loaded
    await page.waitForSelector(".gov-brand-header");

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 1: National Header, MHA Branding & GIGW Standards
    // -------------------------------------------------------------------------
    await expect(page).toHaveTitle(/Project CHAKRA/);
    await expect(page.locator(".gov-national-strip")).toBeVisible();
    await expect(page.locator("text=भारत सरकार | Government of India")).toBeVisible();
    await expect(page.locator("text=गृह मंत्रालय | Ministry of Home Affairs")).toBeVisible();
    await expect(page.locator("text=SAHYOG API v2: CONNECTED (TLS 1.3)")).toBeVisible();
    await expect(page.locator("text=FIU-IND CASP Gateway: ONLINE")).toBeVisible();
    await expect(page.locator("text=भारतीय साइबर अपराध समन्वय केंद्र (I4C)")).toBeVisible();
    await expect(page.locator("text=CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE")).toBeVisible();

    // Verify Official Full Form of CHAKRA (Crypto Hop Analytics & Knowledge for Rapid Attribution)
    await expect(page.locator("text=Crypto Hop Analytics & Knowledge for Rapid Attribution")).toBeVisible();

    // Verify Official Seamless MHA Logo
    const mhaLogo = page.locator('img[src="/mha_logo.png"]');
    await expect(mhaLogo).toBeVisible();

    // Verify Telemetry Status Bar (Deduplicated, zero repetition of FIR/NCRP in header)
    const statusBar = page.locator(".gov-status-bar");
    await expect(statusBar.locator("text=OPERATIONAL DESK:")).toBeVisible();
    await expect(statusBar.locator("text=CYBER CRIME INVESTIGATION DESK (IO / CCPS)")).toBeVisible();
    await expect(statusBar.locator("text=SOVEREIGN ENGINE: DEGREE-BOUNDED BEAM SEARCH")).toBeVisible();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 2: 5-Stage Navigation Bar Structure (Zero Scrollbar Grid)
    // -------------------------------------------------------------------------
    const navBar = page.locator(".gov-navigation-bar");
    await expect(navBar).toBeVisible();
    const isOverflowing = await navBar.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(isOverflowing).toBe(false);

    const tabIntake = page.locator("#tab-stage-intake");
    const tabGraph = page.locator("#tab-stage-graph");
    const tabSweep = page.locator("#tab-stage-sweep");
    const tabScoring = page.locator("#tab-stage-scoring");
    const tabStatutory = page.locator("#tab-stage-statutory");

    await expect(tabIntake).toBeVisible();
    await expect(tabGraph).toBeVisible();
    await expect(tabSweep).toBeVisible();
    await expect(tabScoring).toBeVisible();
    await expect(tabStatutory).toBeVisible();

    // Verify Strict Initial Stage Gating: Only Stage 1 is unlocked initially
    await expect(tabIntake).toBeEnabled();
    await expect(tabGraph).toBeDisabled();
    await expect(tabSweep).toBeDisabled();
    await expect(tabScoring).toBeDisabled();
    await expect(tabStatutory).toBeDisabled();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 3: Statutory RBAC Matrix & Fixed IO Persona Highlighting
    // -------------------------------------------------------------------------
    const rbacBadgeBtn = page.locator(".gov-rbac-badge-btn");
    await expect(rbacBadgeBtn).toBeVisible();
    await expect(rbacBadgeBtn).toContainText("INVESTIGATING_OFFICER");
    await expect(rbacBadgeBtn).toContainText("Insp. Rajesh Kumar");
    await rbacBadgeBtn.click();

    // Verify Modal Header & Active Session Banner
    await expect(page.locator("text=Statutory Role-Based Access Control (RBAC) Matrix")).toBeVisible();
    await expect(page.locator("text=Current Authenticated Sovereign Session")).toBeVisible();
    await expect(page.getByText("Insp. Rajesh Kumar", { exact: true })).toBeVisible();
    await expect(page.locator("text=IND-POL-DEL-4012")).toBeVisible();
    await expect(page.locator("text=CLASS-3 DSC ATTACHED")).toBeVisible();
    await expect(page.locator("text=mTLS Handshake Verified")).toBeVisible();

    // Verify Designated IO Role Highlighting & Non-Switchable Matrix
    await expect(page.locator("text=★ DESIGNATED OPERATIONAL DESK (CHAKRA MVP)")).toBeVisible();
    await expect(page.getByRole("cell", { name: "Investigating Officer (IO / SHO)" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Supervisory Officer (DySP /" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Forensic Examiner (NCFL /" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Cyber Threat Analyst (TAU /" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "VASP Nodal Compliance" })).toBeVisible();

    // Close RBAC Console Modal and verify role remains anchored to Investigating Officer
    await page.locator("button:has-text('Close RBAC Console')").click();
    await expect(rbacBadgeBtn).toContainText("INVESTIGATING_OFFICER");
    await expect(rbacBadgeBtn).toContainText("Insp. Rajesh Kumar");

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 4: Stage 1 - Case Intake & NCRP Incident Docket
    // -------------------------------------------------------------------------
    await tabIntake.click();
    await expect(page.locator("text=Case Intake & Intelligence Ingestion")).toBeVisible();
    await expect(page.locator("text=NCRP / 1930 PORTAL INTEGRATED")).toBeVisible();

    // Verify Active Incident Docket Quick-Dispatch Bar
    await expect(page.locator(".gov-active-docket-bar")).toBeVisible();
    await expect(page.locator("text=ACTIVE INCIDENT DOCKET")).toBeVisible();

    // Verify Balanced 2-Column Workstation
    await expect(page.locator(".chakra-intake-two-column")).toBeVisible();
    await expect(page.locator("text=Target Suspect Address & Algorithmic Attribution Engine")).toBeVisible();

    // Verify Preset Selection
    const scenarioSelect = page.locator("select.gov-select").first();
    await expect(scenarioSelect).toBeVisible();
    await expect(page.locator("text=FIR NO: FIR-2026-BLR-CY-00412")).toBeVisible();

    // Verify Wallet Input & Chain Select
    const walletInput = page.locator("input.gov-input-mono");
    await expect(walletInput).toBeVisible();
    await expect(walletInput).toHaveValue("TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f");

    // Verify Sliders
    await expect(page.locator("text=Degree-Bounded Beam Search Parameters")).toBeVisible();
    await expect(page.locator("text=Max Graph Traversal Depth:")).toBeVisible();
    await expect(page.locator("text=Dust Filter Floor Threshold:")).toBeVisible();

    // Verify Ad-Hoc Calldata Ingestion Modal Trigger (Zero SIH/Jury wording)
    const adHocBtn = page.locator("button:has-text('Ad-Hoc Intelligence & Offline Calldata Ingestion Console')");
    await expect(adHocBtn).toBeVisible();
    await adHocBtn.click();
    await expect(page.locator("text=Ad-Hoc Investigative Flow Ingestion:")).toBeVisible();
    await expect(page.locator("text=Custom Graph Injection JSON Payload:")).toBeVisible();
    await page.locator(".gov-modal-footer button:has-text('Cancel')").click();

    // Test Scenario Switching & Fraud Loss Value Injection (Ensures no '0' or HTML5 step mismatch)
    await scenarioSelect.selectOption("CASE_2_MUM_FAKE_TRADING_APP");
    await page.waitForTimeout(400);
    const fraudLossInput = page.locator("input[type='number']");
    await expect(fraudLossInput).toHaveValue("12000000");
    await expect(page.locator("text=Formatted: ₹ 1,20,00,000")).toBeVisible();

    // Switch back to Case 1
    await scenarioSelect.selectOption("CASE_1_BLR_TELEGRAM_TASK");
    await page.waitForTimeout(400);
    await expect(fraudLossInput).toHaveValue("4500000");
    await expect(page.locator("text=Formatted: ₹ 45,00,000")).toBeVisible();

    // Execute Automated Attribution and verify transition state (No validation blockage)
    const executeBtn = page.locator("button:has-text('Execute Automated Attribution')");
    await expect(executeBtn).toBeVisible();
    await executeBtn.click();
    await page.waitForTimeout(800);

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 5: Stage 2 - Multi-Chain Attribution Canvas (2-Step Synthesis)
    // -------------------------------------------------------------------------
    // Verify Stage 2 is unlocked, but Stage 3 is STILL locked (Strict linear gating)
    await expect(tabGraph).toBeEnabled();
    await expect(tabSweep).toBeDisabled();

    // Step A: Pre-Synthesis Briefing Card is visible
    const synthesizeBtn = page.locator("#btn-synthesize-graph");
    await expect(synthesizeBtn).toBeVisible();
    await expect(page.locator("text=Stage 2: Multi-Chain Attribution Canvas Awaiting Synthesis")).toBeVisible();

    // Step B: Trigger Graph Synthesis
    await synthesizeBtn.click();
    await expect(page.locator(".cytoscape-viewport-canvas")).toBeVisible();
    await expect(page.locator("text=Interactive Multi-Chain Attribution Canvas")).toBeVisible();

    // Verify Stage 2 Interactive Controls ("Trace Fund Flow", Focus VASP, Critical Path)
    const traceFundFlowBtn = page.locator("#btn-trace-fund-flow");
    await expect(traceFundFlowBtn).toBeVisible();
    await expect(traceFundFlowBtn).toContainText("Trace Fund Flow");
    const focusVaspBtn = page.locator("button:has-text('Focus VASP')");
    await expect(focusVaspBtn).toBeVisible();
    const filterBtn = page.locator("button:has-text('Critical Path')");
    await expect(filterBtn).toBeVisible();

    // Click Trace Fund Flow and verify telemetry strip activation
    await traceFundFlowBtn.click();
    await expect(page.locator("text=⚡ [Step 1/4]")).toBeVisible();

    await expect(page.getByText("Suspect Seed", { exact: true })).toBeVisible();
    await expect(page.getByText("Unhosted Mule", { exact: true })).toBeVisible();
    await expect(page.getByText("Candidate Deposit", { exact: true })).toBeVisible();
    await expect(page.getByText("VASP Hot Storage", { exact: true })).toBeVisible();
    await expect(page.getByText("Sweep Consolidation", { exact: true })).toBeVisible();

    // Verify Stage 3 is STILL locked before clicking proceed
    await expect(tabSweep).toBeDisabled();

    // Verify Stepwise Action Dock: Proceed to Stage 3
    const proceedToSweepBtn = page.locator("button:has-text('Proceed to Stage 3: Sweep Forensics & Fueler Lab')");
    await expect(proceedToSweepBtn).toBeVisible();
    await proceedToSweepBtn.click();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 6: Stage 3 - Sweep Forensics & Fueler Lab
    // -------------------------------------------------------------------------
    // Stage 3 is now unlocked, Stage 4 is STILL locked!
    await expect(tabSweep).toBeEnabled();
    await expect(tabScoring).toBeDisabled();
    await expect(page.locator("text=Stage 3: Internal VASP Sweep Forensics & Gas Fueler Analysis")).toBeVisible();
    await expect(page.locator("text=SWEEP CONSOLIDATION CONFIRMED")).toBeVisible();
    await expect(page.locator("text=Centralized Exchange Omnibus Sweep Verification Principle:")).toBeVisible();

    // Verify 4 Verification Metric Cards
    await expect(page.locator("text=Attributed Custodian (VASP)")).toBeVisible();
    await expect(page.locator("text=Balance Sweep Ratio")).toBeVisible();
    await expect(page.locator("text=Aggregation Latency")).toBeVisible();
    await expect(page.locator("text=Gas Sponsorship Status")).toBeVisible();
    await expect(page.locator("text=EXCHANGE FUELED")).toBeVisible();

    // Verify Calldata Verification Table
    await expect(page.locator("text=Custodial Chain-of-Custody Calldata Verification")).toBeVisible();
    await expect(page.locator("text=Candidate Deposit Address:")).toBeVisible();
    await expect(page.locator("text=VASP Operational Hot Wallet:")).toBeVisible();
    await expect(page.locator("text=Inbound Deposit Transaction Hash:")).toBeVisible();
    await expect(page.locator("text=Internal Sweep Transaction Hash:")).toBeVisible();
    await expect(page.locator("text=Gas Sponsor (VASP Fueler Address):")).toBeVisible();
    await expect(page.locator("text=Cryptographic Merkle Tree Evidence Root (BSA Section 63(4)):")).toBeVisible();

    // Verify Stage 4 is STILL locked before clicking proceed
    await expect(tabScoring).toBeDisabled();

    // Verify Stepwise Action Dock: Proceed to Stage 4
    const proceedToScoringBtn = page.locator("button:has-text('Proceed to Stage 4: 4-Pillar Confidence Scorer')");
    await expect(proceedToScoringBtn).toBeVisible();
    await proceedToScoringBtn.click();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 7: Stage 4 - 4-Pillar Explainable Confidence Scorer
    // -------------------------------------------------------------------------
    // Stage 4 is now unlocked, Stage 5 is locked until verified!
    await expect(tabScoring).toBeEnabled();
    await expect(page.locator("text=Stage 4: 4-Pillar Explainable Confidence Scorer")).toBeVisible();
    await expect(page.locator("text=TIER 1 (HIGH CONFIDENCE ≥ 85%)")).toBeVisible();
    await expect(page.locator("text=OUT OF 100")).toBeVisible();
    await expect(page.locator("text=STATUTORY ACTION MANDATE UNDER BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS 2023):")).toBeVisible();

    // Verify 4 Mathematical Pillar Cards
    await expect(page.locator("text=1. Infrastructure Match")).toBeVisible();
    await expect(page.locator("text=2. Sweep Consistency & Gas Fueler")).toBeVisible();
    await expect(page.locator("text=3. Proximity Decay")).toBeVisible();
    await expect(page.locator("text=4. Volume Continuity")).toBeVisible();
    await expect(page.locator("text=Judicial Admissibility & Cross-Examination Resilience (Section 63(4) BSA 2023):")).toBeVisible();

    // Verify Stepwise Action Dock: Proceed to Stage 5
    const proceedToStatutoryBtn = page.locator("button:has-text('Proceed to Stage 5: SAHYOG Sanctions & Court Docket')");
    await expect(proceedToStatutoryBtn).toBeVisible();
    await proceedToStatutoryBtn.click();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 8: Stage 5 - SAHYOG Sanctions & Court Docket (Clean UI)
    // -------------------------------------------------------------------------
    await expect(tabStatutory).toBeEnabled();

    await expect(page.locator("text=Stage 5: SAHYOG Statutory Sanctions & Court Docket")).toBeVisible();
    await expect(page.locator("text=SECTIONS 94, 106 & 107 BNSS 2023 • SEC 63 BSA 2023")).toBeVisible();
    await expect(page.locator("text=Case Docket Identifier")).toBeVisible();
    await expect(page.locator("text=Section 106 BNSS 2023 Freezing Notice")).toBeVisible();
    await expect(page.locator("text=Section 63(4) BSA 2023 Digital Evidence Certificate")).toBeVisible();

    // Verify 3 ReportLab Certified PDF Export Cards
    await expect(page.locator("text=Certified Law Enforcement Document Exports (ReportLab PDF Generation)")).toBeVisible();
    await expect(page.locator("text=Executive Attribution Dossier")).toBeVisible();
    await expect(page.locator("text=Section 94 BNSS Summons")).toBeVisible();
    await expect(page.locator("text=BSA 63(4) Evidence Certificate")).toBeVisible();

    // Verify Merkle Audit Modal Trigger
    const merkleAuditBtn = page.locator("button:has-text('Audit Cryptographic Merkle Inclusion Proof')");
    await expect(merkleAuditBtn).toBeVisible();
    await merkleAuditBtn.click();
    await expect(page.locator("text=Cryptographic Merkle State Engine & Chain-of-Custody Audit")).toBeVisible();
    await page.locator(".gov-modal-header button").click();

    // Verify Statutory Notice Modal Trigger
    const noticeModalBtn = page.locator("button:has-text('Transmit Statutory Freezing Order (SAHYOG API)')");
    await expect(noticeModalBtn).toBeVisible();
    await noticeModalBtn.click();
    await expect(page.locator("text=Statutory Intermediary Notice under Section 94 & 106/107 of BNSS, 2023")).toBeVisible();
    await page.locator(".gov-modal-header button").click();

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 9: Rule 13 Universal State Store (Zero Data Reset)
    // -------------------------------------------------------------------------
    // Cycle back to Stage 1 and assert data was preserved
    await tabIntake.click();
    await expect(page.locator("text=ACTIVE INCIDENT DOCKET")).toBeVisible();
    await expect(page.locator("text=FIR-2026-BLR-CY-00412").first()).toBeVisible();
    await expect(page.locator("text=2026-NCRP-339182").first()).toBeVisible();
    await expect(walletInput).toHaveValue("TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f");

    // -------------------------------------------------------------------------
    // ELEMENTAL VERIFICATION 10: Zero Console Errors Invariant
    // -------------------------------------------------------------------------
    expect(consoleErrors).toEqual([]);
  });
});
