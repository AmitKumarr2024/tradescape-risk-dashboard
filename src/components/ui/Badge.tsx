export type BadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

// Maps each variant to a theme CSS variable rather than a literal hex
// value, so the badge automatically flips with light/dark mode instead
// of staying locked to whatever color was true at build time.
const colorVar: Record<BadgeVariant, string> = {
    success: "var(--green)",
    warning: "var(--amber)",
    danger: "var(--red)",
    info: "var(--text-mid)",
};

export default function Badge({
    label,
    variant = "info",
}: BadgeProps) {
    const color = colorVar[variant];

    return (
        // Small mono, uppercase status pill: 1px border in the status
        // color, background at ~15% opacity (via color-mix so it still
        // tracks the active theme), solid dot as leading icon.
        <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{
                borderColor: color,
                backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                color,
            }}
        >
            <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}