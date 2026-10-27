// datetime.js - Task 5: current date and time (About page)
//
// Uses the Date object. The text is rebuilt every second, so the clock updates by itself.
// Format example: October 14, 2026, 10:45 AM

document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("current-datetime");

    // Stop if the block is not on this page
    if (!output) {
        return;
    }

    function formatDateTime(date) {
        // "October 14, 2026"
        const datePart = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        // "10:45:30" (newer browsers put a special space before AM/PM, so we replace it)
        const timePart = date
            .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false })
            .replace(/[\u202f\u00a0]/g, " ");

        return datePart + ", " + timePart;
    }

    function updateDateTime() {
        output.textContent = formatDateTime(new Date());
    }

    updateDateTime();                  // show it immediately
    setInterval(updateDateTime, 1000); // then refresh every 1000 ms (1 second)
});