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
                size={13}
                className="cursor-help transition"
                style={{ color: "var(--text-dim)" }}
            />
            {/* Narrower + left-anchored on mobile so it doesn't overflow the viewport */}
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
                <p
                    className="font-mono text-[10px] uppercase tracking-[0.08em] sm:text-[11px]"
                    style={{ color: "var(--text-dim)" }}
                >
                    {label}
                </p>
                <Tooltip text={tooltip} />
            </div>
            <h3 className={`font-mono text-xl font-bold sm:text-2xl ${valueClass}`}>
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
            icon: <CheckCircle2 className="h-5 w-5" style={{ color: "var(--green)" }} />,
            variant: "success",
        },
        "Approaching Limit": {
            icon: <AlertTriangle className="h-5 w-5" style={{ color: "var(--amber)" }} />,
            variant: "warning",
        },
        "At Risk": {
            icon: <ShieldAlert className="h-5 w-5" style={{ color: "var(--red)" }} />,
            variant: "danger",
        },
    };

    const config = statusConfig[status];

    return (
        // Card displaying account risk information — hairline border, flat corners
        <div className="p-4 sm:p-6">
            {/* Header — stacks on very small screens, row on larger ones */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    {config.icon}
                    <h2 className="font-mono text-lg font-bold uppercase tracking-[0.04em] sm:text-xl">
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
                    valueClass="text-[var(--text)]"
                    tooltip="How far your balance is below its peak right now. This — not the historical worst — is what determines your risk today."
                />

                <RiskStat
                    label="Remaining Drawdown"
                    value={formatCurrency(remainingDrawdown)}
                    valueClass="text-[var(--green)]"
                    tooltip="Amount you can still lose before hitting the maximum drawdown limit."
                />

                <RiskStat
                    label="Today's Loss"
                    value={formatCurrency(currentDayLoss)}
                    valueClass="text-[var(--red)]"
                    tooltip="Total losses accumulated during the current trading day only."
                />

                <RiskStat
                    label="Remaining Daily Limit"
                    value={formatCurrency(remainingDailyLoss)}
                    valueClass="text-[var(--text-mid)]"
                    tooltip="Remaining amount you can lose today before hitting the daily loss limit."
                />
            </div>

            {/* Worst historical dip — separate context, not the "current" figure */}
            <p className="mt-4 font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                Worst drawdown on record:{" "}
                <span className="font-medium" style={{ color: "var(--text-mid)" }}>
                    {formatCurrency(maxDrawdown)}
                </span>
            </p>

            {/* Overall risk usage bar */}
            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                <div
                    className="mb-2 flex items-center justify-between font-mono text-xs"
                    style={{ color: "var(--text-dim)" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="uppercase tracking-[0.08em]">Risk Usage</span>
                        <Tooltip text="The higher of your drawdown usage % and daily loss usage % — whichever limit is closer to being breached." />
                    </div>
                    <span>{riskUsage.toFixed(1)}%</span>
                </div>

                <ProgressBar value={riskUsage} variant={config.variant} showLabel={false} />

                <p className="mt-3 font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                    Status:{" "}
                    <span className="font-medium" style={{ color: "var(--text)" }}>
                        {status.toUpperCase()}
                    </span>
                </p>
            </div>
        </div>
    );
}