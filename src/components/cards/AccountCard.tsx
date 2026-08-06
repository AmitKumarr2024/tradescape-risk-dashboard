import { Info } from "lucide-react";

interface AccountCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    valueColor?: string;
    definition?: string;
}

export default function AccountCard({
    title,
    value,
    subtitle,
    valueColor = "text-[var(--text)]",
    definition,
}: AccountCardProps) {
    return (
        // Reusable dashboard metric card — sits inside a 1px-bordered grid cell,
        // so no border/shadow/radius of its own, just background + hover shift.
        <div className="h-full p-4 transition-colors duration-150 hover:bg-[var(--panel-hover)] sm:p-5">
            <div className="flex items-start justify-between">
                <div className="w-full">
                    {/* Metric title with optional help tooltip */}
                    <div className="flex items-center gap-2">
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.08em] sm:text-[11px]"
                            style={{ color: "var(--text-dim)" }}
                        >
                            {title}
                        </p>

                        {/* Show definition only when provided */}
                        {definition && (
                            <div className="group relative">
                                {/* Help icon */}
                                <Info
                                    size={13}
                                    className="cursor-help transition"
                                    style={{ color: "var(--text-dim)" }}
                                />

                                {/* Tooltip — narrower on mobile so it doesn't overflow the
                                    viewport, and left-anchored instead of centering off-screen */}
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

                    {/* Main metric value — scales down on small screens so long
                        currency strings (e.g. $103,250) never wrap oddly */}
                    <h3
                        className={`mt-2 wrap-break-words font-mono text-xl font-bold sm:mt-3 sm:text-3xl ${valueColor}`}
                    >
                        {value}
                    </h3>

                    {/* Additional information (optional) */}
                    {subtitle && (
                        <p
                            className="mt-2 font-mono text-xs"
                            style={{ color: "var(--text-dim)" }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}