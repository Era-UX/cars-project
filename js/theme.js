// theme.js - Assignment 5: Dynamic Style Changes (Day & Night Theme Switch)
// Toggles the "night-mode" class on document.body and updates button text.

document.addEventListener("DOMContentLoaded", function () {
    const themeBtn = document.getElementById("theme-toggle-btn");

    // Apply saved theme if user switched it earlier
    if (localStorage.getItem("autoworld-theme") === "night") {
        document.body.classList.add("night-mode");
        if (themeBtn) {
            themeBtn.textContent = "Day Mode";
        }
    }

    if (!themeBtn) {
        return;
    }

    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("night-mode");
        const isNight = document.body.classList.contains("night-mode");

        if (isNight) {
            themeBtn.textContent = "Day Mode";
            localStorage.setItem("autoworld-theme", "night");
        } else {
            themeBtn.textContent = "Night Mode";
            localStorage.setItem("autoworld-theme", "day");
        }
    });
});