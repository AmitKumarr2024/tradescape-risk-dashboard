import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { Trade } from "../../types/trade";

interface TradeFormProps {
    trade?: Trade | null;
    onCancel: () => void;
    onSave?: (trade: {
        asset: string;
        direction: "Long" | "Short";
        pnl: number;
    }) => void;
}

const fieldClass =
    "w-full border bg-[var(--bg)] p-3 font-mono text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--green)]";
const fieldStyle = { borderColor: "var(--border)" } as const;

export default function TradeForm({
    trade,
    onCancel,
    onSave,
}: TradeFormProps) {

    // Form state
    const [asset, setAsset] = useState("BTC");
    const [direction, setDirection] = useState<"Long" | "Short">("Long");
    const [pnl, setPnl] = useState("");


    // Populate form when editing an existing trade
    useEffect(() => {
        if (trade) {
            setAsset(trade.asset);
            setDirection(trade.direction);
            setPnl(trade.pnl.toString());
        } else {
            resetForm();
        }
    }, [trade]);


    // Restore form to its default values
    const resetForm = () => {
        setAsset("BTC");
        setDirection("Long");
        setPnl("");
    };


    // Validate and submit the trade
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure P&L is provided
        if (!pnl.trim()) {
            toast.error("Please enter Profit / Loss.");
            return;
        }

        const pnlValue = Number(pnl);

        // Prevent invalid numeric values
        if (Number.isNaN(pnlValue)) {
            toast.error("Invalid Profit / Loss value.");
            return;
        }

        // Send trade data back to the parent component
        onSave?.({
            asset,
            direction,
            pnl: pnlValue,
        });

        // Show feedback based on the current action
        toast.success(
            trade
                ? "Trade updated successfully."
                : "Trade added successfully."
        );

        // Prepare form for the next trade
        resetForm();
    };


    // Close the form and discard unsaved changes
    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Select trading asset */}
            <div>
                <label
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-dim)" }}
                >
                    Asset
                </label>

                <select
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className={fieldClass}
                    style={fieldStyle}
                >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                </select>
            </div>

            {/* Select trade direction */}
            <div>
                <label
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-dim)" }}
                >
                    Direction
                </label>

                <select
                    value={direction}
                    onChange={(e) =>
                        setDirection(e.target.value as "Long" | "Short")
                    }
                    className={fieldClass}
                    style={fieldStyle}
                >
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                </select>
            </div>

            {/* Enter profit or loss amount */}
            <div>
                <label
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--text-dim)" }}
                >
                    Profit / Loss
                </label>

                <input
                    type="number"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="Enter P&L"
                    className={fieldClass}
                    style={fieldStyle}
                />
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={handleCancel}
                    className="border px-5 py-2 font-mono text-xs uppercase tracking-[0.06em] transition-colors duration-150 hover:bg-[var(--panel-hover)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-mid)" }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="border px-5 py-2 font-mono text-xs font-medium uppercase tracking-[0.06em] transition-colors duration-150"
                    style={{
                        borderColor: "var(--green)",
                        backgroundColor: "var(--green-dim)",
                        color: "var(--green)",
                    }}
                >
                    {trade ? "Update Trade" : "Save Trade"}
                </button>

            </div>

        </form>
    );
}