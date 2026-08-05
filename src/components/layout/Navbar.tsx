import { Moon, Search, Sun, TrendingUp } from "lucide-react";
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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Application branding */}
                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center  ">
                        <img
                            src="/android-chrome-512x512.png"
                            alt="Tradescape Logo"
                            className="h-11 w-11 rounded-lg object-cover"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                            Tradescape
                        </h1>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Trader Risk Dashboard
                        </p>
                    </div>

                </div>

                {/* Search trades by asset, direction, or other keywords */}
                <div className="mx-8 hidden max-w-md flex-1 lg:block">

                    <div className="relative">

                        {/* Search icon */}
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        {/* Controlled search input */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search trades..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />

                    </div>

                </div>

                {/* Dashboard actions */}
                <div className="flex items-center gap-3">

                    {/* Toggle between light and dark theme */}
                    <button
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="rounded-lg border border-slate-300 bg-white p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                        {darkMode ? (
                            <Sun
                                size={18}
                                className="text-yellow-400"
                            />
                        ) : (
                            <Moon
                                size={18}
                                className="text-slate-700"
                            />
                        )}
                    </button>

                    {/* Open the Add Trade modal */}
                    <button
                        onClick={onAddTrade}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        + Add Trade
                    </button>

                </div>

            </div>

        </header>
    );
}