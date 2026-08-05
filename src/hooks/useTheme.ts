import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// Custom hook for accessing the application's theme context
export default function useTheme() {

    // Get the current theme context
    const context = useContext(ThemeContext);

    // Ensure the hook is used inside the ThemeProvider
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    // Return theme state and helper functions
    return context;
}