import { useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Info, Maximize2, Minimize2, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercentage } from "../../utils/currency";

interface EquityData {
    trade: string;
    balance: number;
}

interface EquityChartProps {
    data: EquityData[];
}

const GREEN = "#00d68f";
const RED = "#ff4d5e";

// Small reusable tooltip for metric labels
function InfoTip({ text }: { text: string }) {
    return (
        <div className="group relative">
            <Info size={13} className="cursor-help" style={{ color: "var(--text-dim)" }} />
            <div
                className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 border p-3 text-xs leading-5 group-hover:block sm:left-1/2 sm:w-64 sm:-translate-x-1/2"
                style={{
                    backgroundColor: "var(--panel)",
                    borderColor: "var(--border)",
                    color: "var(--text-mid)",
                }}
            >
                {text}
            </div>
        </div>
    );
}

// Custom tooltip rendered by Recharts on hover — styled to match the
// rest of the dashboard instead of the default Recharts box.
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    const value = payload[0].value as number;

    return (
        <div
            className="border px-3 py-2 font-mono"
            style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
        >
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {label}
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {formatCurrency(value)}
            </p>
        </div>
    );
}

export default function EquityChart({ data }: EquityChartProps) {
    // Controls whether this card is showing as a full-screen overlay.
    const [isExpanded, setIsExpanded] = useState(false);

    // Empty state — no maximize toggle needed since there's nothing to
    // view in more detail yet.
    if (data.length <= 1) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex h-64 flex-col items-center justify-center text-center sm:h-80">
                    <TrendingUp
                        size={40}
                        className="mb-4 sm:size-12"
                        style={{ color: "var(--text-dim)" }}
                    />
                    <h3 className="font-mono text-lg font-bold uppercase tracking-[0.04em] sm:text-xl">
                        No Equity Data
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
                        Add your first trade to generate the equity curve.
                    </p>
                </div>
            </div>
        );
    }

    // Extract balance history for summary calculations
    const balances = data.map((d) => d.balance);
    const highest = Math.max(...balances);
    const lowest = Math.min(...balances);
    const firstBalance = balances[0];
    const currentBalance = balances[balances.length - 1];
    const growth = ((currentBalance - firstBalance) / firstBalance) * 100;
    const isPositive = growth >= 0;
    const accent = isPositive ? GREEN : RED;

    const content = (
        <div
            className={isExpanded ? "flex h-full flex-col overflow-hidden" : ""}
            style={{ backgroundColor: "var(--panel)" }}
        >
            {/* When expanded we want header padding consistent with the
                collapsed state, so wrap everything below in the same
                padded container either way */}
            <div className={isExpanded ? "flex h-full flex-col p-4 sm:p-6" : "p-4 sm:p-6"}>
                {/* Header — stacks on mobile, row on larger screens */}
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-mono text-base font-bold uppercase tracking-[0.04em] sm:text-lg">
                                Equity Curve
                            </h2>
                            <InfoTip text="Displays how your account balance changes after each trade." />
                        </div>
                        <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
                            Account balance after each trade.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Current balance badge */}
                        <div
                            className="flex flex-1 items-center justify-between gap-2 border px-4 py-2 sm:flex-none sm:block sm:text-right"
                            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
                        >
                            <p
                                className="font-mono text-[10px] uppercase tracking-[0.08em]"
                                style={{ color: "var(--text-dim)" }}
                            >
                                Current Balance
                            </p>
                            <h3 className="font-mono text-base font-bold sm:text-lg" style={{ color: "var(--text)" }}>
                                {formatCurrency(currentBalance)}
                            </h3>
                        </div>

                        {/* Maximize / minimize toggle */}
                        <button
                            onClick={() => setIsExpanded((prev) => !prev)}
                            aria-label={isExpanded ? "Minimize" : "Maximize"}
                            className="shrink-0 border p-2 transition-colors duration-150 hover:bg-[var(--panel-hover)]"
                            style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}
                        >
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>
                </div>

                {/* Quick performance summary — 2 cols on phones, 4 from sm up */}
                <div
                    className="mb-5 grid grid-cols-2 gap-px border sm:mb-6 sm:grid-cols-4"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
                >
                    <div className="p-3" style={{ backgroundColor: "var(--bg)" }}>
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Peak Balance
                        </p>
                        <p className="font-mono text-sm font-semibold sm:text-base" style={{ color: "var(--green)" }}>
                            {formatCurrency(highest)}
                        </p>
                    </div>

                    <div className="p-3" style={{ backgroundColor: "var(--bg)" }}>
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Lowest Balance
                        </p>
                        <p className="font-mono text-sm font-semibold sm:text-base" style={{ color: "var(--red)" }}>
                            {formatCurrency(lowest)}
                        </p>
                    </div>

                    <div className="p-3" style={{ backgroundColor: "var(--bg)" }}>
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Growth
                        </p>
                        <p
                            className="flex items-center gap-1 font-mono text-sm font-semibold sm:text-base"
                            style={{ color: isPositive ? "var(--green)" : "var(--red)" }}
                        >
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {isPositive ? "+" : "\u2212"}
                            {formatPercentage(Math.abs(growth))}
                        </p>
                    </div>

                    <div className="p-3" style={{ backgroundColor: "var(--bg)" }}>
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Trades
                        </p>
                        <p className="font-mono text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>
                            {Math.max(0, data.length - 1)}
                        </p>
                    </div>
                </div>

                {/* Chart — fills remaining space when expanded, fixed height otherwise */}
                <div className={isExpanded ? "min-h-0 flex-1" : "h-56 sm:h-80"}>
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
                            <defs>
                                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={accent} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                stroke="#1e2731"
                                strokeDasharray="3 3"
                                vertical={false}
                                opacity={0.6}
                            />

                            <XAxis
                                dataKey="trade"
                                stroke="#6b7785"
                                tick={{ fontSize: 11, fontFamily: "monospace" }}
                                interval="preserveStartEnd"
                                tickFormatter={(value: string) =>
                                    value.length > 8 ? `${value.slice(0, 8)}…` : value
                                }
                            />

                            <YAxis
                                stroke="#6b7785"
                                tick={{ fontSize: 11, fontFamily: "monospace" }}
                                width={56}
                                domain={["dataMin - 500", "dataMax + 500"]}
                                tickFormatter={(value: number) =>
                                    `$${(value / 1000).toFixed(0)}k`
                                }
                            />

                            <Tooltip content={<ChartTooltip />} />

                            <Area
                                type="monotone"
                                dataKey="balance"
                                stroke={accent}
                                strokeWidth={2}
                                fill="url(#equityFill)"
                                isAnimationActive
                                animationDuration={900}
                                dot={{ r: 2.5, strokeWidth: 0, fill: accent }}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: "#0a0d10" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Start vs current summary */}
                <div
                    className="mt-5 flex justify-between border-t pt-4 text-xs sm:mt-6 sm:text-sm"
                    style={{ borderColor: "var(--border)" }}
                >
                    <div>
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Start
                        </p>
                        <p className="font-mono font-semibold" style={{ color: "var(--text)" }}>
                            {formatCurrency(firstBalance)}
                        </p>
                    </div>

                    <div className="text-right">
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Current
                        </p>
                        <p className="font-mono font-semibold" style={{ color: accent }}>
                            {formatCurrency(currentBalance)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isExpanded) {
        return (
            <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm sm:p-8">
                <div className="mx-auto h-full max-w-5xl">{content}</div>
            </div>
        );
    }

    return content;
}