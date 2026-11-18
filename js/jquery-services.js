// jquery-services.js - Loading Spinner, Chime Synchronization & Toast Notifications
$(document).ready(function () {
    console.log("jQuery is ready! (jquery-services.js)");

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
        }, 4000);
        $toast.data("toastTimer", timer);
    };

    $("#toast-close-btn").on("click", function () {
        $("#app-toast").fadeOut(200);
    });

    const $bookingForm = $("#booking-form");
    const $submitBtn = $bookingForm.find("button[type='submit']");

    $bookingForm.on("submit", function () {
        const formEl = $bookingForm[0];
        if (!formEl || formEl.dataset.validSubmit !== "true") {
            return;
        }

        const originalText = $submitBtn.html();

        $submitBtn
            .prop("disabled", true)
            .html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...');

        setTimeout(function () {
            $submitBtn.prop("disabled", false).html(originalText);

            if (typeof playNotificationChime === "function") {
                playNotificationChime();
            }

            if (typeof window.updateGlobalNavUI === "function") {
                window.updateGlobalNavUI();
            }

            const order = window.lastSubmittedOrder || {
                type: "Vehicle Order",
                car: $("#car-model").val() || "selected vehicle",
                id: "AW-1001"
            };

            const toastTitle = order.type === "Test Drive" ? "Test Drive Scheduled" : "Vehicle Order Confirmed";
            const toastMsg = order.type + " (" + order.id + ") for " + order.car + " has been saved to your Orders page!";

            window.showAppToast(toastMsg, toastTitle);

            $("#reg-password, #reg-confirm, #message").val("");
        }, 1500);
    });
});