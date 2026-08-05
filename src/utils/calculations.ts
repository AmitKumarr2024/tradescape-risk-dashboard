import type { Account } from "../types/account";
import type { Trade } from "../types/trade";
import { calculateRisk, type RiskStatus } from "./risk";

// Aggregated metrics displayed across the trading dashboard
export interface DashboardMetrics {
    totalPnL: number;
    currentBalance: number;

    winningTrades: number;
    losingTrades: number;
    winRate: number;

    largestWinningTrade: number;
    largestLosingTrade: number;

    // "Live" drawdown — how far below peak the account is RIGHT NOW.
    // This is what should drive the risk indicator, because a trader
    // who dipped and recovered isn't currently in danger.
    currentDrawdown: number;
    remainingDrawdown: number;

    // The worst dip that has EVER occurred in the account's history.
    // Useful context, but it is not the same thing as "current" risk.
    maxDrawdown: number;

    currentDayLoss: number;
    remainingDailyLoss: number;

    riskStatus: RiskStatus;
    riskUsage: number;

    equityData: {
        trade: string;
        balance: number;
    }[];
}

// Calculates all dashboard statistics from the account and trade history
export function calculateMetrics(
    account: Account,
    trades: Trade[]
): DashboardMetrics {
    // Total profit / loss across all trades
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);

    // Current account balance after applying all trades
    const currentBalance = account.startingBalance + totalPnL;

    // Count profitable / losing trades
    const winningTrades = trades.filter((trade) => trade.pnl > 0).length;
    const losingTrades = trades.filter((trade) => trade.pnl < 0).length;

    // Win percentage (guarded against divide-by-zero)
    const winRate =
        trades.length === 0
            ? 0
            : Number(((winningTrades / trades.length) * 100).toFixed(1));

    // Largest winning / losing trade
    const largestWinningTrade =
        trades.length === 0 ? 0 : Math.max(...trades.map((t) => t.pnl), 0);

    const largestLosingTrade =
        trades.length === 0 ? 0 : Math.min(...trades.map((t) => t.pnl), 0);

    /*
      Build the equity curve while tracking the peak balance.
      We now compute TWO different drawdown numbers:

      - maxDrawdown: the single largest peak-to-trough dip that has
        EVER happened in the account's history (a historical stat).

      - currentDrawdown: how far the account is below its peak
        RIGHT NOW (peak - currentBalance). This is what actually
        determines whether the trader is in danger today, because
        the account may have dipped and since recovered.
    */
    let runningBalance = account.startingBalance;
    let peakBalance = account.startingBalance;
    let maxDrawdown = 0;

    const equityData = [{ trade: "Start", balance: account.startingBalance }];

    for (const trade of trades) {
        runningBalance += trade.pnl;
        peakBalance = Math.max(peakBalance, runningBalance);
        maxDrawdown = Math.max(maxDrawdown, peakBalance - runningBalance);

        equityData.push({
            trade: `${trade.asset} ${trade.direction}`,
            balance: runningBalance,
        });
    }

    // The account's CURRENT distance below its peak (0 if sitting at peak)
    const currentDrawdown = Math.max(0, peakBalance - currentBalance);

    /*
      Daily loss should only count losing trades from the CURRENT
      trading day — previously it summed every losing trade in the
      whole array regardless of date, which is wrong once trades
      span more than one day.

      We treat "today" as the date of the most recent trade, rather
      than the real calendar date. This keeps the math correct for
      mock/demo data (which is dated in the past or future relative
      to whenever this is actually run) while still behaving
      correctly for a live app: as new trades come in, "today"
      naturally becomes the date of the latest trade.
    */
    const latestTradeDate =
        trades.length === 0
            ? null
            : trades.reduce((latest, trade) =>
                new Date(trade.createdAt) > new Date(latest.createdAt)
                    ? trade
                    : latest
            ).createdAt;

    const todayKey = latestTradeDate
        ? new Date(latestTradeDate).toDateString()
        : null;

    const currentDayLoss = Math.abs(
        trades
            .filter(
                (trade) =>
                    trade.pnl < 0 &&
                    new Date(trade.createdAt).toDateString() === todayKey
            )
            .reduce((sum, trade) => sum + trade.pnl, 0)
    );

    // Delegate the actual risk verdict to the single source of truth
    const risk = calculateRisk({
        maximumDrawdown: account.maximumDrawdown,
        dailyLossLimit: account.dailyLossLimit,
        currentDrawdown,
        currentDayLoss,
    });

    return {
        totalPnL,
        currentBalance,

        winningTrades,
        losingTrades,
        winRate,

        largestWinningTrade,
        largestLosingTrade,

        currentDrawdown: risk.currentDrawdown,
        remainingDrawdown: risk.remainingDrawdown,
        maxDrawdown,

        currentDayLoss: risk.currentDayLoss,
        remainingDailyLoss: risk.remainingDailyLoss,

        riskStatus: risk.riskStatus,
        riskUsage: risk.riskUsage,

        equityData,
    };
}
