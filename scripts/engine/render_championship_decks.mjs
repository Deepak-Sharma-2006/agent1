/**
 * Master Playwright Headless Renderer for BHEDAK and CHAKRA Decks
 * Renders at 1920x1080 with deviceScaleFactor: 2 (Ultra-Crisp 300 DPI 4K).
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getChakraSlideHTML } from './generate_chakra_slides.mjs';
import { getBhedakSlideHTML } from './generate_bhedak_slides.mjs';

const CHAKRA_OUT = path.resolve('specs/presentations/rendered/chakra');
const BHEDAK_OUT = path.resolve('specs/presentations/rendered/bhedak');

fs.mkdirSync(CHAKRA_OUT, { recursive: true });
fs.mkdirSync(BHEDAK_OUT, { recursive: true });

/**
 * Automated Layout, Typography, & Pipeline Pre-Flight Validator
 * Fails closed if any overflow, illegible typography, or missing pipeline stage is detected.
 */
async function validateSlideLayout(page, deck, slideNumber) {
  const result = await page.evaluate((info) => {
    const issues = [];
    
    // 1. Text elements font-size check
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    
    let node;
    while ((node = walker.nextNode())) {
      const tag = node.tagName.toLowerCase();
      if (['svg', 'path', 'g', 'text', 'script', 'style', 'canvas'].includes(tag) || node.ownerSVGElement) continue;
      
      // Only inspect leaf or direct text-bearing elements
      if (node.children.length === 0 && node.textContent) {
        const text = node.textContent.trim();
        if (text.length > 0) {
          const style = window.getComputedStyle(node);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize < 10.5) {
            issues.push(`Font too small (${fontSize}px < 10.5px): "${text.slice(0, 30)}" in <${tag}>`);
          }
        }
      }
      
      // Card overflow checks
      if (node.classList && (node.classList.contains('flow-node') || node.classList.contains('tech-col-card'))) {
        if (node.scrollHeight > node.clientHeight + 4) {
          issues.push(`Vertical overflow in card: scrollHeight ${node.scrollHeight}px > clientHeight ${node.clientHeight}px`);
        }
        if (node.scrollWidth > node.clientWidth + 4) {
          issues.push(`Horizontal overflow in card: scrollWidth ${node.scrollWidth}px > clientWidth ${node.clientWidth}px`);
        }
      }
    }
    
    // 2. Slide 3 Specific Structural Pipeline Assertions
    if (info.slideNumber === 3) {
      const flowNodes = document.querySelectorAll('.flow-node');
      const expectedNodes = info.deck === 'bhedak' ? 6 : 8;
      if (flowNodes.length < expectedNodes) {
        issues.push(`Missing workflow nodes: found ${flowNodes.length}, expected >= ${expectedNodes}`);
      }
      
      const bridge = document.querySelector('.flow-bridge-bar');
      if (!bridge) {
        issues.push(`Missing inter-row workflow bridge (.flow-bridge-bar)`);
      }
      
      const techCards = document.querySelectorAll('.tech-col-card');
      if (techCards.length < 4) {
        issues.push(`Missing tech stack cards: found ${techCards.length}, expected 4`);
      }
    }
    
    return {
      success: issues.length === 0,
      issues
    };
  }, { deck, slideNumber });

  if (!result.success) {
    console.error(`[Pre-Flight Error] Slide layout validation failed for ${deck.toUpperCase()} Slide ${slideNumber}:`);
    result.issues.forEach(issue => console.error(`  - ❌ ${issue}`));
    throw new Error(`Pre-flight layout validation failed for ${deck.toUpperCase()} Slide ${slideNumber}`);
  } else {
    console.log(`[Pre-Flight PASS] ${deck.toUpperCase()} Slide ${slideNumber} passed geometry, typography, and pipeline assertions.`);
  }
}

async function renderDeck() {
  const args = process.argv.slice(2);
  let targetDeck = null;
  let targetSlide = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--deck' && args[i + 1]) targetDeck = args[i + 1].toLowerCase();
    if (args[i] === '--slide' && args[i + 1]) targetSlide = parseInt(args[i + 1], 10);
  }

  console.log('[Renderer] Launching Headless Chromium with 4K deviceScaleFactor: 2...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // 1. Render CHAKRA Slides
  if (!targetDeck || targetDeck === 'chakra') {
    const slidesToRender = targetSlide ? [targetSlide] : [1, 2, 3, 4, 5, 6];
    console.log(`[Renderer] Rendering CHAKRA Slide(s): ${slidesToRender.join(', ')}...`);
    for (const i of slidesToRender) {
      const html = getChakraSlideHTML(i);
      await page.setContent(html, { waitUntil: 'networkidle' });
      await validateSlideLayout(page, 'chakra', i);
      const outPath = path.join(CHAKRA_OUT, `slide_${i}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`[Renderer] Rendered CHAKRA Slide ${i} -> ${outPath}`);
    }
  }

  // 2. Render BHEDAK Slides
  if (!targetDeck || targetDeck === 'bhedak') {
    const slidesToRender = targetSlide ? [targetSlide] : [1, 2, 3, 4, 5, 6];
    console.log(`[Renderer] Rendering BHEDAK Slide(s): ${slidesToRender.join(', ')}...`);
    for (const i of slidesToRender) {
      const html = getBhedakSlideHTML(i);
      await page.setContent(html, { waitUntil: 'networkidle' });
      await validateSlideLayout(page, 'bhedak', i);
      const outPath = path.join(BHEDAK_OUT, `slide_${i}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`[Renderer] Rendered BHEDAK Slide ${i} -> ${outPath}`);
    }
  }

  await browser.close();
  console.log('[Renderer] Render & Pre-Flight Verification Completed Successfully!');
}

renderDeck().catch(err => {
  console.error('[Renderer] Error during slide rendering:', err);
  process.exit(1);
});
