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
            toast.success("Trade updated successfully.");
        } else {
            setTrades((prev) => [
                ...prev,
                {
                    id: generateTradeId(prev),
                    createdAt: getCurrentDateTime(),
                    ...tradeData,
                },
            ]);
            toast.success("Trade added successfully.");
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
        <main className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
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
                <header className="mb-6 sm:mb-8">
                    <h1 className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-sky-400 sm:text-3xl">
                        Trader Risk Dashboard
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 sm:mt-2 sm:text-base">
                        Monitor trading performance and account risk.
                    </p>
                </header>

                {/* Account Overview */}
                <section className="mb-6 sm:mb-8">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white sm:mb-4 sm:text-xl">
                        <span className="h-5 w-1 rounded-full bg-indigo-500" />
                        Account Overview
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                        <AccountCard
                            title="Starting Balance"
                            value={formatCurrency(account.startingBalance)}
                            definition="The initial amount available in the trading account before any trades are executed."
                        />

                        <AccountCard
                            title="Current Balance"
                            value={formatCurrency(metrics.currentBalance)}
                            valueColor="text-emerald-500"
                            definition="The current account balance after applying all profits and losses."
                        />

                        <AccountCard
                            title="Maximum Drawdown"
                            value={formatCurrency(account.maximumDrawdown)}
                            valueColor="text-amber-500"
                            definition="The maximum amount your account is allowed to lose before violating the drawdown rule."
                        />

                        <AccountCard
                            title="Daily Loss Limit"
                            value={formatCurrency(account.dailyLossLimit)}
                            valueColor="text-rose-500"
                            definition="The maximum loss permitted during a single trading day."
                        />
                    </div>
                </section>

                {/* Trading Performance */}
                <section className="mb-6 sm:mb-8">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white sm:mb-4 sm:text-xl">
                        <span className="h-5 w-1 rounded-full bg-emerald-500" />
                        Trading Performance
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                        <MetricCard
                            title="Total P&L"
                            value={formatCurrency(metrics.totalPnL)}
                            valueColor={
                                metrics.totalPnL >= 0
                                    ? "text-emerald-500"
                                    : "text-rose-500"
                            }
                            definition="The total profit or loss generated from all recorded trades."
                        />

                        <MetricCard
                            title="Winning Trades"
                            value={metrics.winningTrades}
                            definition="Number of trades that closed with a profit."
                        />

                        <MetricCard
                            title="Losing Trades"
                            value={metrics.losingTrades}
                            definition="Number of trades that closed with a loss."
                        />

                        <MetricCard
                            title="Win Rate"
                            value={formatPercentage(metrics.winRate)}
                            definition="Percentage of all trades that resulted in a profit."
                        />

                        <MetricCard
                            title="Largest Winner"
                            value={formatCurrency(metrics.largestWinningTrade)}
                            valueColor="text-emerald-500"
                            definition="The trade with the highest profit."
                        />

                        <MetricCard
                            title="Largest Loser"
                            value={formatCurrency(metrics.largestLosingTrade)}
                            valueColor="text-rose-500"
                            definition="The trade with the highest loss."
                        />
                    </div>
                </section>

                {/* Risk */}
                <section className="mb-6 sm:mb-8">
                    <RiskCard
                        status={metrics.riskStatus}
                        riskUsage={metrics.riskUsage}
                        currentDrawdown={metrics.currentDrawdown}
                        remainingDrawdown={metrics.remainingDrawdown}
                        maxDrawdown={metrics.maxDrawdown}
                        currentDayLoss={metrics.currentDayLoss}
                        remainingDailyLoss={metrics.remainingDailyLoss}
                    />
                </section>

                {/* Table + chart */}
                <section className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
                    <TradeTable
                        trades={visibleTrades}
                        onEdit={handleEditTrade}
                        onDelete={handleDeleteTrade}
                    />

                    <EquityChart data={metrics.equityData} />
                </section>
            </div>
        </main>
    );
}