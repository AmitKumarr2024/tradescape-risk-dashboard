import { useState } from "react";
import { Maximize2, Minimize2, Pencil, Trash2 } from "lucide-react";
import { formatPnL } from "../../utils/currency";

export interface Trade {
    id: number;
    asset: string;
    direction: "Long" | "Short";
    pnl: number;
    createdAt: string;
}

interface TradeTableProps {
    trades: Trade[];
    onEdit?: (trade: Trade) => void;
    onDelete?: (id: number) => void;
}

// One trade rendered as a compact card — used on mobile screens where a
// full table doesn't fit, keeping row/card markup out of the main render.
function TradeCard({
    trade,
    onEdit,
    onDelete,
}: {
    trade: Trade;
    onEdit?: (trade: Trade) => void;
    onDelete?: (id: number) => void;
}) {
    const isProfit = trade.pnl >= 0;

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/30">
            <div className="min-w-0">
                <p className="truncate font-medium text-slate-900 dark:text-white">
                    {trade.asset} {trade.direction}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {trade.createdAt}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <span
                    className={`font-semibold ${isProfit ? "text-emerald-500" : "text-rose-500"
                        }`}
                >
                    {formatPnL(trade.pnl)}
                </span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit?.(trade)}
                        aria-label="Edit trade"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete?.(trade.id)}
                        aria-label="Delete trade"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-rose-400"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
    // Controls whether this card is showing as a full-screen overlay.
    const [isExpanded, setIsExpanded] = useState(false);

    const content = (
        <div
            className={
                isExpanded
                    ? "flex h-full flex-col overflow-hidden rounded-none border-0 bg-white shadow-none dark:bg-slate-900"
                    : "overflow-hidden rounded-xl border border-slate-200 bg-white shadow transition-colors dark:border-slate-800 dark:bg-slate-900"
            }
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                        Trade History
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                        Recent trading activity.
                    </p>
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

            {/* Body: no trades */}
            {trades.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No trades available.
                </p>
            ) : (
                <>
                    {/* Mobile: stacked cards, hidden from sm up */}
                    <div
                        className={`space-y-2 p-4 sm:hidden ${isExpanded ? "flex-1 overflow-y-auto" : ""
                            }`}
                    >
                        {trades.map((trade) => (
                            <TradeCard
                                key={trade.id}
                                trade={trade}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>

                    {/* Desktop/tablet: real table, hidden below sm */}
                    <div
                        className={`hidden overflow-x-auto sm:block ${isExpanded ? "flex-1 overflow-y-auto" : ""
                            }`}
                    >
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/40">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Trade
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        P&amp;L
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {trades.map((trade) => (
                                    <tr
                                        key={trade.id}
                                        className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {trade.asset} {trade.direction}
                                        </td>

                                        <td
                                            className={`px-6 py-4 text-right font-semibold ${trade.pnl >= 0
                                                    ? "text-emerald-500"
                                                    : "text-rose-500"
                                                }`}
                                        >
                                            {formatPnL(trade.pnl)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit?.(trade)}
                                                    aria-label="Edit trade"
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete?.(trade.id)}
                                                    aria-label="Delete trade"
                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );

    // When expanded, render as a full-screen overlay instead of inline.
    if (isExpanded) {
        return (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm sm:p-8">
                <div className="mx-auto h-full max-w-5xl">{content}</div>
            </div>
        );
    }

    return content;
}