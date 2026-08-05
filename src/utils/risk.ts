/**
 * ==========================================================
 * Risk Utility — SINGLE SOURCE OF TRUTH
 * ----------------------------------------------------------
 * This is the only place risk status is decided. Previously
 * this logic was duplicated (with different thresholds) in
 * calculations.ts, which meant the dashboard could show two
 * different risk verdicts depending on which function ran.
 * That's fixed now — calculations.ts just calls this file.
 *
 * Thresholds (of whichever limit — drawdown or daily loss —
 * is closer to being breached):
 *   0%  - 69%  -> Safe
 *   70% - 89%  -> Approaching Limit
 *   90%+       -> At Risk
 * ==========================================================
 */

export type RiskStatus = "Safe" | "Approaching Limit" | "At Risk";

export interface RiskMetrics {
    /** How far the account is BELOW ITS PEAK right now (not historical worst) */
    currentDrawdown: number;

    /** Amount that can still be lost before the drawdown limit is hit */
    remainingDrawdown: number;

    /** Losses accumulated so far today */
    currentDayLoss: number;

    /** Amount that can still be lost today before the daily limit is hit */
    remainingDailyLoss: number;

    /** Overall account risk status */
    riskStatus: RiskStatus;

    /** Highest usage % between drawdown and daily loss — drives riskStatus */
    riskUsage: number;

    /** % of the max drawdown limit that has been used */
    drawdownUsage: number;

    /** % of the daily loss limit that has been used */
    dailyLossUsage: number;
}

interface CalculateRiskProps {
    maximumDrawdown: number;
    dailyLossLimit: number;
    currentDrawdown: number;
    currentDayLoss: number;
}

export function calculateRisk({
    maximumDrawdown,
    dailyLossLimit,
    currentDrawdown,
    currentDayLoss,
}: CalculateRiskProps): RiskMetrics {
    // Remaining allowance before each limit is breached
    const remainingDrawdown = Math.max(0, maximumDrawdown - currentDrawdown);
    const remainingDailyLoss = Math.max(0, dailyLossLimit - currentDayLoss);

    // Usage percentages (guarded against divide-by-zero)
    const drawdownUsage =
        maximumDrawdown === 0 ? 0 : (currentDrawdown / maximumDrawdown) * 100;

    const dailyLossUsage =
        dailyLossLimit === 0 ? 0 : (currentDayLoss / dailyLossLimit) * 100;

    // The account's overall risk is dictated by whichever limit is closer to breaking
    const riskUsage = Math.max(drawdownUsage, dailyLossUsage);

    let riskStatus: RiskStatus = "Safe";
    if (riskUsage >= 90) {
        riskStatus = "At Risk";
    } else if (riskUsage >= 70) {
        riskStatus = "Approaching Limit";
    }

    return {
        currentDrawdown,
        remainingDrawdown,
        currentDayLoss,
        remainingDailyLoss,
        riskStatus,
        riskUsage: Number(riskUsage.toFixed(1)),
        drawdownUsage: Number(drawdownUsage.toFixed(1)),
        dailyLossUsage: Number(dailyLossUsage.toFixed(1)),
    };
}
