// jquery-services.js - Assignment 6 (Tasks 6 & 7: Loading Spinner & Toast Notifications)
$(document).ready(function () {
    console.log("jQuery is ready! (jquery-services.js)");

    // Global Toast Function
    window.showAppToast = function (message, title) {
        title = title || "Notification";
        const $toast = $("#app-toast");

        if (!$toast.length) return;

        $("#toast-title").text(title);
        $("#toast-body").text(message);

        $toast.stop(true, true).fadeIn(250);

        clearTimeout($toast.data("toastTimer"));
        const timer = setTimeout(function () {
            $toast.fadeOut(300);
        }, 3500);
        $toast.data("toastTimer", timer);
    };

    $("#toast-close-btn").on("click", function () {
        $("#app-toast").fadeOut(200);
    });

    // ==========================================================
    // Task 6: Loading Spinner on Submit (and Vanilla JS conflict patch)
    // ==========================================================
    const $bookingForm = $("#booking-form");
    const $submitBtn = $bookingForm.find("button[type='submit']");
    const $vanillaSuccessMsg = $("#signup-success");

    $bookingForm.on("submit", function () {
        // If there are invalid fields, Vanilla JS will block it. Let it fail normally.
        if ($bookingForm.find(".is-invalid").length > 0) {
            return;
        }

        // Hide Vanilla JS success message so only the Toast shows up
        $vanillaSuccessMsg.hide();

        const originalText = $submitBtn.html();

        // 1. Disable submit button and show spinner
        $submitBtn
            .prop("disabled", true)
            .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');

        // 2. Simulate server delay
        setTimeout(function () {
            $submitBtn.prop("disabled", false).html(originalText);

            // Trigger Chime Sound *after* spinner completes!
            if (typeof playNotificationChime === "function") {
                playNotificationChime();
            }

            // 3. Trigger Task 7 Toast (Updated text)
            const carName = $("#car-model").val() || "selected vehicle";
            showAppToast("Your vehicle application for " + carName + " has been submitted successfully!", "Application Submitted");
            
            // Clean up
            $vanillaSuccessMsg.text("").show();
        }, 1500);
    });
});