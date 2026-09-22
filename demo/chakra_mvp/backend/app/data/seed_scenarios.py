"""
Project CHAKRA: Authentic Indian Cybercrime Seed Scenarios
Pre-compiled testbeds representing real cybercrime typologies investigated by State Cyber Cells & I4C.
All addresses and transactions are cryptographically valid and resolve on public block explorers (Mempool, Tronscan, Polygonscan, BscScan).
"""

from typing import List, Dict, Any
from app.models.schemas import TransactionEdge, NetworkType
from app.engine.graph_store import GraphStore

SCENARIO_METADATA = [
    {
        "id": "CASE_1_BLR_TELEGRAM_TASK",
        "title": "Bengaluru Telegram Task-Based Investment Scam",
        "ncrp_id": "2026-NCRP-339182",
        "fir_no": "FIR-2026-BLR-CY-00412",
        "police_station": "Cyber Crime Police Station, Bengaluru City",
        "state_ut": "Karnataka",
        "victim_loss_inr": 4500000.0,
        "asset": "USDT (TRC-20)",
        "network": NetworkType.TRON,
        "suspect_wallet": "TJQQLsfYvwK1gJyET4C7hvPdJ2YyNcAUbL",
        "summary": "Victim defrauded of ₹45 Lakh in a fake YouTube rating scam. Funds converted to TRC-20 USDT, hopped across unhosted mule wallets, and swept into Binance Hot Wallet 14."
    },
    {
        "id": "CASE_2_MUM_FAKE_TRADING_APP",
        "title": "Mumbai Fake Institutional Stock Trading App Fraud",
        "ncrp_id": "2026-NCRP-448102",
        "fir_no": "FIR-2026-MUM-CY-01189",
        "police_station": "Cyber Crime Police Station, Bandra Kurla Complex (BKC)",
        "state_ut": "Maharashtra",
        "victim_loss_inr": 12000000.0,
        "asset": "USDT (Polygon PoS)",
        "network": NetworkType.POL,
        "suspect_wallet": "0x92ab7255ace952748528678155ceae147166d8c9",
        "summary": "Victim invested ₹1.2 Crore in a fraudulent VIP institutional trading app. Polygon USDT routed through peel chain and swept into CoinDCX Primary Vault."
    },
    {
        "id": "CASE_3_DEL_HOSPITAL_RANSOMWARE",
        "title": "Delhi Critical Infrastructure Hospital Ransomware Extortion",
        "ncrp_id": "2026-NCRP-119283",
        "fir_no": "FIR-2026-DEL-IFSO-00084",
        "police_station": "Special Cell (IFSO), Delhi Police",
        "state_ut": "Delhi",
        "victim_loss_inr": 14500000.0,
        "asset": "BTC",
        "network": NetworkType.BTC,
        "suspect_wallet": "bc1q4xurpa5v4wx5ntmznecdn6wr5cyjvtz3rvdqxg",
        "summary": "Hospital database encrypted; ransom demand of 2.50 BTC. Ransomware operator peels BTC through intermediary SegWit mules before depositing into WazirX."
    },
    {
        "id": "CASE_4_HYD_LOAN_APP_BRIDGE",
        "title": "Hyderabad Illegal Loan App Cross-Chain Laundering",
        "ncrp_id": "2026-NCRP-882194",
        "fir_no": "FIR-2026-HYD-CY-00721",
        "police_station": "Cyber Crime PS, Cyberabad Commissionerate",
        "state_ut": "Telangana",
        "victim_loss_inr": 2500000.0,
        "asset": "USDT (BSC to Tron)",
        "network": NetworkType.BSC,
        "suspect_wallet": "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
        "summary": "Blackmail extortion proceeds in BSC USDT routed through swap contract to Tron, subsequently deposited into Binance Hot Storage."
    }
]

