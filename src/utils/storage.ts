import type { Trade } from "../types/trade";

// Session storage key used to persist trades
const STORAGE_KEY = "tradescape_trades";

/**
 * Retrieves all stored trades from sessionStorage.
 * Returns an empty array if no data exists or parsing fails.
 */
export function getStoredTrades(): Trade[] {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        return JSON.parse(stored) as Trade[];
    } catch (error) {
        console.error("Failed to load trades from sessionStorage:", error);
        return [];
    }
}

/**
 * Saves the complete trade list to sessionStorage.
 */
export function saveTrades(trades: Trade[]): void {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(trades)
        );
    } catch (error) {
        console.error("Failed to save trades:", error);
    }
}

/**
 * Adds a new trade and returns the updated trade list.
 */
export function addTrade(trade: Trade): Trade[] {

    // Load existing trades
    const trades = getStoredTrades();

    // Append the new trade
    const updatedTrades = [...trades, trade];

    // Persist updated data
    saveTrades(updatedTrades);

    return updatedTrades;
}

/**
 * Updates an existing trade and returns the updated trade list.
 */
export function updateTrade(updatedTrade: Trade): Trade[] {

    // Replace the matching trade by ID
    const trades = getStoredTrades().map((trade) =>
        trade.id === updatedTrade.id
            ? updatedTrade
            : trade
    );

    // Persist updated data
    saveTrades(trades);

    return trades;
}

/**
 * Deletes a trade by its ID and returns the updated trade list.
 */
export function deleteTrade(id: number): Trade[] {

    // Remove the selected trade
    const trades = getStoredTrades().filter(
        (trade) => trade.id !== id
    );

    // Persist updated data
    saveTrades(trades);

    return trades;
}

/**
 * Removes all stored trades from sessionStorage.
 */
export function clearTrades(): void {
    sessionStorage.removeItem(STORAGE_KEY);
}