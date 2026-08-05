import type { Account } from "../types/account";

// Default trading account configuration used throughout the dashboard
export const account: Account = {
    // Initial account balance before any trades
    startingBalance: 100000,

    // Current account balance (updated through calculations)
    currentBalance: 103250,

    // Maximum loss allowed before violating the account rules
    maximumDrawdown: 10000,

    // Maximum loss allowed in a single trading day
    dailyLossLimit: 5000,
};