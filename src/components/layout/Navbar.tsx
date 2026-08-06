import { Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
    onAddTrade: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

export default function Navbar({
    onAddTrade,
    search,
    onSearchChange,
}: NavbarProps) {

    // Store the current theme and restore the user's last preference
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved ? saved === "dark" : true;
    });

    // Apply theme changes and save the preference
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        // Sticky navigation bar displayed across the dashboard
        <header
            className="sticky top-9 z-40 border-b backdrop-blur transition-colors"
            style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg) 90%, transparent)" }}
        >

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Application branding */}
                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center border" style={{ borderColor: "var(--border)" }}>
                        <img
                            src="/android-chrome-512x512.png"
                            alt="Tradescape Logo"
                            className="h-11 w-11 object-contain aspect-video"
                        />
                    </div>

                    <div>
                        <h1 className="font-mono text-sm font-bold uppercase tracking-[0.06em]" style={{ color: "var(--text)" }}>
                            Tradescape
                        </h1>

                        <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--text-dim)" }}>
                            Trader Risk Dashboard
                        </p>
                    </div>

                </div>

                {/* Search trades by asset, direction, or other keywords */}
                <div className="mx-8 hidden max-w-md flex-1 lg:block">

                    <div className="relative">

                        {/* Search icon */}
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--text-dim)" }}
                        />

                        {/* Controlled search input */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search trades..."
                            className="w-full border bg-[var(--bg)] py-2 pl-10 pr-4 font-mono text-sm outline-none transition-colors focus:border-[var(--green)]"
                            style={{ borderColor: "var(--border)", color: "var(--text)" }}
                        />

                    </div>

                </div>

                {/* Dashboard actions */}
                <div className="flex items-center gap-3">

                    {/* Toggle between light and dark theme */}
                    <button
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="border p-2 transition-colors duration-150 hover:bg-[var(--panel-hover)]"
                        style={{ borderColor: "var(--border)" }}
                    >
                        {darkMode ? (
                            <Sun size={16} style={{ color: "var(--amber)" }} />
                        ) : (
                            <Moon size={16} style={{ color: "var(--text-mid)" }} />
                        )}
                    </button>

                    {/* Open the Add Trade modal */}
                    <button
                        onClick={onAddTrade}
                        className="border px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.06em] transition-colors duration-150"
                        style={{
                            borderColor: "var(--green)",
                            backgroundColor: "var(--green-dim)",
                            color: "var(--green)",
                        }}
                    >
                        + Add Trade
                    </button>

                </div>

            </div>

        </header>
    );
}