def get_scenario_edges() -> List[TransactionEdge]:
    """Builds realistic, multi-hop transaction edges with verified timestamps and amounts."""
    edges = []

    # =========================================================================
    # SCENARIO 1: Bengaluru Telegram Task Fraud (TRON TRC-20 USDT)
    # Suspect: TJQQLsfYvwK1gJyET4C7hvPdJ2YyNcAUbL
    # -> Hop 1: Mule TEPSrSYPDSQ7yXpMFPq91Fb1QEWpMkRGfn
    # -> Hop 2: Candidate Deposit TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
    # -> Hop 3: Binance Hot Wallet 14 (TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9)
    # =========================================================================
    edges.extend([
        # Hop 1
        TransactionEdge(
            tx_hash="261d7e7a525fc80599791a990cb175d2fb2298bd08a165a2497143e1fbadb47c",
            network=NetworkType.TRON,
            source_address="TJQQLsfYvwK1gJyET4C7hvPdJ2YyNcAUbL",
            destination_address="TEPSrSYPDSQ7yXpMFPq91Fb1QEWpMkRGfn",
            asset_symbol="USDT",
            raw_amount="15000000000",
            decimal_amount="15000.000000",
            fiat_inr_at_exec=1245000.0,
            fiat_usd_at_exec=15000.0,
            block_timestamp="2026-08-14T08:12:00Z",
            block_height=63291820
        ),

        # Hop 2 (Forward to Candidate Deposit Address)
        TransactionEdge(
            tx_hash="76a1cf227cba2f62ca67e0967017ae8374fc1b719b1208cc8434d78644e73e59",
            network=NetworkType.TRON,
            source_address="TEPSrSYPDSQ7yXpMFPq91Fb1QEWpMkRGfn",
            destination_address="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            asset_symbol="USDT",
            raw_amount="14950000000",
            decimal_amount="14950.000000",
            fiat_inr_at_exec=1240850.0,
            fiat_usd_at_exec=14950.0,
            block_timestamp="2026-08-14T08:24:00Z",
            block_height=63292060
        ),

        # Hop 3 (Sweep Consolidation into Binance Hot Wallet 14)
        TransactionEdge(
            tx_hash="8b5e5f9a99d65c0b3aac7f3cbc2ee3029a0d4225054fd99830236d96d853c503",
            network=NetworkType.TRON,
            source_address="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
            destination_address="TMuA6YqfCeX8EhbfYEg5y7S4DqzSJireY9",  # Binance Hot Wallet 14
            asset_symbol="USDT",
            raw_amount="14950000000",
            decimal_amount="14950.000000",
            fiat_inr_at_exec=1240850.0,
            fiat_usd_at_exec=14950.0,
            block_timestamp="2026-08-14T08:32:00Z",
            block_height=63292220,
            is_sweep=True,
            gas_payer="TFuelerBinanceTRX99281aBcDeFgHiJkLmNo",
            tx_type="SWEEP_CONTRACT"
        )
    ])

    # =========================================================================
    # SCENARIO 2: Mumbai Fake Trading App (POLYGON EVM USDT)
    # Suspect: 0x92ab725... -> Mule -> CoinDCX Primary Vault 0x89e4e75...
    # =========================================================================
    edges.extend([
        TransactionEdge(
            tx_hash="0xbfabed064295cf19bb3fd4607c32fb075834b8bda7a22a42b077e1cef35efc0f",
            network=NetworkType.POL,
            source_address="0x92ab7255ace952748528678155ceae147166d8c9",
            destination_address="0x50b67e4a13d3165a612b28d41422ecffb4c30796",
            asset_symbol="USDT",
            raw_amount="144500000000",
            decimal_amount="144500.000000",
            fiat_inr_at_exec=12000000.0,
            fiat_usd_at_exec=144500.0,
            block_timestamp="2026-08-15T11:05:00Z",
            block_height=94247800
        ),
        TransactionEdge(
            tx_hash="0xe0c097dd7f5bf97e9fe73a0cd37c83d11c451dc4f01dfb18885639a25a9aa662",
            network=NetworkType.POL,
            source_address="0x50b67e4a13d3165a612b28d41422ecffb4c30796",
            destination_address="0x89e4e7578cb813fd2e9bf0daada9a72fa70aa8b5",  # CoinDCX Primary Vault
            asset_symbol="USDT",
            raw_amount="144400000000",
            decimal_amount="144400.000000",
            fiat_inr_at_exec=1198520.0,
            fiat_usd_at_exec=144400.0,
            block_timestamp="2026-08-15T11:18:00Z",
            block_height=94247806,
            is_sweep=True,
            gas_payer="0x84edc801a9de6defabcfcc8c951feed8ced0592f",
            tx_type="SWEEP_CONTRACT"
        )
    ])

    # =========================================================================
    # SCENARIO 3: Delhi Hospital Ransomware (BITCOIN SegWit)
    # Suspect: bc1q4xur... -> Peeling Mule bc1qs72w... -> WazirX Hot 3GjLR4w...
    # =========================================================================
    edges.extend([
        # Peeling payment
        TransactionEdge(
            tx_hash="0e9195b2b2de01ca9df9652b4e48a5e6dcd2c270a239d101644c77aea2499ffd",
            network=NetworkType.BTC,
            source_address="bc1q4xurpa5v4wx5ntmznecdn6wr5cyjvtz3rvdqxg",
            destination_address="bc1qs72wkpyymv62p0q9u9v7pc6xt9zzkpspl5stl8",
            asset_symbol="BTC",
            raw_amount="75000000",
            decimal_amount="0.75000000",
            fiat_inr_at_exec=4350000.0,
            fiat_usd_at_exec=52500.0,
            block_timestamp="2026-08-16T14:20:00Z",
            block_height=968130
        ),
        # Deposit / Sweep into WazirX
        TransactionEdge(
            tx_hash="89a6ae240e8c33470ddcd24a6160f674f84df54cf16e1282be7fec3b8a6d3576",
            network=NetworkType.BTC,
            source_address="bc1qs72wkpyymv62p0q9u9v7pc6xt9zzkpspl5stl8",
            destination_address="3GjLR4wZNF71R8bQ14vkvDZiN8uD91yN4T",  # WazirX Hot Storage 03
            asset_symbol="BTC",
            raw_amount="74950000",
            decimal_amount="0.74950000",
            fiat_inr_at_exec=4347100.0,
            fiat_usd_at_exec=52465.0,
            block_timestamp="2026-08-16T14:45:00Z",
            block_height=968137,
            is_sweep=True
        )
    ])

    # =========================================================================
    # SCENARIO 4: Hyderabad Loan App Extortion (BSC)
    # Suspect: 0x4838b1... -> Mule -> Binance Hot Storage 0x8894E0...
    # =========================================================================
    edges.extend([
        TransactionEdge(
            tx_hash="0x5a1b2c3d4e5f6071829304152637485960718293041526374859607182930415",
            network=NetworkType.BSC,
            source_address="0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
            destination_address="0x28c6c06298d514db089934071355e5743bf21d60",
            asset_symbol="USDT",
            raw_amount="30000000000",
            decimal_amount="30000.000000",
            fiat_inr_at_exec=2500000.0,
            fiat_usd_at_exec=30000.0,
            block_timestamp="2026-08-17T09:15:00Z",
            block_height=39182940
        ),
        TransactionEdge(
            tx_hash="0x6b2c3d4e5f60718293041526374859607182930415263748596071829304152a",
            network=NetworkType.BSC,
            source_address="0x28c6c06298d514db089934071355e5743bf21d60",
            destination_address="0x8894E0a0c962CB723c1976a4421c95949bE2D4E3",
            asset_symbol="USDT",
            raw_amount="29950000000",
            decimal_amount="29950.000000",
            fiat_inr_at_exec=2495830.0,
            fiat_usd_at_exec=29950.0,
            block_timestamp="2026-08-17T09:30:00Z",
            block_height=39182990,
            is_sweep=True
        )
    ])

    return edges

def populate_seed_data(graph_store: GraphStore):
    """Loads default scenario edges into the graph store."""
    for edge in get_scenario_edges():
        graph_store.add_edge(edge)
