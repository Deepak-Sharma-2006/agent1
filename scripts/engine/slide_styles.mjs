/**
 * Presenton-Style High-Fidelity Canva-Grade Slide Generator for SIH 2026
 * Generates 100% Pure White (#FFFFFF), 16:9 Widescreen (1920x1080) slides matching sih_2024.pdf visual layout.
 * Features:
 *  - Pure white background with high-contrast typography
 *  - Official black pill category headers
 *  - Realistic desktop monitor & smartphone device frames with live UI screens
 *  - SVG vector tech stack badges (Docker, Kafka, Neo4j, ClickHouse, Python, Go, React, etc.)
 *  - Connected arrow flows, chevrons, stacked bar charts with CAGR arrows, and TAM/SAM/SOM donut charts
 *  - Full proposed solution architecture (not demo-only)
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function getBase64Image(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File not found for base64: ${filePath}`);
    return '';
  }
  const ext = path.extname(filePath).replace('.', '');
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const sihLogoB64 = getBase64Image('specs/presentations/rendered/sih_logo_header.png');
const sihLogoLargeB64 = getBase64Image('specs/presentations/rendered/sih_bulb_hires.png');
const chakraDashboardB64 = getBase64Image('specs/presentations/rendered/chakra_dashboard.png');
const bhedakGraphB64 = getBase64Image('specs/presentations/rendered/bhedak_graph.png');
const mhaLogoB64 = getBase64Image('demo/chakra_mvp/frontend/public/mha_logo.png');
const ntroLogoB64 = getBase64Image('demo/bhedak_mvp/frontend/public/ntro_logo.png');

// Clean SVG Vector Icons
const ICONS = {
  docker: `<svg viewBox="0 0 100 100" width="22" height="22"><circle cx="50" cy="50" r="45" fill="#2496ED"/><rect x="25" y="42" width="10" height="8" fill="#FFFFFF"/><rect x="38" y="42" width="10" height="8" fill="#FFFFFF"/><rect x="51" y="42" width="10" height="8" fill="#FFFFFF"/><rect x="38" y="32" width="10" height="8" fill="#FFFFFF"/><rect x="51" y="32" width="10" height="8" fill="#FFFFFF"/><path d="M15 54 Q45 75 85 54 Q88 68 75 75 Q35 85 15 54" fill="#FFFFFF"/></svg>`,
  kafka: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="20" fill="#231F20"/><circle cx="35" cy="50" r="12" fill="#FFFFFF"/><circle cx="65" cy="30" r="10" fill="#FFFFFF"/><circle cx="65" cy="70" r="10" fill="#FFFFFF"/><line x1="35" y1="50" x2="65" y2="30" stroke="#FFFFFF" stroke-width="4"/><line x1="35" y1="50" x2="65" y2="70" stroke="#FFFFFF" stroke-width="4"/></svg>`,
  neo4j: `<svg viewBox="0 0 100 100" width="22" height="22"><circle cx="50" cy="50" r="45" fill="#008CC1"/><circle cx="50" cy="30" r="10" fill="#FFFFFF"/><circle cx="32" cy="65" r="10" fill="#FFFFFF"/><circle cx="68" cy="65" r="10" fill="#FFFFFF"/><line x1="50" y1="30" x2="32" y2="65" stroke="#FFFFFF" stroke-width="4"/><line x1="50" y1="30" x2="68" y2="65" stroke="#FFFFFF" stroke-width="4"/><line x1="32" y1="65" x2="68" y2="65" stroke="#FFFFFF" stroke-width="4"/></svg>`,
  python: `<svg viewBox="0 0 128 128" width="22" height="22"><path fill="#3776AB" d="M63.7 3.5c-15.4 0-25 6.7-25 15.6v11.7h25.7v3.9H29.1C13.2 34.7 0 46.5 0 63.8c0 17 11.8 28.5 27.2 28.5h8.9v-12.7c0-10.4 8.9-19.4 19.4-19.4h25.6V35.6c0-12.2-11.4-32.1-17.4-32.1zm-8.8 8.8c2.4 0 4.4 2 4.4 4.4s-2 4.4-4.4 4.4-4.4-2-4.4-4.4 2-4.4 4.4-4.4z"/><path fill="#FFD43B" d="M64.3 124.5c15.4 0 25-6.7 25-15.6V97.2H63.6v-3.9h35.3c15.9 0 29.1-11.8 29.1-29.1 0-17-11.8-28.5-27.2-28.5h-8.9v12.7c0 10.4-8.9 19.4-19.4 19.4H46.9v24.6c0 12.2 11.4 32.1 17.4 32.1zm8.8-8.8c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4-4.4 4.4-4.4-2 4.4-4.4 4.4z"/></svg>`,
  redis: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="20" fill="#D82C20"/><polygon points="50,20 80,35 50,50 20,35" fill="#FFFFFF"/><polygon points="50,50 80,65 50,80 20,65" fill="#FFFFFF" opacity="0.8"/></svg>`,
  react: `<svg viewBox="0 0 100 100" width="22" height="22"><circle cx="50" cy="50" r="8" fill="#61DAFB"/><ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#61DAFB" stroke-width="3"/><ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#61DAFB" stroke-width="3" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#61DAFB" stroke-width="3" transform="rotate(120 50 50)"/></svg>`,
  typescript: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="15" fill="#3178C6"/><text x="25" y="70" font-family="Arial, sans-serif" font-weight="bold" font-size="50" fill="#FFFFFF">TS</text></svg>`,
  golang: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="20" fill="#00ADD8"/><text x="18" y="68" font-family="Arial, sans-serif" font-weight="bold" font-size="44" fill="#FFFFFF">GO</text></svg>`,
  clickhouse: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="20" fill="#FFCC00"/><rect x="22" y="20" width="10" height="60" fill="#000"/><rect x="38" y="35" width="10" height="45" fill="#000"/><rect x="54" y="20" width="10" height="60" fill="#000"/><rect x="70" y="45" width="10" height="35" fill="#000"/></svg>`,
  tor: `<svg viewBox="0 0 100 100" width="22" height="22"><circle cx="50" cy="50" r="45" fill="#7D4698"/><path d="M50 20 A30 30 0 0 1 50 80 A30 30 0 0 0 50 20" fill="#FFFFFF"/><circle cx="50" cy="50" r="14" fill="#7D4698"/></svg>`,
  flutter: `<svg viewBox="0 0 100 100" width="22" height="22"><rect width="100" height="100" rx="20" fill="#02569B"/><polygon points="30,55 55,80 75,60 50,35" fill="#42A5F5"/><polygon points="50,15 75,40 55,60 30,35" fill="#0175C2"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2563EB" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  gavel: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#DC2626" stroke-width="2.5"><path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L11.2 10.2"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" width="24" height="24" fill="#F59E0B"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10B981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  analytics: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#3B82F6" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  coins: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#D97706" stroke-width="2.5"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
  database: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#6366F1" stroke-width="2.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  network: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#0D9488" stroke-width="2.5"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
  cpu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#EA580C" stroke-width="2.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  user: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1E40AF" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#3B82F6" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  github: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#000000"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  document: `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2563EB" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
};

const COMMON_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: #FFFFFF;
    color: #0F172A;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    overflow: hidden;
    position: relative;
    -webkit-font-smoothing: antialiased;
  }
  .slide-container {
    width: 1920px;
    height: 1080px;
    padding: 30px 45px 35px 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #FFFFFF;
    position: relative;
  }
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 65px;
    border-bottom: 2px solid #E2E8F0;
    padding-bottom: 12px;
  }
  .team-pill {
    border: 2.5px solid #000000;
    border-radius: 9999px;
    padding: 6px 28px;
    font-size: 26px;
    font-weight: 900;
    color: #000000;
    background: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .slide-headline {
    font-size: 38px;
    font-weight: 900;
    letter-spacing: 0.5px;
    color: #000000;
    text-transform: uppercase;
    text-align: center;
  }
  .sih-logo-img {
    height: 62px;
    object-fit: contain;
  }
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    border-top: 1.5px solid #E2E8F0;
    padding-top: 8px;
  }
  .footer-sub {
    font-size: 19px;
    font-weight: 700;
    color: #1E3A8A;
    margin: 0 auto;
  }
  .footer-num {
    font-size: 28px;
    font-weight: 900;
    color: #1E3A8A;
  }
  .black-pill {
    background: #000000;
    color: #FFFFFF;
    font-weight: 900;
    font-size: 19px;
    padding: 6px 22px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .content-card {
    background: #FFFFFF;
    border: 1.5px solid #E2E8F0;
    border-radius: 14px;
    padding: 16px 20px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03);
  }
  .card-tint-salmon { background: #FFF1F2; border: 1.5px solid #FECDD3; }
  .card-tint-amber { background: #FFFBEB; border: 1.5px solid #FDE68A; }
  .card-tint-emerald { background: #F0FDF4; border: 1.5px solid #BBF7D0; }
  .card-tint-blue { background: #EFF6FF; border: 1.5px solid #BFDBFE; }

  /* Device Mockups */
  .monitor-frame {
    background: #0F172A;
    border-radius: 12px;
    padding: 8px 8px 12px 8px;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.25);
    position: relative;
  }
  .monitor-cam {
    width: 6px;
    height: 6px;
    background: #334155;
    border-radius: 50%;
    margin: 0 auto 6px auto;
  }
  .monitor-screen {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #334155;
    background: #FFFFFF;
  }
  .monitor-screen img {
    width: 100%;
    height: auto;
    display: block;
  }
  .monitor-stand {
    width: 36px;
    height: 18px;
    background: #64748B;
    margin: 0 auto;
  }
  .monitor-base {
    width: 110px;
    height: 6px;
    background: #94A3B8;
    border-radius: 3px;
    margin: 0 auto;
  }
  .phone-frame {
    width: 175px;
    background: #0F172A;
    border-radius: 22px;
    padding: 6px;
    border: 2.5px solid #334155;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
  }
  .phone-island {
    width: 48px;
    height: 7px;
    background: #000;
    border-radius: 6px;
    margin: 2px auto 5px auto;
  }
  .phone-screen {
    border-radius: 16px;
    background: #FFFFFF;
    padding: 8px;
    font-size: 10px;
    color: #0F172A;
  }
`;

export {
  sihLogoB64,
  sihLogoLargeB64,
  chakraDashboardB64,
  bhedakGraphB64,
  mhaLogoB64,
  ntroLogoB64,
  ICONS,
  COMMON_CSS
};
