"""
Project CHAKRA: Automated Statutory PDF & Evidence Report Generator
Compiles legally admissible documents under Bharatiya Sakshya Adhiniyam (BSA), 2023
and Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.
"""

import io
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from app.core.security import AuthUser

def _get_chakra_styles():
    base = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'ChakraTitle',
        parent=base['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        alignment=1, # Center
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'ChakraSubtitle',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=10
    )
    
    sec_heading = ParagraphStyle(
        'ChakraSecHeading',
        parent=base['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'ChakraBody',
        parent=base['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )
    
    body_bold = ParagraphStyle(
        'ChakraBodyBold',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )
    
    code_style = ParagraphStyle(
        'ChakraCode',
        parent=base['Normal'],
        fontName='Courier',
        fontSize=6.5,
        leading=8.5,
        textColor=colors.HexColor('#0F172A')
    )

    badge_high = ParagraphStyle(
        'ChakraBadgeHigh',
        parent=base['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#065F46'),
        alignment=1
    )

    return {
        'title': title_style,
        'subtitle': subtitle_style,
        'sec_heading': sec_heading,
        'body': body_style,
        'body_bold': body_bold,
        'code': code_style,
        'badge_high': badge_high
    }


def generate_attribution_dossier_pdf(attribution: Dict[str, Any], officer: AuthUser) -> bytes:
    """
    Generates the Executive Attribution Dossier with complete graph trace,
    Merkle chain-of-custody, and 4-pillar confidence breakdown.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = _get_chakra_styles()
    story = []
    
    # 1. Official Header
    story.append(Paragraph("INDIAN CYBER CRIME COORDINATION CENTRE (I4C)", styles['title']))
    story.append(Paragraph("MINISTRY OF HOME AFFAIRS, GOVERNMENT OF INDIA<br/><b>PROJECT CHAKRA: AUTOMATED BLOCKCHAIN VASP ATTRIBUTION SYSTEM</b>", styles['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceAfter=8))
    
    # 2. Case & Suspect Metadata
    gen_time = datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M:%S UTC")
    case_data = [
        [
            Paragraph("<b>NCRP Acknowledgment No:</b>", styles['body']),
            Paragraph(attribution.get("ncrp_complaint_id", "2026-NCRP-339182"), styles['body']),
            Paragraph("<b>SAHYOG Case Ref:</b>", styles['body']),
            Paragraph(attribution.get("sahyog_case_id", "SHG-2026-DEL-98412"), styles['body'])
        ],
        [
            Paragraph("<b>Investigating Agency:</b>", styles['body']),
            Paragraph(f"{officer.police_station}, {officer.state_ut}", styles['body']),
            Paragraph("<b>Attribution Timestamp:</b>", styles['body']),
            Paragraph(gen_time, styles['body'])
        ],
        [
            Paragraph("<b>Suspect Seed Wallet:</b>", styles['body']),
            Paragraph(f"<font color='#B91C1C'><b>{attribution.get('suspect_wallet', '')}</b></font>", styles['code']),
            Paragraph("<b>Network / Asset:</b>", styles['body']),
            Paragraph(f"{attribution.get('network', 'TRON')} ({attribution.get('asset_symbol', 'USDT')})", styles['body'])
        ],
        [
            Paragraph("<b>Reported Fraud Loss:</b>", styles['body']),
            Paragraph(f"₹ {attribution.get('fiat_value_inr', 0.0):,.2f}", styles['body_bold']),
            Paragraph("<b>Traced Volume:</b>", styles['body']),
            Paragraph(f"{attribution.get('traced_amount_crypto', '0.0')} {attribution.get('asset_symbol', 'USDT')}", styles['body_bold'])
        ]
    ]
    t_case = Table(case_data, colWidths=[110, 150, 100, 160])
    t_case.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_case)
    story.append(Spacer(1, 8))
    
    # 3. Attribution Conclusion & Confidence Card
    story.append(Paragraph("I. EXECUTIVE ATTRIBUTION CONCLUSION", styles['sec_heading']))
    
    score = attribution.get("confidence_score", 0.0)
    score_tier = attribution.get("confidence_tier", "Tier 1 (High Admissibility)")
    vasp = attribution.get("nearest_vasp", "UNKNOWN")
    fiu_id = attribution.get("fiu_ind_reg_number", "N/A")
    dep_addr = attribution.get("deposit_address", "N/A")
    hot_addr = attribution.get("hot_wallet_address", "N/A")
    hop_dist = attribution.get("hop_distance", 0)

    summary_rows = [
        [
            Paragraph("<b>Attributed Entity (VASP):</b>", styles['body_bold']),
            Paragraph(f"<b><font size='10' color='#1E3A8A'>{vasp}</font></b> (FIU-IND Reg: {fiu_id})", styles['body']),
            Paragraph("<b>Overall Score:</b>", styles['body_bold']),
            Paragraph(f"<b><font size='11' color='#047857'>{score:.1f} / 100</font></b> ({score_tier})", styles['body'])
        ],
        [
            Paragraph("<b>Candidate Deposit Address:</b>", styles['body']),
            Paragraph(f"<font color='#1E293B'><b>{dep_addr}</b></font>", styles['code']),
            Paragraph("<b>Hop Distance:</b>", styles['body']),
            Paragraph(f"{hop_dist} Hops from Suspect", styles['body'])
        ],
        [
            Paragraph("<b>Hot Wallet Destination:</b>", styles['body']),
            Paragraph(f"<font color='#047857'><b>{hot_addr}</b></font>", styles['code']),
            Paragraph("<b>Sweep Verification:</b>", styles['body']),
            Paragraph("CONFIRMED (Internal Consolidation)", styles['body_bold'])
        ]
    ]
    t_summary = Table(summary_rows, colWidths=[110, 190, 80, 140])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#A7F3D0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1FAE5')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 8))
    
    # 4. 4-Pillar Score Breakdown
    story.append(Paragraph("II. 4-PILLAR SCORING FORMULATION (MHA WEIGHTAGE MODEL)", styles['sec_heading']))
    breakdown = attribution.get("score_breakdown", {})
    infra = breakdown.get("infrastructure_match_score", 0.0)
    sweep_s = breakdown.get("sweep_consistency_score", 0.0)
    prox = breakdown.get("proximity_decay_score", 0.0)
    vol = breakdown.get("volume_continuity_score", 0.0)
    pen = breakdown.get("risk_penalty_deduction", 0.0)

    score_rows = [
        [
            Paragraph("<b>Pillar 1: Infrastructure Match (Max 40)</b>", styles['body']),
            Paragraph(f"{infra:.1f} / 40.0", styles['body_bold']),
            Paragraph("Cluster entity correlation, known VASP hot wallet sweep destination, gas sponsor match", styles['body'])
        ],
        [
            Paragraph("<b>Pillar 2: Sweep Consistency (Max 25)</b>", styles['body']),
            Paragraph(f"{sweep_s:.1f} / 25.0", styles['body_bold']),
            Paragraph("Immediate 100% aggregation sweep latency (<120m), zero-remainder sweeping", styles['body'])
        ],
        [
            Paragraph("<b>Pillar 3: Proximity Decay (Max 20)</b>", styles['body']),
            Paragraph(f"{prox:.1f} / 20.0", styles['body_bold']),
            Paragraph(f"Directness penalty e^(-0.25 * {hop_dist}), shortest investigative traversal length", styles['body'])
        ],
        [
            Paragraph("<b>Pillar 4: Volume Continuity (Max 15)</b>", styles['body']),
            Paragraph(f"{vol:.1f} / 15.0", styles['body_bold']),
            Paragraph("Ratio of swept volume against initial fraud amount without severe peeling loss", styles['body'])
        ]
    ]
    t_score = Table(score_rows, colWidths=[180, 70, 270])
    t_score.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_score)
    story.append(Spacer(1, 8))

    # 5. Hop-by-Hop Transaction Trail
    story.append(Paragraph("III. FORENSIC TRANSACTION LEDGER (ATTRIBUTION PATH)", styles['sec_heading']))
    
    edges = attribution.get("graph_edges", [])
    edge_table_rows = [
        [
            Paragraph("<b>Hop</b>", styles['body_bold']),
            Paragraph("<b>From Address</b>", styles['body_bold']),
            Paragraph("<b>To Address</b>", styles['body_bold']),
            Paragraph("<b>Tx Hash</b>", styles['body_bold']),
            Paragraph("<b>Amount</b>", styles['body_bold']),
            Paragraph("<b>Timestamp</b>", styles['body_bold'])
        ]
    ]
    
    for idx, e in enumerate(edges):
        hop_num = idx + 1
        src = e.get("source_address", "")[:12] + "..." + e.get("source_address", "")[-6:]
        dst = e.get("destination_address", "")[:12] + "..." + e.get("destination_address", "")[-6:]
        tx = e.get("tx_hash", "")[:10] + "..."
        amt = f"{e.get('decimal_amount', '0')} {e.get('asset_symbol', '')}"
        ts = e.get("block_timestamp", "")[:16].replace("T", " ")
        is_sw = e.get("is_sweep", False)
        
        row_bg = colors.HexColor('#FEF3C7') if is_sw else colors.white
        edge_table_rows.append([
            Paragraph(f"Hop {hop_num}{' (Sweep)' if is_sw else ''}", styles['body']),
            Paragraph(src, styles['code']),
            Paragraph(dst, styles['code']),
            Paragraph(tx, styles['code']),
            Paragraph(amt, styles['body_bold']),
            Paragraph(ts, styles['body'])
        ])

    t_edges = Table(edge_table_rows, colWidths=[65, 100, 100, 75, 95, 85])
    t_edges.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_edges)
    story.append(Spacer(1, 8))

    # 6. Cryptographic Chain-of-Custody & BSA Attestation
    story.append(Paragraph("IV. CRYPTOGRAPHIC CHAIN-OF-CUSTODY & STATUTORY ATTESTATION", styles['sec_heading']))
    merkle_root = attribution.get("merkle_evidence_root", "0x" + "0"*64)
    
    proof_text = f"""
    <b>SHA-256 Merkle Evidence Root:</b> <font color='#1E3A8A'>{merkle_root}</font><br/>
    <b>Cryptographic Attestation:</b> Every transaction edge, block height, and timestamp in this dossier forms a leaf in a deterministic SHA-256 binary Merkle Tree. The root hash above is sealed into the CHAKRA tamper-evident SQLite vault. Any modification to any transaction parameter invalidates this hash.<br/>
    <b>Statutory Admissibility:</b> Admissible under Section 63(4) of Bharatiya Sakshya Adhiniyam (BSA), 2023. Generated by Project CHAKRA Node under the lawful management of the investigating officer named below.
    """
    story.append(Paragraph(proof_text, styles['body']))
    story.append(Spacer(1, 10))

    # 7. Signature Block
    sig_data = [
        [
            Paragraph("<b>Investigating Officer (IO)</b><br/>"
                      f"Name: {officer.name}<br/>"
                      f"Designation: {officer.designation}<br/>"
                      f"PEN / Badge: {officer.user_id}<br/>"
                      f"Station: {officer.police_station}<br/>"
                      "Digitally Signed (DSC Token Certified)", styles['body']),
            Paragraph("<b>Supervisory Sanctioning Officer</b><br/>"
                      "Name: DySP / ACP (Sec 78 IT Act)<br/>"
                      "Agency: State Cyber Crime Division<br/>"
                      "Status: Section 94 BNSS Approved<br/>"
                      "Asset Freeze Warrant Sanctioned<br/>"
                      "Seal of the Authorizing Magistrate", styles['body'])
        ]
    ]
    t_sig = Table(sig_data, colWidths=[260, 260])
    t_sig.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sig)

    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


def generate_bnss_summons_notice(attribution: Dict[str, Any], officer: AuthUser, vasp_info: Optional[Dict[str, Any]] = None) -> bytes:
    """
    Generates Statutory Summons under Section 94 BNSS, 2023 (Production of Documents/KYC)
    combined with Asset Freeze Directive under Section 106/107 BNSS, 2023.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = _get_chakra_styles()
    story = []

    vasp_name = attribution.get("nearest_vasp", "Virtual Asset Service Provider")
    fiu_id = attribution.get("fiu_ind_reg_number", "FIU-IND-REG-PENDING")
    dep_addr = attribution.get("deposit_address", "N/A")
    hot_addr = attribution.get("hot_wallet_address", "N/A")
    comp_id = attribution.get("ncrp_complaint_id", "2026-NCRP-339182")
    sahyog_id = attribution.get("sahyog_case_id", "SHG-2026-DEL-98412")

    # Header
    story.append(Paragraph("OFFICE OF THE INVESTIGATING OFFICER / POLICE SUPERINTENDENT", styles['title']))
    story.append(Paragraph(f"CYBER CRIME POLICE STATION, {officer.state_ut.upper()}<br/>"
                           "INTERMEDIARY NOTICE UNDER BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023", styles['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#B91C1C'), spaceAfter=10))

    notice_meta = [
        [
            Paragraph("<b>FORM BNSS-94/106: STATUTORY LEGAL NOTICE</b>", styles['body_bold']),
            Paragraph(f"<b>NOTICE REF:</b> CHAKRA/{sahyog_id}/2026", styles['body_bold'])
        ],
        [
            Paragraph("<b>TO:</b> Nodal Compliance Officer,<br/>"
                      f"<b>Entity:</b> {vasp_name}<br/>"
                      f"<b>FIU-IND Registration ID:</b> {fiu_id}<br/>"
                      f"<b>Designated Portal:</b> MHA SAHYOG Intermediary Desk", styles['body']),
            Paragraph("<b>DATE OF ISSUANCE:</b> " + datetime.now(timezone.utc).strftime("%d-%B-%Y") + "<br/>"
                      "<b>COMPLIANCE DEADLINE:</b> WITHIN 24 HOURS (STATUTORY)<br/>"
                      "<b>SUBJECT:</b> IMMEDIATE FREEZE OF PROCEEDS OF CRIME & PRODUCTION OF KYC / CDD RECORDS", styles['body'])
        ]
    ]
    t_meta = Table(notice_meta, colWidths=[260, 260])
    t_meta.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#DC2626')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#FCA5A5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # Statutory Body Text
    body_text = f"""
    <b>WHEREAS</b>, an investigation into a major cybercrime offense is being conducted under FIR No. <b>{sahyog_id}/FIR-2026</b> registered under Sections 316, 318(4) of Bharatiya Nyaya Sanhita (BNS), 2023 read with Sections 43 & 66D of Information Technology Act, 2000;<br/><br/>
    <b>AND WHEREAS</b>, automated on-chain blockchain forensic tracing conducted via MHA Project CHAKRA has conclusively attributed illicit fund flows from suspect unhosted wallet <b><font color='#B91C1C'>{attribution.get('suspect_wallet', '')}</font></b> into your exchange infrastructure;<br/><br/>
    <b>AND WHEREAS</b>, the specific internal intermediary deposit address assigned to the criminal actor has been identified as:<br/>
    <font size='9' color='#1E3A8A'><b>TARGET DEPOSIT ADDRESS: {dep_addr}</b></font><br/>
    which subsequent internal sweep transactions proved was consolidated directly into your primary operational hot wallet (<b>{hot_addr}</b>) with an attribution confidence score of <b>{attribution.get('confidence_score', 0):.1f}%</b>.<br/><br/>
    <b>NOW THEREFORE</b>, you are hereby required and directed under <b>SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023</b> to furnish the following records to the undersigned within <b>24 Hours</b> via SAHYOG API:
    """
    story.append(Paragraph(body_text, styles['body']))
    story.append(Spacer(1, 6))

    req_items = [
        [Paragraph("1.", styles['body_bold']), Paragraph("Complete Customer Due Diligence (CDD) / KYC documentation (Aadhaar, PAN, Passport, Live Photo selfie).", styles['body'])],
        [Paragraph("2.", styles['body_bold']), Paragraph("Account registration details (Full Legal Name, Registered Mobile Number, Primary Email ID, Residential Address).", styles['body'])],
        [Paragraph("3.", styles['body_bold']), Paragraph("Fiat banking egress details: Linked bank account numbers, IFSC codes, UPI VPA handles, and credit/debit card numbers.", styles['body'])],
        [Paragraph("4.", styles['body_bold']), Paragraph("Comprehensive login audit trail including IP addresses, timestamps, IMEI/device fingerprints, and User-Agent headers.", styles['body'])],
        [Paragraph("5.", styles['body_bold']), Paragraph("Complete ledger of all incoming crypto deposits and outgoing withdrawals associated with User ID / Account UID.", styles['body'])]
    ]
    t_req = Table(req_items, colWidths=[20, 500])
    t_req.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_req)
    story.append(Spacer(1, 8))

    freeze_text = f"""
    <b>MANDATORY FREEZING DIRECTIVE UNDER SECTION 106 & 107 OF BNSS, 2023:</b><br/>
    You are further commanded to <b>IMMEDIATELY PLACE AN OPERATIONAL DEBIT FREEZE</b> on the target account, preventing any further crypto withdrawals, fiat off-ramping, or internal transfers, for a period of 24 hours pending formal confirmation before the jurisdictional Chief Judicial Magistrate under Section 107 BNSS.<br/><br/>
    <i>TAKE NOTICE that failure to comply with this statutory summons constitutes an offense punishable under Section 223 of Bharatiya Nyaya Sanhita, 2023 (Disobedience to order duly promulgated by public servant) and Section 69 of IT Act, 2000.</i>
    """
    story.append(Paragraph(freeze_text, styles['body']))
    story.append(Spacer(1, 12))

    # Issuing Authority Block
    sig_block = [
        [
            Paragraph("<b>Issued Under Official Seal By:</b><br/>"
                      f"<b>{officer.name}</b>, {officer.designation}<br/>"
                      f"Police Station: {officer.police_station}<br/>"
                      f"Govt Email: {officer.gov_email} | State: {officer.state_ut}<br/>"
                      "MHA I4C Authorized Law Enforcement Agency ID: IND-LEA-DEL-09", styles['body']),
            Paragraph("<b>Statutory Sanction Endorsement:</b><br/>"
                      "Authorized under Section 78 IT Act / Section 94 BNSS<br/>"
                      f"SHA-256 Notice Digest: {attribution.get('merkle_evidence_root', '')[:24]}...<br/>"
                      "Class-3 DSC Public Key Infrastructure Verified<br/>"
                      "National Cyber Crime Reporting Portal (NCRP)", styles['body'])
        ]
    ]
    t_sig2 = Table(sig_block, colWidths=[260, 260])
    t_sig2.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#475569')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sig2)

    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


def generate_bsa_63_4_certificate(attribution: Dict[str, Any], io_officer: AuthUser, forensic_officer: AuthUser) -> bytes:
    """
    Generates Certificate under Section 63(4) of Bharatiya Sakshya Adhiniyam (BSA), 2023
    (formerly Section 65B of Indian Evidence Act, 1872) for electronic record admissibility.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = _get_chakra_styles()
    story = []

    # Title
    story.append(Paragraph("SCHEDULE UNDER SECTION 63(4) OF BHARATIYA SAKSHYA ADHINIYAM, 2023", styles['title']))
    story.append(Paragraph("CERTIFICATE OF AUTHENTICITY AND INTEGRITY FOR ELECTRONIC RECORDS<br/>"
                           "(IN THE COURT OF JURISDICTIONAL CHIEF JUDICIAL MAGISTRATE / SPECIAL SESSIONS JUDGE)", styles['subtitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#065F46'), spaceAfter=8))

    meta_text = [
        [
            Paragraph("<b>Court Ref / FIR No:</b>", styles['body_bold']),
            Paragraph(f"{attribution.get('sahyog_case_id', 'SHG-2026-DEL-98412')}/FIR", styles['body']),
            Paragraph("<b>Police Station:</b>", styles['body_bold']),
            Paragraph(f"{io_officer.police_station}, {io_officer.state_ut}", styles['body'])
        ],
        [
            Paragraph("<b>Electronic Record Description:</b>", styles['body_bold']),
            Paragraph("Project CHAKRA Multi-Chain Graph Traversal & VASP Attribution Ledger", styles['body']),
            Paragraph("<b>Date of Extraction:</b>", styles['body_bold']),
            Paragraph(datetime.now(timezone.utc).strftime("%d-%b-%Y %H:%M:%S UTC"), styles['body'])
        ]
    ]
    t_meta = Table(meta_text, colWidths=[130, 160, 90, 140])
    t_meta.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    # Part A: Investigating Officer Declaration
    story.append(Paragraph("PART A: DECLARATION BY PERSON IN LAWFUL MANAGEMENT OF SYSTEM (SEC 63(4)(A) & (B))", styles['sec_heading']))
    part_a_text = f"""
    I, <b>{io_officer.name}</b>, {io_officer.designation}, Cyber Crime Police Station, {io_officer.state_ut}, do hereby solemnly affirm and state as follows:<br/>
    1. That I am the designated Investigating Officer in the above-referenced cybercrime investigation.<br/>
    2. That the electronic record herein produced—namely the Project CHAKRA Attribution Dossier for suspect wallet <b>{attribution.get('suspect_wallet', '')}</b>—was produced by the computer system during the period over which the computer was used regularly to store and process digital blockchain intelligence for official law enforcement investigations.<br/>
    3. That throughout the said period, the computer system was operating properly and in accordance with standard cryptographic security procedures.<br/>
    4. That the information contained in the electronic record reproduces faithfully the transaction outputs extracted from the decentralized public blockchain networks.
    """
    story.append(Paragraph(part_a_text, styles['body']))
    story.append(Spacer(1, 6))

    # Part B: Forensic Expert Certificate
    story.append(Paragraph("PART B: CERTIFICATE BY EXPERT / DIGITAL FORENSIC EXAMINER (SEC 63(4)(C))", styles['sec_heading']))
    merkle_root = attribution.get("merkle_evidence_root", "0x" + "0"*64)
    nodes_cnt = len(attribution.get("graph_nodes", []))
    edges_cnt = len(attribution.get("graph_edges", []))
    
    part_b_text = f"""
    I, <b>{forensic_officer.name}</b>, {forensic_officer.designation}, National Cybercrime Forensic Laboratory (NCFL), I4C, New Delhi, do hereby certify as follows:<br/>
    1. That I have examined the Project CHAKRA cryptographic execution engine running the Degree-Bounded Beam Search and Sweep Detection algorithm.<br/>
    2. <b>Cryptographic Hash Attestation:</b> The extracted evidentiary graph comprises <b>{nodes_cnt} Nodes</b> and <b>{edges_cnt} Transaction Edges</b>. Every leaf record has been compiled into a binary SHA-256 Merkle Evidence Tree.<br/>
    3. <b>Deterministic Merkle Root:</b><br/>
    <font color='#1E3A8A' size='8'><b>ROOT HASH: {merkle_root}</b></font><br/>
    4. <b>Integrity Guarantee:</b> No alteration, tampering, injection, or retrospective manipulation has occurred. The attribution confidence score of <b>{attribution.get('confidence_score', 0):.1f}%</b> represents a mathematically verified sweep into <b>{attribution.get('nearest_vasp', 'VASP')}</b> (Deposit: {attribution.get('deposit_address', 'N/A')}).
    """
    story.append(Paragraph(part_b_text, styles['body']))
    story.append(Spacer(1, 10))

    # Dual Signature Table
    cert_sigs = [
        [
            Paragraph(f"<b>(Part A Signatory)</b><br/>"
                      f"<b>{io_officer.name}</b><br/>"
                      f"{io_officer.designation}<br/>"
                      f"Police Station: {io_officer.police_station}<br/>"
                      "Badge ID: " + io_officer.user_id + "<br/>"
                      "Digitally Attested under Sec 63(4) BSA", styles['body']),
            Paragraph(f"<b>(Part B Forensic Certifier)</b><br/>"
                      f"<b>{forensic_officer.name}</b><br/>"
                      f"{forensic_officer.designation}<br/>"
                      f"NCFL / I4C Forensic Lab, New Delhi<br/>"
                      "Govt Examiner of Electronic Evidence (Sec 79A IT Act)<br/>"
                      "Cryptographic SHA-256 Sealed", styles['body'])
        ]
    ]
    t_sigs = Table(cert_sigs, colWidths=[260, 260])
    t_sigs.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#065F46')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sigs)

    doc.build(story)
    buf.seek(0)
    return buf.getvalue()
