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

// Small reusable tooltip for metric labels
function InfoTip({ text }: { text: string }) {
    return (
        <div className="group relative">
            <Info
                size={14}
                className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            />
            <div className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:left-1/2 sm:w-64 sm:-translate-x-1/2">
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
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-white">
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
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-800 dark:bg-slate-900 sm:p-6">
                <div className="flex h-64 flex-col items-center justify-center text-center sm:h-80">
                    <TrendingUp size={40} className="mb-4 text-slate-400 sm:size-12" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                        No Equity Data
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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

    const content = (
        <div
            className={
                isExpanded
                    ? "flex h-full flex-col overflow-hidden rounded-none border-0 bg-white shadow-none dark:bg-slate-900"
                    : "rounded-xl border border-slate-200 bg-white p-4 shadow transition-all duration-200 hover:border-indigo-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            }
        >
            {/* When expanded we want header padding consistent with the
                collapsed state, so wrap everything below in the same
                padded container either way */}
            <div className={isExpanded ? "flex h-full flex-col p-4 sm:p-6" : ""}>
                {/* Header — stacks on mobile, row on larger screens */}
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                                Equity Curve
                            </h2>
                            <InfoTip text="Displays how your account balance changes after each trade." />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                            Account balance after each trade.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Current balance badge */}
                        <div className="flex flex-1 items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-white sm:flex-none sm:block sm:text-right">
                            <p className="text-xs opacity-80">Current Balance</p>
                            <h3 className="text-base font-bold sm:text-lg">
                                {formatCurrency(currentBalance)}
                            </h3>
                        </div>

                        {/* Maximize / minimize toggle */}
                        <button
                            onClick={() => setIsExpanded((prev) => !prev)}
                            aria-label={isExpanded ? "Minimize" : "Maximize"}
                            className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>
                </div>

                {/* Quick performance summary — 2 cols on phones, 4 from sm up */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-4 sm:gap-4">
                    <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                            Peak Balance
                        </p>
                        <p className="text-sm font-semibold text-emerald-500 sm:text-base">
                            {formatCurrency(highest)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                            Lowest Balance
                        </p>
                        <p className="text-sm font-semibold text-rose-500 sm:text-base">
                            {formatCurrency(lowest)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                            Growth
                        </p>
                        <p
                            className={`flex items-center gap-1 text-sm font-semibold sm:text-base ${isPositive ? "text-emerald-500" : "text-rose-500"
                                }`}
                        >
                            {isPositive ? (
                                <TrendingUp size={14} />
                            ) : (
                                <TrendingDown size={14} />
                            )}
                            {isPositive ? "+" : ""}
                            {formatPercentage(growth)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                            Trades
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
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
                                    <stop
                                        offset="5%"
                                        stopColor={isPositive ? "#6366F1" : "#F43F5E"}
                                        stopOpacity={0.35}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={isPositive ? "#6366F1" : "#F43F5E"}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                stroke="#475569"
                                strokeDasharray="3 3"
                                vertical={false}
                                opacity={0.3}
                            />

                            <XAxis
                                dataKey="trade"
                                stroke="#94A3B8"
                                tick={{ fontSize: 11 }}
                                interval="preserveStartEnd"
                                tickFormatter={(value: string) =>
                                    value.length > 8 ? `${value.slice(0, 8)}…` : value
                                }
                            />

                            <YAxis
                                stroke="#94A3B8"
                                tick={{ fontSize: 11 }}
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
                                stroke={isPositive ? "#6366F1" : "#F43F5E"}
                                strokeWidth={2.5}
                                fill="url(#equityFill)"
                                isAnimationActive
                                animationDuration={900}
                                dot={{
                                    r: 3,
                                    strokeWidth: 0,
                                    fill: isPositive ? "#6366F1" : "#F43F5E",
                                }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Start vs current summary */}
                <div className="mt-5 flex justify-between border-t border-slate-200 pt-4 text-xs dark:border-slate-800 sm:mt-6 sm:text-sm">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Start</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(firstBalance)}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-slate-500 dark:text-slate-400">Current</p>
                        <p className="font-semibold text-indigo-500">
                            {formatCurrency(currentBalance)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isExpanded) {
        return (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm sm:p-8">
                <div className="mx-auto h-full max-w-5xl">{content}</div>
            </div>
        );
    }

    return content;
}