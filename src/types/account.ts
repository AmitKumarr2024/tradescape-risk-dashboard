// Represents the trading account configuration and risk limits
export interface Account {

    // Initial account balance before any trades
    startingBalance: number;

    // Current account balance after applying trade results
    currentBalance: number;

    // Maximum loss allowed before breaching the account rules
    maximumDrawdown: number;

    // Maximum loss allowed within a single trading day
    dailyLossLimit: number;
}