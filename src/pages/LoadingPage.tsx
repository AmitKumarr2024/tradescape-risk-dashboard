// Shown briefly while the dashboard's initial data is being prepared.
// Pure UI — no data fetching happens here, it's just a friendly wait state.
export default function LoadingPage() {
    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: "#0a0d10", color: "#e6edf3" }}
        >
            {/* Brand mark */}
            <div className="flex h-20 w-20 items-center justify-center border" style={{ borderColor: "#1e2731" }}>
                <img
                    src="/android-chrome-512x512.png"
                    alt="Tradescape Logo"
                    className="h-20 w-20 object-contain aspect-video"
                />
            </div>

            <h1 className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.08em]">
                Tradescape
            </h1>

            <p className="mt-1 font-mono text-xs" style={{ color: "#6b7785" }}>
                Loading your risk dashboard…
            </p>

            {/* Live indicator dot, matching the ticker strip's pulse pattern */}
            <div className="relative mt-6 flex h-3 w-3">
                <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: "#00d68f" }}
                />
                <span
                    className="relative inline-flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: "#00d68f" }}
                />
            </div>
        </main>
    );
}