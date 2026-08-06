import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import TradeModal from "../components/modal/TradeModal";
import TradeForm from "../components/forms/TradeForm";

import AccountCard from "../components/cards/AccountCard";
import MetricCard from "../components/cards/MetricCard";
import RiskCard from "../components/cards/RiskCard";
import TradeTable, { type Trade } from "../components/tables/TradeTable";
import EquityChart from "../components/charts/EquityChart";

import { account } from "../data/account";
import { initialTrades } from "../data/trades";

import { calculateMetrics } from "../utils/calculations";
import { formatCurrency, formatPercentage } from "../utils/currency";
import { toast } from "react-hot-toast";
import {
    generateTradeId,
    getCurrentDateTime,
    filterTrades,
    sortTradesByDate,
} from "../utils/helpers";

// Theme tokens (--bg, --panel, --border, --green, etc.) are defined in
// terminal-theme.css: light values on :root, dark overrides under
// .dark. Navbar toggles the .dark class on <html>, so every var(--x)
// reference below and in child components updates automatically —
// nothing here needs to know which theme is active.

// Small mono "eyebrow" section header: label + flex-grow hairline rule.
function SectionHeader({ label }: { label: string }) {
    return (
        <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span
                className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.1em]"
                style={{ color: "var(--text-dim)" }}
            >
                {label}
            </span>
            <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
        </div>
    );
}

