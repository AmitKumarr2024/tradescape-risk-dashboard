import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

import { formatCurrency } from "../../utils/currency";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";

type RiskStatus = "Safe" | "Approaching Limit" | "At Risk";

interface RiskCardProps {
    status: RiskStatus;
    riskUsage: number; // computed once in calculateMetrics, no more hardcoded limit here
    currentDrawdown: number;
    remainingDrawdown: number;
    maxDrawdown: number; // worst historical dip — separate stat from "current"
    currentDayLoss: number;
    remainingDailyLoss: number;
}

// Small reusable tooltip used next to metric labels
function Tooltip({ text }: { text: string }) {
    return (
        <div className="group relative">
            <Info
                size={14}
                className="cursor-help text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            />
            {/* Narrower + left-anchored on mobile so it doesn't overflow the viewport */}
            <div className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:left-1/2 sm:w-64 sm:-translate-x-1/2">
                {text}
            </div>
        </div>
    );
}

// One risk metric tile, reused for all four numbers below
function RiskStat({
    label,
    value,
    valueClass,
    tooltip,
}: {
    label: string;
    value: string;
    valueClass: string;
    tooltip: string;
}) {
    return (
        <div>
            <div className="mb-1 flex items-center gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {label}
                </p>
                <Tooltip text={tooltip} />
            </div>
            <h3 className={`text-xl font-bold sm:text-2xl ${valueClass}`}>
                {value}
            </h3>
        </div>
    );
}

export default function RiskCard({
    status,
    riskUsage,
    currentDrawdown,
    remainingDrawdown,
    maxDrawdown,
    currentDayLoss,
    remainingDailyLoss,
}: RiskCardProps) {
    // Icon + badge/progress variant per risk level, kept in one place
    type StatusConfigEntry = {
        icon: React.ReactNode;
        variant: "success" | "warning" | "danger";
    };

    const statusConfig: { [key in RiskStatus]: StatusConfigEntry } = {
        Safe: {
            icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
            variant: "success",
        },
        "Approaching Limit": {
            icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
            variant: "warning",
        },
        "At Risk": {
            icon: <ShieldAlert className="h-6 w-6 text-rose-500" />,
            variant: "danger",
        },
    };

    const config = statusConfig[status];

    return (
        // Card displaying account risk information
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            {/* Header — stacks on very small screens, row on larger ones */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    {config.icon}
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                        Risk Status
                    </h2>
                    <Tooltip text="Shows how close your account is to reaching its maximum risk limits." />
                </div>

                <Badge label={status} variant={config.variant} />
            </div>

            {/* Risk metrics — 1 column on mobile, 2 on larger screens */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <RiskStat
                    label="Current Drawdown"
                    value={formatCurrency(currentDrawdown)}
                    valueClass="text-slate-900 dark:text-white"
                    tooltip="How far your balance is below its peak right now. This — not the historical worst — is what determines your risk today."
                />

                <RiskStat
                    label="Remaining Drawdown"
                    value={formatCurrency(remainingDrawdown)}
                    valueClass="text-emerald-500"
                    tooltip="Amount you can still lose before hitting the maximum drawdown limit."
                />

                <RiskStat
                    label="Today's Loss"
                    value={formatCurrency(currentDayLoss)}
                    valueClass="text-rose-500"
                    tooltip="Total losses accumulated during the current trading day only."
                />

                <RiskStat
                    label="Remaining Daily Limit"
                    value={formatCurrency(remainingDailyLoss)}
                    valueClass="text-sky-500"
                    tooltip="Remaining amount you can lose today before hitting the daily loss limit."
                />
            </div>

            {/* Worst historical dip — separate context, not the "current" figure */}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Worst drawdown on record:{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(maxDrawdown)}
                </span>
            </p>

            {/* Overall risk usage bar */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>Risk Usage</span>
                        <Tooltip text="The higher of your drawdown usage % and daily loss usage % — whichever limit is closer to being breached." />
                    </div>
                    <span>{riskUsage.toFixed(1)}%</span>
                </div>

                <ProgressBar value={riskUsage} variant={config.variant} showLabel={false} />

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Status:{" "}
                    <span className="font-medium text-slate-900 dark:text-white">
                        {status}
                    </span>
                </p>
            </div>
        </div>
    );
}