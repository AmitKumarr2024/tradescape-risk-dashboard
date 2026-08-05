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
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Asset
                </label>

                <select
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                </select>
            </div>

            {/* Select trade direction */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Direction
                </label>

                <select
                    value={direction}
                    onChange={(e) =>
                        setDirection(e.target.value as "Long" | "Short")
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                </select>
            </div>

            {/* Enter profit or loss amount */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Profit / Loss
                </label>

                <input
                    type="number"
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="Enter P&L"
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-500"
                >
                    {trade ? "Update Trade" : "Save Trade"}
                </button>

            </div>

        </form>
    );
}