// Live scrolling ticker strip — the signature "trading floor" cue.
function TickerStrip({
    balance,
    pnl,
    winRate,
    riskStatus,
    riskUsage,
}: {
    balance: number;
    pnl: number;
    winRate: number;
    riskStatus: string;
    riskUsage: number;
}) {
    const pnlPositive = pnl >= 0;
    const items: { label: string; value: string; color?: string }[] = [
        { label: "BAL", value: formatCurrency(balance) },
        {
            label: "P&L",
            value: `${pnlPositive ? "+" : "\u2212"}${formatCurrency(Math.abs(pnl))}`,
            color: pnlPositive ? "var(--green)" : "var(--red)",
        },
        { label: "WIN RATE", value: `${winRate.toFixed(1)}%` },
        {
            label: "RISK",
            value: `${riskUsage.toFixed(1)}%`,
            color:
                riskStatus === "At Risk"
                    ? "var(--red)"
                    : riskStatus === "Approaching Limit"
                        ? "var(--amber)"
                        : "var(--green)",
        },
        { label: "STATUS", value: riskStatus.toUpperCase(), color: "var(--text-mid)" },
    ];

    return (
        <div
            className="sticky top-0 z-40 flex items-center gap-6 overflow-x-auto border-b px-4 py-2 sm:px-6"
            style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
        >
            <span className="relative flex h-2 w-2 shrink-0">
                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: "var(--green)" }}
                />
                <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--green)" }}
                />
            </span>

            {items.map((item) => (
                <div key={item.label} className="flex shrink-0 items-center gap-2 font-mono text-xs">
                    <span
                        className="uppercase tracking-[0.08em]"
                        style={{ color: "var(--text-dim)" }}
                    >
                        {item.label}
                    </span>
                    <span style={{ color: item.color ?? "var(--text)" }}>{item.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    // ======================================================
    // State Management
    // ======================================================

    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [trades, setTrades] = useState(initialTrades);
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

    // ======================================================
    // Dashboard Metrics
    // ======================================================

    const metrics = calculateMetrics(account, trades);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (metrics.riskStatus === "Approaching Limit") {
                toast("⚠️ Warning: You are approaching your trading risk limit.");
            }

            if (metrics.riskStatus === "At Risk") {
                toast.error(
                    "🚨 Risk limit exceeded. Review your trading activity immediately."
                );
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [metrics.riskStatus, trades]);

    const visibleTrades = sortTradesByDate(filterTrades(trades, search));

    // ======================================================
    // Trade Operations
    // ======================================================

    const handleSaveTrade = (tradeData: {
        asset: string;
        direction: "Long" | "Short";
        pnl: number;
    }) => {
        if (editingTrade) {
            setTrades((prev) =>
                prev.map((trade) =>
                    trade.id === editingTrade.id
                        ? { ...trade, ...tradeData }
                        : trade
                )
            );

        } else {
            setTrades((prev) => [
                ...prev,
                {
                    id: generateTradeId(prev),
                    createdAt: getCurrentDateTime(),
                    ...tradeData,
                },
            ]);

        }

        setEditingTrade(null);
        setIsTradeModalOpen(false);
    };

    const handleDeleteTrade = (id: number) => {
        setTrades((prev) => prev.filter((trade) => trade.id !== id));
        toast.success("Trade deleted successfully.");
    };

    const handleEditTrade = (trade: Trade) => {
        setEditingTrade(trade);
        setIsTradeModalOpen(true);
    };

    return (
        <main
            className="relative min-h-screen font-sans transition-colors duration-200"
            style={{
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                backgroundPosition: "-1px -1px",
            }}
        >
            {/* soft radial glow for atmosphere */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-96"
                style={{
                    background:
                        "radial-gradient(ellipse at top, color-mix(in srgb, var(--green) 6%, transparent), transparent 70%)",
                }}
            />

            <TickerStrip
                balance={metrics.currentBalance}
                pnl={metrics.totalPnL}
                winRate={metrics.winRate}
                riskStatus={metrics.riskStatus}
                riskUsage={metrics.riskUsage}
            />

            <div className="relative">
                <Navbar
                    search={search}
                    onSearchChange={setSearch}
                    onAddTrade={() => {
                        setEditingTrade(null);
                        setIsTradeModalOpen(true);
                    }}
                />

                <TradeModal
                    open={isTradeModalOpen}
                    title={editingTrade ? "Edit Trade" : "Add Trade"}
                    onClose={() => setIsTradeModalOpen(false)}
                >
                    <TradeForm
                        trade={editingTrade}
                        onCancel={() => {
                            setEditingTrade(null);
                            setIsTradeModalOpen(false);
                        }}
                        onSave={handleSaveTrade}
                    />
                </TradeModal>

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
                    {/* Header */}
                    <header
                        className="mb-6 border-b pb-5 sm:mb-8 sm:pb-6"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <h1 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                            TRADER RISK TERMINAL
                        </h1>

                        <p
                            className="mt-1.5 font-mono text-xs uppercase tracking-[0.08em] sm:mt-2"
                            style={{ color: "var(--text-dim)" }}
                        >
                            Monitor trading performance and account risk.
                        </p>
                    </header>

                    {/* Account Overview */}
                    <section className="mb-6 sm:mb-8">
                        <SectionHeader label="Account Overview" />

                        <div
                            className="grid grid-cols-1 gap-px sm:grid-cols-2 xl:grid-cols-4"
                            style={{ backgroundColor: "var(--border)" }}
                        >
                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <AccountCard
                                    title="Starting Balance"
                                    value={formatCurrency(account.startingBalance)}
                                    definition="The initial amount available in the trading account before any trades are executed."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <AccountCard
                                    title="Current Balance"
                                    value={formatCurrency(metrics.currentBalance)}
                                    valueColor="text-[var(--green)]"
                                    definition="The current account balance after applying all profits and losses."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <AccountCard
                                    title="Maximum Drawdown"
                                    value={formatCurrency(account.maximumDrawdown)}
                                    valueColor="text-[var(--amber)]"
                                    definition="The maximum amount your account is allowed to lose before violating the drawdown rule."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <AccountCard
                                    title="Daily Loss Limit"
                                    value={formatCurrency(account.dailyLossLimit)}
                                    valueColor="text-[var(--red)]"
                                    definition="The maximum loss permitted during a single trading day."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Trading Performance */}
                    <section className="mb-6 sm:mb-8">
                        <SectionHeader label="Trading Performance" />

                        <div
                            className="grid grid-cols-1 gap-px sm:grid-cols-2 xl:grid-cols-3"
                            style={{ backgroundColor: "var(--border)" }}
                        >
                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Total P&L"
                                    value={formatCurrency(metrics.totalPnL)}
                                    valueColor={
                                        metrics.totalPnL >= 0
                                            ? "text-[var(--green)]"
                                            : "text-[var(--red)]"
                                    }
                                    definition="The total profit or loss generated from all recorded trades."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Winning Trades"
                                    value={metrics.winningTrades}
                                    definition="Number of trades that closed with a profit."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Losing Trades"
                                    value={metrics.losingTrades}
                                    definition="Number of trades that closed with a loss."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Win Rate"
                                    value={formatPercentage(metrics.winRate)}
                                    definition="Percentage of all trades that resulted in a profit."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Largest Winner"
                                    value={formatCurrency(metrics.largestWinningTrade)}
                                    valueColor="text-[var(--green)]"
                                    definition="The trade with the highest profit."
                                />
                            </div>

                            <div style={{ backgroundColor: "var(--panel)" }}>
                                <MetricCard
                                    title="Largest Loser"
                                    value={formatCurrency(metrics.largestLosingTrade)}
                                    valueColor="text-[var(--red)]"
                                    definition="The trade with the highest loss."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Risk */}
                    <section className="mb-6 sm:mb-8">
                        <SectionHeader label="Risk" />

                        <div
                            className="border"
                            style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
                        >
                            <RiskCard
                                status={metrics.riskStatus}
                                riskUsage={metrics.riskUsage}
                                currentDrawdown={metrics.currentDrawdown}
                                remainingDrawdown={metrics.remainingDrawdown}
                                maxDrawdown={metrics.maxDrawdown}
                                currentDayLoss={metrics.currentDayLoss}
                                remainingDailyLoss={metrics.remainingDailyLoss}
                            />
                        </div>
                    </section>

                    {/* Table + chart */}
                    <section className="grid grid-cols-1 gap-px sm:gap-px xl:grid-cols-2" style={{ backgroundColor: "var(--border)" }}>
                        <div style={{ backgroundColor: "var(--panel)" }}>
                            <TradeTable
                                trades={visibleTrades}
                                onEdit={handleEditTrade}
                                onDelete={handleDeleteTrade}
                            />
                        </div>

                        <div style={{ backgroundColor: "var(--panel)" }}>
                            <EquityChart data={metrics.equityData} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}