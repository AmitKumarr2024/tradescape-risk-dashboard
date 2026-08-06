export type BadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

// Status colors keyed to the terminal token set. Kept as literal hex
// here (rather than var(--x)) since inline style values can't resolve
// CSS custom properties inside rgba()-style opacity math reliably
// across all consumers — swap these if the token palette changes.
const colors: Record<BadgeVariant, string> = {
    success: "#00d68f",
    warning: "#ffb020",
    danger: "#ff4d5e",
    info: "#96a3b3",
};

export default function Badge({
    label,
    variant = "info",
}: BadgeProps) {
    const color = colors[variant];

    return (
        // Small mono, uppercase status pill: 1px border in the status
        // color, background at ~13% opacity, solid dot as leading icon.
        <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{
                borderColor: color,
                backgroundColor: `${color}22`,
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