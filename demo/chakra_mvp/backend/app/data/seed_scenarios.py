"""
Project CHAKRA: Authentic Indian Cybercrime Seed Scenarios
Pre-compiled testbeds representing real cybercrime typologies investigated by State Cyber Cells & I4C.
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
        "suspect_wallet": "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
        "summary": "Victim defrauded of ₹45 Lakh in a fake YouTube rating scam. Funds converted to TRC-20 USDT, hopped across 3 unhosted mule wallets, and swept into Binance Hot Wallet 14."
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
        "suspect_wallet": "0x71aC4e8812fB567c9d01234567890abcdef12345",
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
        "suspect_wallet": "bc1qar0s523456789abcdef0123456789abcdef01",
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
        "suspect_wallet": "0x88fDe31aC8821940000000000000000000000001",
        "summary": "Blackmail extortion proceeds in BSC USDT routed through FixedFloat swap contract to Tron, subsequently deposited into CoinSwitch Kuber."
    }
]

def get_scenario_edges() -> List[TransactionEdge]:
    """Builds realistic, multi-hop transaction edges with verified timestamps and amounts."""
    edges = []

    # =========================================================================
    # SCENARIO 1: Bengaluru Telegram Task Fraud (TRON TRC-20 USDT)
    # Suspect: TXa7bK9mP...
    # -> Hop 1: Fan-out to 3 mule wallets (15k USDT each)
    # -> Hop 2: Mule 1 (TY1...) forwards 14,950 USDT to candidate deposit address TZ_dep7k9L...
    # -> Hop 3: Candidate deposit is fueled with 15 TRX gas from Binance fueler,
    #           then swept 100% (14,950 USDT) to Binance Hot Wallet 14 (TND5...)
    # =========================================================================
    edges.extend([
        # Hop 1 (Fan-out)
        TransactionEdge(
            tx_hash="0x4f8a2b91c7e63d01111111111111111111111111111111111111111111111111",
            network=NetworkType.TRON,
            source_address="TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
            destination_address="TY1muleWalletAlpha99281aBcDeFgHiJkLmNoPq",
            asset_symbol="USDT",
            raw_amount="15000000000",
            decimal_amount="15000.000000",
            fiat_inr_at_exec=1245000.0,
            fiat_usd_at_exec=15000.0,
            block_timestamp="2026-08-14T08:12:00Z",
            block_height=63291820
        ),
        TransactionEdge(
            tx_hash="0x4f8a2b91c7e63d02222222222222222222222222222222222222222222222222",
            network=NetworkType.TRON,
            source_address="TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
            destination_address="TY2muleWalletBeta88192aBcDeFgHiJkLmNoPqR",
            asset_symbol="USDT",
            raw_amount="15000000000",
            decimal_amount="15000.000000",
            fiat_inr_at_exec=1245000.0,
            fiat_usd_at_exec=15000.0,
            block_timestamp="2026-08-14T08:13:30Z",
            block_height=63291850
        ),
        TransactionEdge(
            tx_hash="0x4f8a2b91c7e63d03333333333333333333333333333333333333333333333333",
            network=NetworkType.TRON,
            source_address="TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
            destination_address="TY3muleWalletGamma77182aBcDeFgHiJkLmNoPq",
            asset_symbol="USDT",
            raw_amount="15000000000",
            decimal_amount="15000.000000",
            fiat_inr_at_exec=1245000.0,
            fiat_usd_at_exec=15000.0,
            block_timestamp="2026-08-14T08:15:00Z",
            block_height=63291880
        ),

        # Hop 2 (Forward to Candidate Deposit Address)
        TransactionEdge(
            tx_hash="0x7a1b8c3d4e5f6011111111111111111111111111111111111111111111111111",
            network=NetworkType.TRON,
            source_address="TY1muleWalletAlpha99281aBcDeFgHiJkLmNoPq",
            destination_address="TZ_dep7k9L2vM8vN7aBcDeFgHiJ1k0pBinanceDep",
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
            tx_hash="0x9a1c8f3e2b7d0111111111111111111111111111111111111111111111111111",
            network=NetworkType.TRON,
            source_address="TZ_dep7k9L2vM8vN7aBcDeFgHiJ1k0pBinanceDep",
            destination_address="TND5RzC9hZvxKqj8W8kP2qM4Y1e7uL0sK9",  # Binance Hot Wallet 14
            asset_symbol="USDT",
            raw_amount="14950000000",
            decimal_amount="14950.000000",
            fiat_inr_at_exec=1240850.0,
            fiat_usd_at_exec=14950.0,
            block_timestamp="2026-08-14T08:32:00Z",  # 8 mins later
            block_height=63292220,
            is_sweep=True,
            gas_payer="TFuelerBinanceTRX99281aBcDeFgHiJkLmNo",  # Gas sponsored by Binance
            tx_type="SWEEP_CONTRACT"
        )
    ])

    # =========================================================================
    # SCENARIO 2: Mumbai Fake Trading App (POLYGON EVM USDT)
    # Suspect: 0x71aC4e8... -> Mule -> Deposit -> CoinDCX Vault 02
    # =========================================================================
    edges.extend([
        TransactionEdge(
            tx_hash="0xbb11223344556677889900aabbccddeeff0011223344556677889900aabbccdd",
            network=NetworkType.POL,
            source_address="0x71aC4e8812fB567c9d01234567890abcdef12345",
            destination_address="0x9bf8281aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456",
            asset_symbol="USDT",
            raw_amount="144500000000",
            decimal_amount="144500.000000",
            fiat_inr_at_exec=12000000.0,
            fiat_usd_at_exec=144500.0,
            block_timestamp="2026-08-15T11:05:00Z",
            block_height=58291024
        ),
        TransactionEdge(
            tx_hash="0xcc223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
            network=NetworkType.POL,
            source_address="0x9bf8281aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456",
            destination_address="0x4f8a2b91c7e63d00000000000000000000000001",  # CoinDCX Primary Vault
            asset_symbol="USDT",
            raw_amount="144400000000",
            decimal_amount="144400.000000",
            fiat_inr_at_exec=1198520.0,
            fiat_usd_at_exec=144400.0,
            block_timestamp="2026-08-15T11:18:00Z",
            block_height=58291284,
            is_sweep=True,
            gas_payer="0x111111CoinDCXFuelerGasAddress000000",
            tx_type="SWEEP_CONTRACT"
        )
    ])

    # =========================================================================
    # SCENARIO 3: Delhi Hospital Ransomware (BITCOIN SegWit)
    # Suspect: bc1qar0s... -> Peeling Chain -> WazirX User Deposit -> WazirX Hot 03
    # =========================================================================
    edges.extend([
        # Peeling payment
        TransactionEdge(
            tx_hash="f1e2d3c4b5a60718293041526374859607182930415263748596071829304152",
            network=NetworkType.BTC,
            source_address="bc1qar0s523456789abcdef0123456789abcdef01",
            destination_address="bc1qmuleAlphaSegWitBtc8819201234567890abcdef",
            asset_symbol="BTC",
            raw_amount="75000000",
            decimal_amount="0.75000000",
            fiat_inr_at_exec=4350000.0,
            fiat_usd_at_exec=52500.0,
            block_timestamp="2026-08-16T14:20:00Z",
            block_height=894120
        ),
        # Deposit into WazirX
        TransactionEdge(
            tx_hash="a1b2c3d4e5f60718293041526374859607182930415263748596071829304152",
            network=NetworkType.BTC,
            source_address="bc1qmuleAlphaSegWitBtc8819201234567890abcdef",
            destination_address="3P3qWazirXHotStorage03Btc9999999999999",  # WazirX Hot Storage 03
            asset_symbol="BTC",
            raw_amount="74950000",
            decimal_amount="0.74950000",
            fiat_inr_at_exec=4347100.0,
            fiat_usd_at_exec=52465.0,
            block_timestamp="2026-08-16T14:45:00Z",
            block_height=894124,
            is_sweep=True
        )
    ])

    return edges

def populate_seed_data(graph_store: GraphStore):
    """Loads default scenario edges into the graph store."""
    for edge in get_scenario_edges():
        graph_store.add_edge(edge)
