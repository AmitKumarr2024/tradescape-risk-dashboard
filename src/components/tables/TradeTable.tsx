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
        <div
            className="flex items-center justify-between gap-3 border p-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
            <div className="min-w-0">
                <p className="truncate font-mono text-sm font-medium" style={{ color: "var(--text)" }}>
                    {trade.asset} {trade.direction.toUpperCase()}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-dim)" }}>
                    {trade.createdAt}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <span
                    className="font-mono font-semibold"
                    style={{ color: isProfit ? "var(--green)" : "var(--red)" }}
                >
                    {formatPnL(trade.pnl)}
                </span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit?.(trade)}
                        aria-label="Edit trade"
                        className="p-2 transition-colors duration-150 hover:bg-(--panel-hover)"
                        style={{ color: "var(--text-dim)" }}
                    >
                        <Pencil size={15} />
                    </button>

                    <button
                        onClick={() => onDelete?.(trade.id)}
                        aria-label="Delete trade"
                        className="p-2 transition-colors duration-150 hover:bg-(--panel-hover)"
                        style={{ color: "var(--text-dim)" }}
                    >
                        <Trash2 size={15} />
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
            className={isExpanded ? "flex h-full flex-col overflow-hidden" : "overflow-hidden"}
            style={{ backgroundColor: "var(--panel)" }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-6"
                style={{ borderColor: "var(--border)" }}
            >
                <div>
                    <h2 className="font-mono text-base font-bold uppercase tracking-[0.04em] sm:text-lg">
                        Trade History
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
                        Recent trading activity.
                    </p>
                </div>

                {/* Maximize / minimize toggle */}
                <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    aria-label={isExpanded ? "Minimize" : "Maximize"}
                    className="shrink-0 border p-2 transition-colors duration-150 hover:bg-(--panel-hover)"
                    style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}
                >
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
            </div>

            {/* Body: no trades */}
            {trades.length === 0 ? (
                <p className="px-6 py-10 text-center font-mono text-sm" style={{ color: "var(--text-dim)" }}>
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
                            <thead className="sticky top-0" style={{ backgroundColor: "var(--panel)" }}>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th
                                        className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.08em]"
                                        style={{ color: "var(--text-dim)" }}
                                    >
                                        Trade
                                    </th>
                                    <th
                                        className="px-6 py-3 text-right font-mono text-[10px] font-semibold uppercase tracking-[0.08em]"
                                        style={{ color: "var(--text-dim)" }}
                                    >
                                        P&amp;L
                                    </th>
                                    <th
                                        className="px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.08em]"
                                        style={{ color: "var(--text-dim)" }}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {trades.map((trade) => (
                                    <tr
                                        key={trade.id}
                                        className="border-t transition-colors duration-150 hover:bg-(--panel-hover)"
                                        style={{ borderColor: "var(--border)" }}
                                    >
                                        <td className="px-6 py-4 font-mono text-sm font-medium" style={{ color: "var(--text)" }}>
                                            {trade.asset} {trade.direction.toUpperCase()}
                                        </td>

                                        <td
                                            className="px-6 py-4 text-right font-mono text-sm font-semibold"
                                            style={{ color: trade.pnl >= 0 ? "var(--green)" : "var(--red)" }}
                                        >
                                            {formatPnL(trade.pnl)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit?.(trade)}
                                                    aria-label="Edit trade"
                                                    className="p-2 transition-colors duration-150 hover:bg-(--panel-hover)"
                                                    style={{ color: "var(--text-dim)" }}
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete?.(trade.id)}
                                                    aria-label="Delete trade"
                                                    className="p-2 transition-colors duration-150 hover:bg-(--panel-hover)"
                                                    style={{ color: "var(--text-dim)" }}
                                                >
                                                    <Trash2 size={16} />
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
            <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm sm:p-8">
                <div className="mx-auto h-full max-w-5xl">{content}</div>
            </div>
        );
    }

    return content;
}