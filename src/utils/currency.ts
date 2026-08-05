/**
 * Currency and number formatting helpers used throughout the dashboard.
 */

/**
 * Format a number as USD currency.
 * Examples:
 * 103250 -> $103,250
 * -450   -> -$450
 */
export function formatCurrency(
    value: number,
    options?: Intl.NumberFormatOptions
): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...options,
    }).format(value);
}

/**
 * Format Profit / Loss with a positive or negative sign.
 * Examples:
 * 1200 -> +$1,200
 * -450 -> -$450
 * 0    -> $0
 */
export function formatPnL(value: number): string {

    // Display zero without a sign
    if (value === 0) {
        return formatCurrency(0);
    }

    // Prefix positive values with '+' and negative values with '-'
    const sign = value > 0 ? "+" : "-";

    return `${sign}${formatCurrency(Math.abs(value))}`;
}

/**
 * Format a number as a percentage.
 * Examples:
 * 60 -> 60.0%
 * 66.666 -> 66.7%
 */
export function formatPercentage(
    value: number,
    decimals = 1
): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format a plain number using thousands separators.
 * Example:
 * 1234567 -> 1,234,567
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
}