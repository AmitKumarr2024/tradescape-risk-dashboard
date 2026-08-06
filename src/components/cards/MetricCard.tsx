import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    valueColor?: string;
    description?: string;
    definition?: string;
}

export default function MetricCard({
    title,
    value,
    icon,
    valueColor = "text-[var(--text)]",
    description,
    definition,
}: MetricCardProps) {
    return (
        // Reusable card for displaying trading metrics — sits inside a
        // 1px-bordered grid cell, no border/shadow/radius of its own.
        <div className="h-full p-4 transition-colors duration-150 hover:bg-[var(--panel-hover)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    {/* Metric title with optional help tooltip */}
                    <div className="flex items-center gap-2">
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em] sm:text-[11px]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            {title}
                        </p>

                        {/* Display explanation only when provided */}
                        {definition && (
                            <div className="group relative">
                                {/* Help icon */}
                                <Info
                                    size={13}
                                    className="cursor-help transition"
                                    style={{ color: "var(--text-dim)" }}
                                />

                                {/* Tooltip — narrower on mobile, left-anchored so it
                                    doesn't get clipped off the edge of small screens */}
                                <div
                                    className="pointer-events-none absolute left-0 top-6 z-50 hidden w-52 -translate-x-1/4 border p-3 text-xs leading-5 group-hover:block sm:left-1/2 sm:w-64 sm:-translate-x-1/2"
                                    style={{
                                        backgroundColor: "var(--panel)",
                                        borderColor: "var(--border)",
                                        color: "var(--text-mid)",
                                    }}
                                >
                                    {definition}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary metric value — scales down on mobile and wraps safely */}
                    <h3
                        className={`mt-2 wrap-break-words font-mono text-xl font-bold sm:mt-3 sm:text-3xl ${valueColor}`}
                    >
                        {value}
                    </h3>

                    {/* Optional supporting information */}
                    {description && (
                        <p
                            className="mt-2 font-mono text-xs"
                            style={{ color: "var(--text-dim)" }}
                        >
                            {description}
                        </p>
                    )}
                </div>

                {/* Optional icon — hidden on very small screens where space is
                    tight, shown from sm up */}
                {icon && (
                    <div
                        className="hidden border p-3 sm:block"
                        style={{
                            backgroundColor: "var(--bg)",
                            borderColor: "var(--border)",
                            color: "var(--text-mid)",
                        }}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}