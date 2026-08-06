export type ProgressVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface ProgressBarProps {
    value: number;
    variant?: ProgressVariant;
    showLabel?: boolean;
}

// Maps each variant to a theme CSS variable rather than a literal hex
// value, so the fill automatically flips with light/dark mode.
const colorVar: Record<ProgressVariant, string> = {
    success: "var(--green)",
    warning: "var(--amber)",
    danger: "var(--red)",
    info: "var(--text-mid)",
};

export default function ProgressBar({
    value,
    variant = "info",
    showLabel = true,
}: ProgressBarProps) {

    // Keep progress between 0% and 100%
    const progress = Math.min(Math.max(value, 0), 100);
    const color = colorVar[variant];

    return (
        <div className="w-full">

            {/* Progress label */}
            {showLabel && (
                <div className="mb-2 flex items-center justify-between">
                    <span
                        className="font-mono text-[10px] uppercase tracking-[0.08em]"
                        style={{ color: "var(--text-dim)" }}
                    >
                        Progress
                    </span>

                    <span className="font-mono text-xs font-medium" style={{ color: "var(--text)" }}>
                        {progress.toFixed(0)}%
                    </span>
                </div>
            )}

            {/* Progress track — flat, hairline border, no rounding */}
            <div
                className="h-3 w-full overflow-hidden border"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
            >
                {/* Filled progress — diagonal striped fill reads as "measured"
                    rather than decorative */}
                <div
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
                        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 2px, transparent 2px, transparent 6px)`,
                        borderRight: `2px solid ${color}`,
                    }}
                />
            </div>

        </div>
    );
}