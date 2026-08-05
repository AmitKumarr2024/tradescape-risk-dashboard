import type { Trade } from "../types/trade";

/**
 * Common helper functions used across the trading dashboard.
 */

/**
 * Generates the next unique trade ID.
 */
export function generateTradeId(trades: Trade[]): number {

    // Start IDs from 1 when no trades exist
    if (trades.length === 0) {
        return 1;
    }

    // Increment the highest existing ID
    return Math.max(...trades.map((trade) => trade.id)) + 1;
}

/**
 * Returns the current date and time.
 * Example:
 * 2026-08-04 22:35
 */
export function getCurrentDateTime(): string {
    return new Date().toLocaleString("sv-SE", {
        hour12: false,
    });
}

/**
 * Restricts a value between the specified minimum and maximum.
 */
export function clamp(
    value: number,
    min: number,
    max: number
): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Calculates a percentage safely.
 * Returns 0 when the total is zero.
 */
export function calculatePercentage(
    value: number,
    total: number
): number {

    // Prevent division by zero
    if (total === 0) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(1));
}

/**
 * Returns true if the trade generated a profit.
 */
export function isWinningTrade(trade: Trade): boolean {
    return trade.pnl > 0;
}

/**
 * Returns true if the trade generated a loss.
 */
export function isLosingTrade(trade: Trade): boolean {
    return trade.pnl < 0;
}

/**
 * Filters trades using a case-insensitive search.
 * Matches both the asset name and trade direction.
 */
export function filterTrades(
    trades: Trade[],
    search: string
): Trade[] {

    // Return all trades when no search term is provided
    if (!search.trim()) {
        return trades;
    }

    const keyword = search.toLowerCase();

    return trades.filter((trade) =>
        `${trade.asset} ${trade.direction}`
            .toLowerCase()
            .includes(keyword)
    );
}

/**
 * Sorts trades by date in descending order.
 * Newest trades appear first.
 */
export function sortTradesByDate(
    trades: Trade[]
): Trade[] {

    // Create a new array to avoid mutating the original
    return [...trades].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );
}