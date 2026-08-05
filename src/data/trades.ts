import type { Trade } from "../types/trade";

// Sample trades used to populate the dashboard on initial load
export const initialTrades: Trade[] = [
    {
        // Profitable BTC long trade
        id: 1,
        asset: "BTC",
        direction: "Long",
        pnl: 1200,
        createdAt: "2026-08-04 09:30",
    },
    {
        // Losing ETH short trade
        id: 2,
        asset: "ETH",
        direction: "Short",
        pnl: -450,
        createdAt: "2026-08-04 10:15",
    },
    {
        // Profitable BTC short trade
        id: 3,
        asset: "BTC",
        direction: "Short",
        pnl: 800,
        createdAt: "2026-08-04 11:20",
    },
    {
        // Losing SOL long trade
        id: 4,
        asset: "SOL",
        direction: "Long",
        pnl: -300,
        createdAt: "2026-08-04 12:45",
    },
    {
        // Profitable ETH long trade
        id: 5,
        asset: "ETH",
        direction: "Long",
        pnl: 2000,
        createdAt: "2026-08-04 14:10",
    },
];