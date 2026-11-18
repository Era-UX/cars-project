// theme.js - Requirement 3: Light and Dark Modes with localStorage persistence
document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const THEME_KEY = "autoworld_theme";

    function applyTheme(mode) {
        if (mode === "night") {
            document.body.classList.add("night-mode");
            if (themeToggleBtn) {
                themeToggleBtn.textContent = "Day Mode";
                themeToggleBtn.classList.remove("btn-warning");
                themeToggleBtn.classList.add("btn-light");
            }
        } else {
            document.body.classList.remove("night-mode");
            if (themeToggleBtn) {
                themeToggleBtn.textContent = "Night Mode";
                themeToggleBtn.classList.remove("btn-light");
                themeToggleBtn.classList.add("btn-warning");
            }
        }
    }

    // Load saved theme from localStorage on page load
    const savedTheme = localStorage.getItem(THEME_KEY) || "day";
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            const isNight = document.body.classList.contains("night-mode");
            const nextTheme = isNight ? "day" : "night";
            localStorage.setItem(THEME_KEY, nextTheme);
            applyTheme(nextTheme);
        });
    }
});